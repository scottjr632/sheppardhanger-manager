import json

from passlib.hash import argon2

import app.models.models as models
import app.models.user_helpers as user_helpers


def test_does_test_user_exist(test_client, init_user_db):
    user = models.User.query.get(999999999)
    assert user is not None


def test_can_reset_password(test_client, init_user_db):
    user_helpers.update_user_password(999999999, 'password')

    user = models.User.query.get(999999999)
    assert user.password is not 'not really a password'
    assert argon2.verify('password', user.password)


def test_can_user_diff_hash_version(test_client, init_user_db):
    test_pass = 'password1'
    auth = user_helpers.authenticate_user('test_old_pass@gmail', test_pass)
    auth2 = user_helpers.authenticate_user('test_old_pass@gmail', '123412341234')

    assert auth
    assert not auth2


def test_does_prompt_resert_password_old_hash_version(test_client, init_user_db):
    old_pass = 'password1'
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data = {
        'email': 'test_old_pass@gmail',
        'password': old_pass
    }
    resp = test_client.post('/api/v1/protected/auth/login',
                            data=json.dumps(data), headers=headers)
    
    assert resp.status_code == 200
    assert b"shouldresetpassword" in resp.data
    
    data = json.loads(resp.data)
    assert data['shouldresetpassword']


def test_does_update_password_to_updated_hash_version(test_client, init_user_db):
    old_pass = 'password1'
    user = models.User.query.get(999999990)
    assert user.hash_version == 1
    assert user_helpers.authenticate_user('test_old_pass@gmail', old_pass)

    user_helpers.update_user_password(999999990, 'password')
    user = models.User.query.get(999999990)
    assert user.hash_version == user_helpers.CURRENT_HASH_VERSION
    assert user_helpers.authenticate_user('test_old_pass@gmail', 'password')
    assert not user_helpers.authenticate_user('test_old_pass@gmail', old_pass)


def test_does_not_prompt_when_curr_hash_version(test_client, init_user_db):
    user_helpers.update_user_password(999999990, 'password')
    user = models.User.query.get(999999990)
    assert user.hash_version == user_helpers.CURRENT_HASH_VERSION

    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data = {
        'email': 'test_old_pass@gmail',
        'password': 'password'
    }
    resp = test_client.post('/api/v1/protected/auth/login',
                            data=json.dumps(data), headers=headers)

    assert resp.status_code == 200
    assert b"shouldresetpassword" in resp.data
    
    data = json.loads(resp.data)
    assert not data['shouldresetpassword']

