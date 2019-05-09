import sys

import app.models.models as models
from app import db, utils


@utils.rollback_on_error
def add_new_lessee(info) -> models.Lessee:
    lessee = models.Lessee(**info)
    db.session.add(lessee)
    db.session.commit()
    return lessee


def get_all_lessees() -> list:
    return models.Lessee.query.order_by(models.Lessee.id.desc()).all()


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
