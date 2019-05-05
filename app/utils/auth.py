import jwt
import datetime

TOKEN_EXPIRED = 'Signature expired. Please log in again.'
INVALID_TOKEN = 'Invalid token. Please log in again.'


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
        return TOKEN_EXPIRED
    except jwt.InvalidTokenError:
        return INVALID_TOKEN
