import hashlib
import json
import uuid
from functools import wraps

from werkzeug.exceptions import abort

import app.utils as utils
from app import db
from app.models.models import User

ROLES = ('admin', 'user')


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
