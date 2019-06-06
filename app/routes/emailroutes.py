import os

from flask import make_response, jsonify, current_app
from flask import Blueprint
from flask import request

import app.utils as utils
import app.business.templates.email_templates as templates

mod = Blueprint('emailroutes', __name__)


@mod.route('/welcome/<lesseename>', methods=['GET'])
@utils.login_required
def generate_welcome_email_text(user, lesseename):
    message = templates.RESERVATION_REPLY
    return jsonify({
        'message': message.replace('**LESSEENAME**', lesseename)
    })


@mod.route('/no-rooms/<lesseename>/<month>', methods=['GET'])
@utils.login_required
def generate_no_rooms_email_text(user, lesseename, month):
    message = templates.NO_ROOM_RESERVATION_REQUEST
    message = message.replace('**MONTH**', month)
    return jsonify({
        'message': message.replace('**LESSEENAME**', lesseename)
    })


@mod.route('/contract/<lesseename>', methods=['GET'])
@utils.login_required
def generate_contract_email_text(user, lesseename):
    message = templates.DISCUSSION
    return jsonify({
        'message': message.replace('**LESSEENAME**', lesseename)
    })


@mod.route('/', methods=['POST'])
@utils.login_required
def send_email(user):
    data = request.get_json(force=True)
    pass