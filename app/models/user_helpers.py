import hashlib
import json
import sys
import uuid
import datetime
from functools import wraps

from werkzeug.exceptions import abort
from passlib.hash import argon2

import app.utils as utils
from app import db
import app.models.models as models
from app.models.models import User

ROLES = ('admin', 'user')
ARGON2_ROUNDS = 6
CURRENT_HASH_VERSION = 2


def sha512_salted_hash(password) -> (str, str):
    """ return (salt, salted_hash) """
    salt = uuid.uuid4().hex.encode('utf-8')
    hashed_password = hashlib.sha512(password.encode('utf-8') +
                                     salt).hexdigest()
    return salt.decode('utf-8'), hashed_password


def sha512_salted_hash_verify(user: models.User, password: str) -> bool:
    hashed_password = hashlib.sha512(password.encode('utf-8') +
                                     user.salt.encode('utf-8')).hexdigest()

    return user.password == hashed_password


hash_fns = {
    1: lambda password: sha512_salted_hash(password),
    2: lambda password: argon2.using(rounds=ARGON2_ROUNDS).hash(password)
}

hash_verify_fns = {
    1: lambda user, password: sha512_salted_hash_verify(user, password),
    2: lambda user, password: argon2.verify(password, user.password)
}


@utils.rollback_on_error
def update_user_password(userid, password):
    user = User.query.get(userid)
    hash_fn = hash_fns[CURRENT_HASH_VERSION]
    user.hash_version = CURRENT_HASH_VERSION
    user.password = hash_fn(password)

    db.session.add(user)
    db.session.commit()


@utils.rollback_on_error
def create_user(user, password) -> User:
    salt = uuid.uuid4().hex.encode('utf-8')
    hash_fn = hash_fns[CURRENT_HASH_VERSION]
    user.hash_version = CURRENT_HASH_VERSION
    user.password = hash_fn(password)

    db.session.add(user)
    db.session.commit()
    return user


@utils.update_with_rollback
def update_user(user: User):
    pass


@utils.rollback_on_error
def get_user_preferences(user_id) -> dict:
    user = User.query.get(user_id)
    return json.loads(user.preferences)


@utils.rollback_on_error
def update_user_preferences(user_id: int, preferences: dict):
    str_prefs = json.dumps(preferences)
    user = User.query.get(user_id)
    user.preferences = str_prefs

    db.session.add(user)
    db.session.commit()


def authenticate_user(email, password) -> User:
    user = User.query.filter_by(email=email).first()
    if user is None:
        return user

    verify_fn = hash_verify_fns[user.hash_version]

    authenticated = verify_fn(user, password)
    if authenticated:
        return user
    else:
        return None


def get_user_by_userid(userid: int) -> models.User:
    user = User.query.query(userid)
    return user


def find_user_by_email(email) -> User:
    return User.query.filter_by(email=email).first()


def find_user_by_id(userid) -> User:
    return User.query.get(userid)


def get_user_roles(userid: User.id) -> str:
    """ returns the role of the user in a string """
    user = User.query.get(userid)
    if user is not None:
        return user.role.name

    return ''


@utils.rollback_on_error
def create_refresh_token(userid: User.id, expire={'days': 30}) -> (str, str):
    """ Generates and insert refresh token into database.
    Parameters
    ----------
    userid : string\n
        The id of the user which is creating the refresh token.\n
    expire : {'days', 'months', 'minutes'}, optional\n
        The expire time of the refresh token. 
    Returns
    -------
    string, string\n
        The first value returned is the name of the token.\n
        The second value returned is the actual token.
    """
    name, token = utils.generate_refresh_token()
    expire_time = datetime.datetime.now() + datetime.timedelta(**expire)
    refresh_token = models.RefreshToken(userid=userid,
                                        tokenname=name,
                                        token=token,
                                        expireat=expire_time)

    db.session.merge(refresh_token)
    db.session.commit()
    return name, token


@utils.rollback_on_error
def delete_refresh_token(userid: User.id) -> str:
    """ Deletes the refresh token for a user from the database.
    Returns
    -------
    string \n
        The token name to delete from cookies
    """
    refresh_token = models.RefreshToken.query.get(userid)

    if refresh_token is not None:
        db.session.delete(refresh_token)
        db.session.commit()

    return refresh_token.tokenname if refresh_token else None


def get_refresh_token(userid: int) -> models.RefreshToken:
    """ Gets the refresh token of a user.
    Returns None if refresh token is expired or none is there """
    token = models.RefreshToken.query.filter_by(userid=userid)

    if token is not None and token[0].expireat > datetime.date.today():
        return token[0]

    return None


def require_admin(f):
    """ decorator to require admin role. must be wrapped in login_required """
    @wraps(f)
    def wrapper(user, *args, **kwargs):
        if not user:
            raise Exception("require admin must be wrapped in login_required")

        role = get_user_roles(user)
        if role not in ROLES:
            abort(401)
        return f(user, *args, **kwargs)
    return wrapper


@utils.rollback_on_error
def create_reset_token(userid: int, expire={'hours': 1}) -> str:
    token, hashed_token = utils.create_reset_password_tokens()
    token_expiry = datetime.datetime.now() + datetime.timedelta(**expire)
    reset_token = models.ResetTokens(uid=userid, token=hashed_token,
                                     expires_at=token_expiry)

    db.session.merge(reset_token)
    db.session.commit()

    return token


@utils.rollback_on_error
def delete_reset_token(userid: int):
    """ Deletes the reset token for a user from the database.
    Returns
    -------
    string \n
        The token name to delete from cookies
    """
    reset_token = models.ResetTokens.query.get(userid)

    if reset_token is not None:
        db.session.delete(reset_token)
        db.session.commit()


@utils.rollback_on_error
def get_reset_token(userid: int) -> models.ResetTokens:
    """ Gets the reset token of a user.
    Returns None if reset token is expired or none is there """
    token = models.ResetTokens.query.filter_by(userid=userid)

    if token is not None and token[0].expires_at > datetime.date.today():
        return token[0]

    if token[0].expires_at > datetime.date.today():
        db.session.delete(token)
        db.session.commit()

    return None


def get_reset_token_by_token(token_name: str, delete_after=False) -> models.ResetTokens:
    hashed_token = hashlib.sha512(token_name.encode('utf-8')).hexdigest()
    token = models.ResetTokens.query.filter_by(token=hashed_token).first()

    if token is not None and token.expires_at > datetime.datetime.now():
        if delete_after:
            db.session.delete(token)
            db.session.commit()

        return token

    if token is not None and expires < datetime.datetime.now():
        db.session.delete(token)
        db.session.commit()

    return None
