import json

from app import utils
from app import db
from app.models.models import UserPreferences

DEFAULT_PREFS = json.dumps({'id': ''})


@utils.rollback_on_error
def create_new_prefs(userid, connection=None):
    prefs = UserPreferences(user_id=userid, preferences=DEFAULT_PREFS)
    if not connection:
        db.session.add(prefs)
        db.session.commit()
        return

    else:
        prefs_table = UserPreferences.__table__
        connection.execute(prefs_table.insert().values(
            user_id=prefs.user_id,
            preferences=prefs.preferences
        ))
