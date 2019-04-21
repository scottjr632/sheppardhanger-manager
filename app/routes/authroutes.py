import sys

from flask import make_response, jsonify
from flask import Blueprint
from flask import request

import app.utils as utils
import app.models.user_helpers as usermodel


mod = Blueprint('authroutes', __name__)


@mod.route('/login', methods=['POST'])
def login():

    data = request.get_json(force=True)

    try:
        user = usermodel.authenticate_user(data['email'], data['password'])
        if user is not None:
            resp = make_response(jsonify({'id': user.id,
                                          'fname': user.fname,
                                          'lname': user.lname,
                                          'email': user.email}), 200)
            resp.set_cookie('access_token', utils.encode_auth_token(user.id), httponly=True)
            return resp
        return make_response('User could not be authenticated', 401)

    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/authenticate', methods=['GET'])
@utils.login_required
def authenticate(*args):
    return make_response('Authenticated', 200)


@mod.route('/logout', methods=['POST'])
@utils.login_required
def logout(*args):
    resp = make_response('Successfully logged out', 200)
    resp.set_cookie('access_token', '',  httponly=True)
    return resp


@mod.route('/user', methods=['POST'])
def new_user():
    try:
        user = usermodel.User(**request.get_json(force=True))
        user = usermodel.create_user(user, user.password)
        return make_response(str(user),  201)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/test', methods=['GET', 'POST'])
@utils.login_required
@usermodel.require_admin
def test(userid):
    usermodel.get_user_roles(userid)
    return make_response('TEST')
