import os
import sys
import configparser
import logging

from app.config import get_secrets
from app.definitions import ROOT_DIR

DEFAULT_CONFIG = get_secrets(ROOT_DIR + '/bookshelf/secrets/shmanager.secrets')


class BaseConfig(object):
    DEBUG = False
    TESTING = False
    ENV = "production"

    LOG_FILENAME = 'shmanager.log'

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:@localhost:5432/shmanager')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    COOKIE_HTTPONLY = True
    COOKIE_SAMESITE = 'Lax'
    COOKIE_SECURE = True
    TOKEN_TTL = {
        'hours' : 1
    }

    EMAIL = DEFAULT_CONFIG.get('SENGRID_EMAIL') or os.environ.get('SENGRID_EMAIL', 'scottjr632@gmail.com')
    SENDGRID_API_TOKEN = DEFAULT_CONFIG.get('SENDGRID_API_TOKEN') or os.environ.get('SENDGRID_API_TOKEN', None)


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    ENV = "development"
    LOG_LEVEL = logging.DEBUG

    COOKIE_SECURE = False
    TOKEN_TTL = {
        'seconds': 15
    }

    SECRET_KEY = 'not a secret key'

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
