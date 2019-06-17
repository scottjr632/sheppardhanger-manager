import os
import sys
import re

from flask import Flask, send_from_directory, url_for, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy

from .config import configure_app
from app.bookshelf.sql_configuration import metadata
from app.bookshelf import middleware

db = SQLAlchemy(metadata=metadata)
APIV = '/api/v1'

excluded_routes = [
    '/api/v1/protected/auth/login?stayloggedin=1',
    '/api/v1/protected/auth/login'
]

jwtMiddleware = middleware.JWtMiddleware(url_prefix='{}/protected'.format(APIV), 
    excluded=excluded_routes)
def _add_middleware(app):
    middleware.Middleware(app)
    middleware.LoggerMiddleware(app).init_app(app)
    jwtMiddleware.register(app)


def _serve_client(app):
    """ serve the client frontend """
    # SERVE CLIENT
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists('app/dist/' + path):
            print(os.getcwd())
            return send_from_directory(os.getcwd() + '/app/dist/', path)
        else:
            print(os.getcwd())

            return send_from_directory(os.getcwd() + '/app/dist/', 'index.html')


def _add_sitemap(app):
    def has_no_empty_params(rule):
        defaults = rule.defaults if rule.defaults is not None else ()
        arguments = rule.arguments if rule.arguments is not None else ()
        return len(defaults) >= len(arguments)

    @app.route('/site-map')
    def site_map():
        links = []
        for rule in app.url_map.iter_rules():
            # Filter out rules we can't navigate to in a browser
            # and rules that require parameters
            if "GET" in rule.methods and has_no_empty_params(rule):
                url = url_for(rule.endpoint, **(rule.defaults or {}))
                links.append((url, rule.endpoint))
        return jsonify(links)


def _add_blueprints(app):
    """ Add blueprints """
    from app.routes import authroutes
    from app.routes import houseroutes
    from app.routes import reservationroutes
    from app.routes import lesseeroutes
    from app.routes import emailroutes

    # Blueprints
    app.register_blueprint(authroutes.mod, url_prefix=APIV + '/auth')

    jwtMiddleware.register_blueprint(authroutes.mod, url_prefix='auth')
    jwtMiddleware.register_blueprint(houseroutes.mod, url_prefix='houses')
    jwtMiddleware.register_blueprint(reservationroutes.mod, url_prefix='reservations')
    jwtMiddleware.register_blueprint(lesseeroutes.mod, url_prefix='lessee')
    jwtMiddleware.register_blueprint(emailroutes.mod, url_prefix='email')


def create_app(config_name="default", serve_client=True):
    app = Flask(__name__, static_folder='app.client')

    configure_app(app, status=config_name)
    _add_middleware(app)

    # SERVE CLIENT
    if serve_client:
        _serve_client(app)

    # Blueprints
    _add_blueprints(app)
    _add_sitemap(app)

    db.init_app(app)

    return app
