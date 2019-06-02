from sqlalchemy import or_

import app.models.models as models
from app import utils, db


def get_res_by_id(resid) -> models.Reservation:
    return models.Reservation.query.get(resid)


def get_res_by_room(roomid) -> list:
    """ get res by room returns a list of reservations by room id"""
    return models.Reservation.query.filter_by(roomid=roomid).all()


def get_res_by_house(houseid) -> list:
    """ get res by house returns a list of reservations by house id """
    rooms = models.Room.query.filter(models.Room.houseid == houseid).all()
    roomids = [room.id for room in rooms]
    return models.Reservation.query.filter(models.Reservation.roomid.in_(roomids)).all()


def get_res_by_lessee_unfiltered(lesseeid) -> list:
    """ get res by userid returns a list of reservations by lessee id"""
    return models.Reservation.query.filter_by(lesseeid=lesseeid).all()


def get_res_by_lessee_filtered(lesseeid) -> list:
    """ gets reservatiosn by lessee that are not archived """
    return models.Reservation.query \
            .filter(or_(models.Reservation.status == None,
                        models.Reservation.status != models.StatusEnum.archived), 
                    models.Reservation.lesseeid == lesseeid)


def get_all_res() -> list:
    return models.Reservation.query.all()


def get_all_res_filtered() -> list:
    return models.Reservation.query \
            .filter(or_(models.Reservation.status == None, 
                        models.Reservation.status != models.StatusEnum.archived)) \
            .order_by(models.Reservation.id.desc())


@utils.rollback_on_error
def set_res_archived_status(resid: int, status: str):
    reservation = models.Reservation.query.get(resid)
    if hasattr(models.StatusEnum, status):
        reservation.status = status
    else:
        raise Exception ('status must be of type Enum')
    
    db.session.add(reservation)
    db.session.commit()


def get_all_bookingtypes() -> list:
    return models.BookingType.query.all()


@utils.rollback_on_error
def new_reservation(data) -> models.Reservation:
    reservation = models.Reservation(**data)
    db.session.add(reservation)
    db.session.commit()
    print(reservation.serialize(), 'reservation stuff')
    return reservation


@utils.rollback_on_error
def update_reservation(reservation: models.Reservation):
    res = models.Reservation.query.get(reservation['id'])
    res.update(**reservation)

    db.session.add(res)
    db.session.commit()


@utils.rollback_on_error
def delete_reservation(res_id):
    res = models.Reservation.query.get(res_id)

    db.session.delete(res)
    db.session.commit()
