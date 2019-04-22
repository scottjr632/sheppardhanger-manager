import os
import sys

from flask import Flask, send_from_directory, url_for, make_response
from flask_sqlalchemy import SQLAlchemy

from .config import configure_app
from app.bookshelf.sql_configuration import metadata

db = SQLAlchemy(metadata=metadata)
APIV = '/api/v1'


def _serve_client(app):
    """ serve the client frontend """
    # SERVE CLIENT
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists('app/client/' + path):
            print(os.getcwd())
            return send_from_directory(os.getcwd() + '/app/client/', path)
        else:
            print(os.getcwd())

            return send_from_directory(os.getcwd() + '/app/client/', 'index.html')


def _add_blueprints(app):
    """ Add blueprints """
    from app.routes import authroutes
    from app.routes import houseroutes
    from app.routes import reservationroutes
    from app.routes import lesseeroutes

    # Blueprints
    app.register_blueprint(authroutes.mod, url_prefix=APIV + '/auth')
    app.register_blueprint(houseroutes.mod, url_prefix=APIV + '/houses')
    app.register_blueprint(reservationroutes.mod, url_prefix=APIV + '/reservations')
    app.register_blueprint(lesseeroutes.mod, url_prefix=APIV + '/lessee')


def create_app(config_name="default", serve_client=True):
    app = Flask(__name__, static_folder='app.client')

    configure_app(app, status=config_name)

    # SERVE CLIENT
    if serve_client:
        _serve_client(app)

    # Blueprints
    _add_blueprints(app)

    db.init_app(app)

    return app
