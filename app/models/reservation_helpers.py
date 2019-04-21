import app.models.models as models
from app import utils, db


def get_res_by_room(roomid) -> list:
    """ get res by room returns a list of reservations by room id"""
    return models.Reservation.query.filter_by(roomid=roomid).all()


def get_res_by_house(houseid) -> list:
    """ get res by house returns a list of reservations by house id """
    rooms = models.Room.query.filter(models.Room.houseid == houseid).all()
    roomids = [room.id for room in rooms]
    return models.Reservation.query.filter(models.Reservation.roomid.in_(roomids)).all()


def get_res_by_lessee(lesseeid) -> list:
    """ get res by userid returns a list of reservations by lessee id"""
    return models.Reservation.query.filter_by(lesseeid=lesseeid).all()


@utils.rollback_on_error
def new_reservation(data):
    reservation = models.Reservation(**data)
    db.session.add(reservation)
    db.session.commit()
