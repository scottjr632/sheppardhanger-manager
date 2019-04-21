from app.models.models import House
from app.models.models import Room


def get_all_houses() -> list:
    return House.query.all()


def get_all_rooms() -> list:
    return Room.query.all()
