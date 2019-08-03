import pytest
import json
import importlib
import sys

from app import create_app, db

APP_CONTEXT = None
TO_DELETE = []

def add_to_db(data: dict):
    for obj in data:
        if 'model' not in obj.keys() or 'records' not in obj.keys() :
            print(obj, file=sys.stderr)
            raise Exception('Unable to find model')
            continue

        path = obj['model'].rsplit('.', 1)
        if len(path) < 2:
            raise Exception('Models path is incorrect format {}'.format(path))

        imp = importlib.import_module(path[0])
        model = getattr(imp, path[1])

        for record in obj['records']:
            new_model = model(**record)
            db.session.add(new_model)
            db.session.commit()

            TO_DELETE.append(new_model)


@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app(config_name='testing', serve_client=False)

    # Flask provides a way to test your application by exposing the Werkzeug test Client
    # and handling the context locals for you.
    testing_client = flask_app.test_client()

    # Establish an application context before running the tests.
    ctx = flask_app.app_context()
    APP_CONTEXT = ctx
    ctx.push()

    yield testing_client  # this is where the testing happens!

    for obj in TO_DELETE:
        db.session.delete(obj)
        db.session.commit() 

    ctx.pop()


@pytest.fixture(scope='module')
def init_user_db():
    data = []
    with open('app/tests/fixtures/users.json') as json_file:
        data = json.load(json_file)

    add_to_db(data)
    yield db


@pytest.fixture(scope='module')
def init_db():

    data = []
    with open('app/tests/fixtures/lessee.json') as json_file:
        data = json.load(json_file)

    add_to_db(data)
    yield db
