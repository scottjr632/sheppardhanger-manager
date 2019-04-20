import os                                                                                                                       
import sys


class BaseConfig(object):
    DEBUG = False                                                                                                               
    TESTING = False                                                                                                             
    ENV = "production"
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:@localhost:5432/postgres')
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(BaseConfig):                                                                                            
    DEBUG = True                                                                                                                
    TESTING = True                                                                                                              
    ENV = "development"
    SECRET_KEY = 'not a secret key'                                                                                                    
                                                                                                                                
                                                                                                                                
class TestingConfig(BaseConfig):                                                                                                
    DEBUG = False                                                                                                               
    TESTING = True                                                                                                              
    ENV = "testing"                                                                                                             
                                                                                                                                
                                                                                                                                
class ProductionConfig(BaseConfig):                                                                                             
    DEBUG = False                                                                                                               
    TESTING = False
    try:
        SECRET_KEY = open(os.path.dirname(os.path.abspath(__file__))+'/keys/app.rsa', 'rb').read()
    except IOError:
        print("keys not found in directory: ", os.path.dirname(os.path.abspath(__file__)) + '/keys/app.rsa')
        pass