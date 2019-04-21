import app.models.models as models
from app import db, utils


@utils.rollback_on_error
def add_new_lessee(info):
    lessee = models.Lessee(**info)
    db.session.add(lessee)
    db.session.commit()
