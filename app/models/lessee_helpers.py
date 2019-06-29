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


@utils.rollback_on_error
def delete_lessee(lid: int):
    lessee_del = models.Lessee.query.get(lid)

    db.session.delete(lessee_del)
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


@utils.rollback_on_error
def add_new_tdy_type(name):
    tdy_type = models.TDYType(name=name)

    db.session.add(tdy_type)
    db.session.commit()
    return tdy_type


@utils.rollback_on_error
def update_tdy_type(bid, name):
    tdy_type = models.TDYType.query.get(bid)
    tdy_type.name = name

    db.session.add(tdy_type)
    db.session.commit()


@utils.rollback_on_error
def delete_tdy_type(bid):
    tdy_type = models.TDYType.query.get(bid)

    db.session.delete(tdy_type)
    db.session.commit()


def get_all_ranktype() -> list:
    return models.RankType.query.all()


@utils.rollback_on_error
def add_new_rank_type(name):
    rank_type = models.RankType(name=name)

    db.session.add(rank_type)
    db.session.commit()
    return rank_type


@utils.rollback_on_error
def update_rank_type(gid, name):
    rank_type = models.RankType.query.get(gid)
    rank_type.name = name

    db.session.add(rank_type)
    db.session.commit()


@utils.rollback_on_error
def delete_rank_type(gid):
    rank_type = models.RankType.query.get(gid)

    db.session.delete(rank_type)
    db.session.commit()


def get_all_guesttype() -> list:
    return models.GuestType.query.all()


@utils.rollback_on_error
def add_new_guest_type(name):
    guest_type = models.GuestType(name=name)

    db.session.add(guest_type)
    db.session.commit()
    return guest_type


@utils.rollback_on_error
def update_guest_type(gid, name):
    guest_type = models.GuestType.query.get(gid)
    guest_type.name = name

    db.session.add(guest_type)
    db.session.commit()


@utils.rollback_on_error
def delete_guest_type(gid):
    guest_type = models.GuestType.query.get(gid)

    db.session.delete(guest_type)
    db.session.commit()
