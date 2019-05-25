import sys
import decimal
from functools import wraps
import json
import requests

from flask import abort, request, Response, current_app, make_response

from app import db
from .auth import *


def is_valid_json(json_test: str) -> bool:
    try:
        json.loads(json_test)
        return True
    except ValueError:
        return False


def dump_datetime(value):
    """Deserialize datetime object into string form for JSON processing."""
    if value is None:
        return None
    return value.strftime("%Y-%m-%d")


def rollback_on_error(f):
    """ Function wrapper that will cause the db session to be rolled back if
    if there is an error
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            db.session.rollback()
            raise e
    return wrapper


def delete_with_rollback(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            f(*args, **kwargs)

            db.session.delete(*args, **kwargs)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
    return wrapper


def insert_with_rollback(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            f(*args, **kwargs)

            db.session.add(*args, **kwargs)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
    return wrapper


def update_with_rollback(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            f(*args, **kwargs)
            
            db.session.add(*args, **kwargs)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
    return wrapper


class proxy(object):
    def __init__(self, proxy_url: str, *args, **kwargs):
        self.proxy_url = proxy_url

    def __call__(self, f):
        def wrapper(*args):
            resp = requests.request(
                    method=request.method,
                    url=request.url.replace(request.host_url, self.proxy_url),
                    headers={key: value for (key, value) in request.headers if key != 'Host'},
                    data=request.get_data(),
                    cookies=request.cookies,
                    allow_redirects=False
            )

            excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
            headers = [(name, value) for (name, value) in resp.raw.headers.items()
                    if name.lower() not in excluded_headers]

            response = Response(resp.content, resp.status_code, headers)
            return response


class CustomProxy(object):
    """ CustomProxy creates a custom proxy object with a wrapper proxy.

    CustomProxy's wrapper `proxy` will proxy requests using Flasks request proxy
    to the custom proxy_url provided on object instantiation.
    :param: str -> proxy_url: url to proxy to

    """
    def __init__(self, proxy_url: str, *args, **kwargs):
        self.proxy_url = proxy_url

    def proxy(self, f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            resp = requests.request(
                    method=request.method,
                    url=request.url.replace(request.host_url, self.proxy_url),
                    headers={key: value for (key, value) in request.headers if key != 'Host'},
                    data=request.get_data(),
                    cookies=request.cookies,
                    allow_redirects=False
            )

            excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
            headers = [(name, value) for (name, value) in resp.raw.headers.items()
                    if name.lower() not in excluded_headers]

            response = Response(resp.content, resp.status_code, headers)
            return f(response, *args, **kwargs)
        return wrapper


def clean_redis_res_dict(res: bytes) -> dict:
    """ Cleans a redis response and returns dict
    """
    prefs = res.decode('utf-8').replace("\'", "\"")
    prefs = prefs.replace("None", '"null"')
    return json.loads(prefs)


def clean_redis_res_str(res: bytes) -> str:
    """ Cleans a redis response and returns a str
    """
    return res.decode('utf-8')


def clean_redis_res_list(res: bytes) -> list:
    """ Cleans a redis response and returns a str
    """
    ls = res.decode('utf-8')
    return list(ls)


def jwt_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not 'Authorization' in request.headers:
            abort(401)

        user = None
        data = request.headers['Authorization']
        token = str.replace(str(data), 'Bearer ','')
        try:
            user = decode_auth_token(token)
            if user == TOKEN_EXPIRED or user == INVALID_TOKEN:
                abort(401)
            # check if blacklisted
            # if int(authentited) == 0:
            #     abort(401)

        except:
            abort(401)

        return f(user, *args, **kwargs)            
    return wrapper


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.cookies.get('access_token')
        if token is None and 'Authorization' in request.headers:
            data = request.headers['Authorization']
            token = str.replace(str(data), 'Bearer ','')
        try:
            user = decode_auth_token(token)
            # if the token is expired check refresh token
            if len(user) == 2 and user[0] == TOKEN_EXPIRED:
                from app.models.user_helpers import get_refresh_token
                token = get_refresh_token(user[1])
                refresh_token = request.cookies.get(token.tokenname)
                expire_date = datetime.datetime.now() + datetime.timedelta(days=30)
                if refresh_token is not None:
                    config = current_app.config
                    token_ttl = config.get('TOKEN_TTL')
                    new_token = encode_auth_token(user[1], expire_time=token_ttl)
                    res = f(user[1], *args, **kwargs)
                    resp = make_response(res, 200)
                    resp.set_cookie('access_token', 
                             new_token, 
                             httponly=config.get('COOKIE_HTTPONLY'),
                             secure=config.get('COOKIE_SECURE'),
                             expires=expire_date)
                    return resp
            if user == INVALID_TOKEN:
                abort(401)

        except Exception as e:
            print(e, file=sys.stderr)
            print('error token')
            abort(401)

        return f(user, *args, **kwargs)
    return wrapper


def remove_decimals(e: object) -> object:
    """ Returns a copy of the object with decimals removed 
        Works on dict : list : tuple
    """
    if isinstance(e, dict):
        c_dict = e.copy()
        for k, v in c_dict.items():
            if isinstance(v, decimal.Decimal):
                c_dict[k] = str(v)
        return c_dict
    
    if isinstance(e, list):
        c_list = e.copy()
        for idx, v in enumerate(c_list):
            if isinstance(v, decimal.Decimal):
                c_list[idx] = str(v)
        return c_list

    if isinstance(e, tuple):
        c_tuple = list(e)
        for idx, v in enumerate(c_tuple):
            if isinstance(v, decimal.Decimal):
                c_tuple[idx] = str(v)
        return tuple(c_tuple)

    return e
