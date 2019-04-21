import sys

from sqlalchemy import event

from app import db
from app.models import models
from app.models.preferences_helpers import create_new_prefs


@db.event.listens_for(models.User, 'after_insert')
def after_user_insert(mapper, connection, target):
    print('called', file=sys.stderr)
    create_new_prefs(target.id, connection=connection)


# event.listen(models.User, 'after_insert', after_user_insert)
