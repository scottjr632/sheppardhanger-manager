import os
import sys
import configparser

from app.config import get_secrets
from app.definitions import ROOT_DIR

DEFAULT_CONFIG = get_secrets(ROOT_DIR + '/bookshelf/secrets/shmanager.secrets')


class BaseConfig(object):
    DEBUG = False
    TESTING = False
    ENV = "production"
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:@localhost:5432/shmanager')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    COOKIE_HTTPONLY = True
    COOKIE_SAMESITE = 'Lax'
    COOKIE_SECURE = True
    EMAIL = DEFAULT_CONFIG.get('SENGRID_EMAIL') or os.environ.get('SENGRID_EMAIL', 'scottjr632@gmail.com')
    SENDGRID_API_TOKEN = DEFAULT_CONFIG.get('SENDGRID_API_TOKEN') or os.environ.get('SENDGRID_API_TOKEN', None)
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
