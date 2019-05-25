import os
import sys


class BaseConfig(object):
    DEBUG = False
    TESTING = False
    ENV = "production"
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:@localhost:5432/shmanager')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    COOKIE_HTTPONLY = True
    COOKIE_SAMESITE = 'Lax'
    COOKIE_SECURE = True
    TOKEN_TTL = {
        'hours' : 1
    }


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    ENV = "development"
    SECRET_KEY = 'not a secret key'
    COOKIE_SECURE = False
    TOKEN_TTL = {
        'minutes': 1
    }


class TestingConfig(BaseConfig):
    DEBUG = False
    TESTING = True
    ENV = "testing"


class ProductionConfig(BaseConfig):
    DEBUG = False
    TESTING = False
    try:
        SECRET_KEY = open(os.path.dirname(os.path.abspath(__file__)) + '/keys/app.rsa', 'rb').read()
    except IOError:
        print("keys not found in directory: ", os.path.dirname(os.path.abspath(__file__)) + '/keys/app.rsa')
        pass
