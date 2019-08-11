import sys
import datetime
import logging

from flask import make_response, jsonify, current_app
from flask import Blueprint
from flask import request

import app.utils as utils
import app.models.user_helpers as usermodel
import app.models.email_helpers as emailhelpers


mod = Blueprint('authroutes', __name__)


@mod.route('/login', methods=['POST'])
def login():

    data = request.get_json(force=True)
    keep_login = request.args.get('stayloggedin')
    config = current_app.config

    try:
        user = usermodel.authenticate_user(data['email'], data['password'])
        auth_token = None
        expire_date = datetime.datetime.now()
        r_expire = expire_date + datetime.timedelta(days=30)
        if keep_login is not None and user is not None:
            token_ttl = config.get('TOKEN_TTL')
            auth_token = utils.encode_auth_token(user.id,
                                                 expire_time=token_ttl)
            expire_date = expire_date + datetime.timedelta(hours=1)
            r_name, r_token = usermodel.create_refresh_token(user.id)
        elif user is not None:
            auth_token = utils.encode_auth_token(user.id)

        if user is not None and auth_token is not None:
            pass_reset = user.hash_version != usermodel.CURRENT_HASH_VERSION
            resp = make_response(jsonify({'id': user.id,
                                          'fname': user.fname,
                                          'lname': user.lname,
                                          'email': user.email,
                                          'shouldresetpassword': pass_reset}),
                                 200)

            resp.set_cookie('access_token',
                            auth_token,
                            httponly=config.get('COOKIE_HTTPONLY'),
                            secure=config.get('COOKIE_SECURE'),
                            expires=r_expire)
            if keep_login is not None:
                resp.set_cookie(r_name,
                                r_token,
                                httponly=config.get('COOKIE_HTTPONLY'),
                                secure=config.get('COOKIE_SECURE'),
                                expires=r_expire)

            return resp
        return make_response('User could not be authenticated', 401)

    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/authenticate', methods=['GET'])
@utils.login_required
def authenticate(*args):
    return make_response('Authenticated', 200)


@mod.route('/user/password', methods=['PUT'])
@utils.login_required
def reset_password(user):
    data = request.get_json(force=True)
    try:
        usermodel.update_user_password(user, data.get('password'))
        return make_response('Reset password', 200)
    except Exception as e:
        logging.error(e)
        return make_response('Unable to reset password', 500)        


@mod.route('/logout', methods=['POST'])
@utils.login_required
def logout(user):
    r_name = usermodel.delete_refresh_token(user)

    resp = make_response('Successfully logged out', 200)
    resp.set_cookie('access_token', '',  httponly=True, expires=0)
    if request.cookies.get(r_name) is not None:
        resp.set_cookie(r_name, '', httponly=True, expires=0)
    return resp


@mod.route('/user', methods=['GET'])
@utils.login_required
def get_user_info(userid):
    user = usermodel.find_user_by_id(userid)
    return jsonify(user.serialize())


@mod.route('/user/preferences', methods=['GET'])
@utils.login_required
def get_user_preferences(userid):
    preferences = usermodel.get_user_preferences(userid)
    return jsonify(preferences)


@mod.route('/user/preferences', methods=['POST'])
@utils.login_required
def update_user_preferences(userid):
    data = request.get_json(force=True)
    try:
        usermodel.update_user_preferences(userid, data.get('preferences'))
        return make_response('Updated preferences', 200)
    except Exception as e:
        logging.error('Unable to update user preferences')
        return make_response('Unable to update preferences', 500)


@mod.route('/user', methods=['POST'])
def new_user():
    try:
        user = usermodel.User(**request.get_json(force=True))
        user = usermodel.create_user(user, user.password)
        return make_response(str(user),  201)
    except Exception as e:
        print(e, file=sys.stderr)
        return make_response('Something went wrong', 500)


@mod.route('/user/resetpassword/email', methods=['POST'])
def get_resetpassword_token():
    data = request.get_json(force=True)
    if data.get('fquri') is None and data.get('email') is None:
        return make_response('<a href="https://http.cat/422"></a>', 422)

    user = usermodel.find_user_by_email(data.get('email'))
    if user is None:
        return make_response(jsonify({'error': 'User was not found!'}), 401)

    token = usermodel.create_reset_token(user.id)
    link = '{}/resetPassword?user={}&token={}'.format(data['fquri'],
                                                      user.email, token)

    apitoken = current_app.config.get('SENDGRID_API_TOKEN')
    email_content = 'Follow link to reset password {}'.format(link)
    status = emailhelpers.send_email('admin@admin.sheppardhanger.con',
                                     user.email,
                                     'Reset Password Link',
                                     email_content,
                                     apikey=apitoken)
    if utils.first_n_digits(status, 1) != 2:
        return make_response(jsonify({'Unable to send email'}), status)

    return make_response('Emails reset password link to {}'.
                         format(user.email))


@mod.route('/user/resetpassword/link', methods=['POST'])
def reset_password_from_link():
    data = request.get_json(force=True)
    if data.get('token') is None or data.get('password') is None:
        return make_response('<a href="https://http.cat/422"></a>', 422)

    token = data['token']
    password = data['password']

    reset_token = usermodel.get_reset_token_by_token(token, delete_after=True)
    if reset_token is not None:
        try:
            usermodel.update_user_password(reset_token.uid, password)
            return make_response('Updated password', 200)
        except Exception as e:
            logging.error(e)
            return make_response(jsonify({'error',
                                          'Unable to update users password'}),
                                 500)

    return make_response(jsonify({'error', 'Token is not valid'}), 401)


@mod.route('/user/resetpassword/token', methods=['POST'])
def verify_reset_password_token():
    data = request.get_json(force=True)
    if data.get('token') is None:
        return jsonify({'error': 'No token supplied'})

    token = data['token']
    reset_token = usermodel.get_reset_token_by_token(token)

    if reset_token is None:
        return make_response(jsonify({'error': 'Token is invalid'}), 401)

    return make_response('valid token', 200)


@mod.route('/test', methods=['GET', 'POST'])
@utils.login_required
@usermodel.require_admin
def test(userid):
    usermodel.get_user_roles(userid)
    return make_response('TEST')
