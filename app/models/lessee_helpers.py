import sys

from sqlalchemy import or_

import app.models.models as models
from app import db, utils


@utils.rollback_on_error
def add_new_lessee(info) -> models.Lessee:
    lessee = models.Lessee(**info)
    db.session.add(lessee)
    db.session.commit()
    return lessee


@utils.rollback_on_error
def set_lessee_archived_status(lesseeid: int, status: str):
    lessee = models.Lessee.query.get(lesseeid)
    if hasattr(models.StatusEnum, status):
        lessee.status = status
    else:
        raise Exception ('status must be of type Enum')
    
    db.session.add(lessee)
    db.session.commit()


@utils.rollback_on_error
def update_lessee(lessee: models.Lessee):
    lessee_upd = models.Lessee.query.get(lessee['id'])
    lessee_upd.update(**lessee)

    db.session.add(lessee_upd)
    db.session.commit()


def get_all_lessees() -> list:
    return models.Lessee.query.order_by(models.Lessee.id.desc()).all()


def get_all_lessees_filtered() -> list:
    return models.Lessee.query \
        .filter(or_(models.Lessee.status == None, 
                    models.Lessee.status != models.StatusEnum.archived)) \
        .order_by(models.Lessee.id.desc())


def get_lessee_info(lid: int) -> models.Lessee:
    return models.Lessee.query.get(lid)


def get_lessee_by_email(email: str) -> list:
    return models.Lessee.query.filter_by(email=email).all()


def get_all_tydtypes() -> list:
    return models.TDYType.query.all()


def get_all_ranktype() -> list:
    return models.RankType.query.all()


def get_all_guesttype() -> list:
    return models.GuestType.query.all()
