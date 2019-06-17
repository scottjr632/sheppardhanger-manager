import hashlib
import json
import uuid
import datetime
from functools import wraps

from werkzeug.exceptions import abort

import app.utils as utils
from app import db
import app.models.models as models
from app.models.models import User

ROLES = ('admin', 'user')


@utils.rollback_on_error
def update_user_password(userid, password):
    user = User.query.get(userid)
    salt = uuid.uuid4().hex.encode('utf-8')
    hashed_password = hashlib.sha512(password.encode('utf-8') + 
                                     salt).hexdigest()
    user.salt = salt.decode('utf-8')
    user.password = hashed_password

    db.session.add(user)
    db.session.commit()


@utils.rollback_on_error
def create_user(user, password) -> User:
    salt = uuid.uuid4().hex.encode('utf-8')
    hashed_password = hashlib.sha512(password.encode('utf-8') + 
                                     salt).hexdigest()
    user.salt = salt.decode('utf-8')
    user.password = hashed_password
    db.session.add(user)
    db.session.commit()
    return user


@utils.update_with_rollback
def update_user(user : User):
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

    hashed_password = hashlib.sha512(password.encode('utf-8') +
                                     user.salt.encode('utf-8')).hexdigest()
    if hashed_password == user.password:
        return user
    else:
        return None


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
        tokenname=name, token=token, expireat=expire_time)

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
