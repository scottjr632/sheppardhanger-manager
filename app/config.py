import os
import configparser

config = {
    "development": "app.bookshelf.settings.DevelopmentConfig",
    "testing": "app.bookshelf.settings.TestingConfig",
    "default": "app.bookshelf.settings.DevelopmentConfig",
    "production": "app.bookshelf.settings.ProductionConfig"
}


def configure_app(app, status="default"):
    app.config.from_object(config[status])


def get_secrets(path: str, section: str='DEFAULT') -> dict:
    config = configparser.ConfigParser()
    config.read(path)
    return config['DEFAULT']
