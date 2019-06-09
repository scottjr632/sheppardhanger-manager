import os
import sys

from flask import make_response, jsonify, current_app
from flask import Blueprint
from flask import request

import app.utils as utils
import app.models.email_helpers as helpers
import app.business.templates.email_templates as templates

mod = Blueprint('emailroutes', __name__)


@mod.route('/templates', methods=['GET'])
@utils.login_required
def get_all_templates(user):
    templates = helpers.get_all_templates()
    print(templates, file=sys.stderr)
    return jsonify([template.serialize() for template in templates])


@mod.route('/templates', methods=['POST'])
@utils.login_required
def new_template(user):
    data = request.get_json(force=True)
    try:
        helpers.insert_new_template(data)
        return make_response('Added new template', 200)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Unable to add template', 500)


@mod.route('/templates/<name>', methods=['DELETE'])
@utils.login_required
def delete_template(user, name):
    try:
        helpers.delete_email_template(name)
        return make_response('Deleted template', 200)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Unable to delete template', 500)


@mod.route('/welcome/<lesseename>', methods=['GET'])
@utils.login_required
def generate_welcome_email_text(user, lesseename):
    message = helpers.get_template('WELCOME')
    return jsonify({
        'message': message.replace('**LESSEENAME**', lesseename)
    })


@mod.route('/no-rooms/<lesseename>/<month>', methods=['GET'])
@utils.login_required
def generate_no_rooms_email_text(user, lesseename, month):
    message = helpers.get_template('NO ROOMS')
    message = message.replace('**MONTH**', month)
    return jsonify({
        'message': message.replace('**LESSEENAME**', lesseename)
    })


@mod.route('/contract/<lesseename>', methods=['GET'])
@utils.login_required
def generate_contract_email_text(user, lesseename):
    message = helpers.get_template('CONTRACT')
    return jsonify({
        'message': message.replace('**LESSEENAME**', lesseename)
    })

@mod.route('/', methods=['POST'])
@utils.login_required
def send_email(user):
    data = request.get_json(force=True)
    email = current_app.config.get('EMAIL')
    apitoken = current_app.config.get('SENDGRID_API_TOKEN')
    res = helpers.send_email(
        email, 
        data.get('email'),
        data.get('subject'),
        data.get('email_text'),
        data.get('attachements'),
        apikey=apitoken)

    return make_response('Sent email', res)
