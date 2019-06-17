import re
import logging

from flask import make_response
from werkzeug.wrappers import Request

# from app.utils import auth    


class FlaskMiddleware(object):

    def __init__(self, app=None, *args, **kwargs):
        self.app = app
        self.wsgi_app = app.wsgi_app if app is not None else None
        if app is not None:
          app.wsgi_app = self

    def __call__(self, environ, start_response):
        raise NotImplementedError(r"""
        Please add __call__(self, environ, start_response) method must be implemented!
        """)

    def init_app(self, app):
        pass

    def register(self, app):
      if self.app is None:
        self.app = app
        self.wsgi_app = app.wsgi_app
        app.wsgi_app = self
        return self


class JWtMiddleware(FlaskMiddleware):

    def __init__(self, app=None, url_prefix='protected', excluded=[], *args, **kwargs):
        super(JWtMiddleware, self).__init__()
        self.excluded = excluded
        self.app = app
        self.wsgi_app = app.wsgi_app if app is not None else None
        self.url_prefix = url_prefix

    def __call__(self, environ, start_response):
        request = Request(environ)
        match = re.search(r'{}\b'.format(self.url_prefix), request.path)
        if match and request.path not in self.excluded:
            from app.utils import auth
            with self.app.app_context():
                user_id = auth.check_jwt(
                    lambda: auth.extract_jwt_cookie(request, 'access_token'),
                    request,
                    self.app,
                    should_refresh=True)

                environ['user'] = user_id
            print('path: %s, url: %s' % (request.path, request.url))
            print('FOUND IN JWT MIDDLEWARE')

        return self.wsgi_app(environ, start_response)

    def register_blueprint(self, blueprint, url_prefix=''):
        print('Added protected blueprint {}'.format(blueprint))
        self.app.register_blueprint(blueprint, 
            url_prefix='{}/{}'.format(self.url_prefix, url_prefix))


class LoggerMiddleware(FlaskMiddleware):

    def init_app(self, app):
        import logging
        from logging.handlers import RotatingFileHandler

        log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(funcName)s(%(lineno)d) %(message)s')

        filename = app.config.get('LOG_FILENAME') or 'out.log'
        log_level = app.config.get('LOG_LEVEL') or logging.ERROR

        my_handler = RotatingFileHandler(filename, mode='a', maxBytes=5*1024*1024, 
                                        backupCount=2, encoding=None, delay=0)
        my_handler.setFormatter(log_formatter)
        my_handler.setLevel(log_level)

        app_log = logging.getLogger('root')
        app_log.setLevel(log_level)

        app_log.addHandler(my_handler)

    def __call__(self, environ, start_response):
        request = Request(environ)

        # logging.warning('Watch out!')  # will print a message to the console
        logging.info(request)
        logging.debug(request)

        return self.wsgi_app(environ, start_response)


class Middleware(FlaskMiddleware):

  def __call__(self, environ, start_response):
      return self.wsgi_app(environ, start_response)
