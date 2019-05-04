import sys

from app import create_app
from app.config import configure_app

application = create_app('production')


configure_app(application, status="production")


if __name__ == '__main__':
    application.run()

