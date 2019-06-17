import uuid

import jwt
import datetime

from flask import abort
from flask import current_app
from flask import make_response
from flask import g

TOKEN_EXPIRED = 'Signature expired. Please log in again.'
INVALID_TOKEN = 'Invalid token. Please log in again.'


def extract_jwt_cookie(c_requests, name: str) -> str:
    token = c_requests.cookies.get(name)
    return token


def extract_jwt_bearer(c_request, name: str) -> str:
    if not 'Authorization' in c_request.headers:
        return None

    data = c_request.headers['Authorization']
    token = str.replace(str(data), 'Bearer ','')
    return token


def after_this_request(func):
    if not hasattr(g, 'call_after_request'):
        g.call_after_request = []
    g.call_after_request.append(func)
    return func


def set_auth_token_cookie(app, token, token_name='access_token'):
    config = current_app.config 
    @after_this_request
    def after_request(response):
        print('!!!! SETTING NEW TOKEN !!!!')
        print(token)
        expire_date = datetime.datetime.now() + datetime.timedelta(days=30)
        response.set_cookie(token_name,
            token,  
            httponly=config.get('COOKIE_HTTPONLY'),
            secure=config.get('COOKIE_SECURE'),
            expires=expire_date)
        return response
    

def create_auth_token(c_request, user_id):
    from app.models.user_helpers import get_refresh_token
    token = get_refresh_token(user_id)
    refresh_token = c_request.cookies.get(token.tokenname)
    expire_date = datetime.datetime.now() + datetime.timedelta(days=30)
    if refresh_token is not None:
        config = current_app.config
        token_ttl = config.get('TOKEN_TTL')
        new_token = encode_auth_token(user_id, expire_time=token_ttl)
        return new_token
    
    return None


def check_jwt(token_extractor, c_request, app, should_refresh: bool=False) -> int:
    token = token_extractor()
    if token is None:
        abort(401)
    
    user = decode_auth_token(token)
    if should_refresh and \
       len(user) == 2 and \
       user[0] == TOKEN_EXPIRED:
        res = create_auth_token(c_request, user[1])
        if res is not None:
            set_auth_token_cookie(app, res)
            return user[1]
    
    if user == INVALID_TOKEN:
        abort(401)
    
    return user


def generate_refresh_token() -> (str, str):
    return uuid.uuid4().hex, uuid.uuid4().hex


def encode_auth_token(user_id: str, expire_time: dict = {'hours': 3, 'seconds': 5}, secret_key: str = "notasecret") -> str:
    """ Generates the Auth Token """

    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(**expire_time),
            'iat': datetime.datetime.utcnow(),
            'sub': str(user_id)
        }
        return jwt.encode(
            payload,
            secret_key,
            algorithm='HS256'
        )
    except Exception as e:
        return e


def decode_auth_token(auth_token: str, secret_key: str = "notasecret") -> str:
    """ Decodes the auth token """
    try:
        payload = jwt.decode(auth_token, secret_key)
        return payload['sub']
    except jwt.ExpiredSignatureError:
        payload = jwt.decode(auth_token, secret_key, verify=False)
        return TOKEN_EXPIRED, payload['sub']
    except jwt.InvalidTokenError:
        return INVALID_TOKEN
