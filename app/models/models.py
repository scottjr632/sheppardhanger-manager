from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text as sa_text

from app import db


class House(db.Model):
    __tablename__ = 'houses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }


class Room(db.Model):
    __tablename__ = 'rooms'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    houseid = db.Column(db.Integer, db.ForeignKey('houses.id'))
    house = db.relationship('House', backref=db.backref('houses', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'houseid': self.houseid
        }


class BookingType(db.Model):
    __tablename__ = 'bookingtype'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }


class Lessee(db.Model):
    __tablename__ = 'lessee'

    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String)
    lname = db.Column(db.String)
    rank = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    phone = db.Column(db.String(length=16))
    address = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    zipcode = db.Column(db.String)
    notes = db.Column(db.String)
    reservationid = db.Column(db.Integer)
    reservation = db.relationship('Reservation', backref=db.backref('reservations', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'fname': self.fname,
            'lname': self.lname,
            'rank': self.rank,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zipcode': self.zipcode,
            'notes': self.notes,
            'reservations': [res.serialize() for res in self.reservation],
        }


class Reservation(db.Model):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True)
    lesseeid = db.Column(db.Integer, db.ForeignKey('lessee.id'))
    lessee = db.relationship('Lessee', backref=db.backref('lessee', lazy=True))
    purpose = db.Column(db.String)
    numberofguests = db.Column(db.Integer)
    pet = db.Column(db.Boolean)
    checkindate = db.Column(db.Date)
    checkoutdate = db.Column(db.Date)
    roomid = db.Column(db.Integer, db.ForeignKey('rooms.id'))
    room = db.relationship('Room', backref=db.backref('rooms', lazy=True))
    notes = db.Column(db.String)
    bookingtypeid = db.Column(db.Integer, db.ForeignKey('bookingtype.id'))
    bookingtype = db.relationship('BookingType', backref=db.backref('bookingtype', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'lesseefname': self.lessee.fname,
            'lesseelname': self.lessee.lname,
            'lesseeemail': self.lessee.email,
            'purpose': self.purpose,
            'numberofguests': self.numberofguests,
            'pet': self.pet,
            'checkindate': self.checkindate,
            'checkoutdate': self.checkoutdate,
            'roomid': self.roomid,
            'room': self.room.name,
            'house': self.room.house.name,
            'notes': self.notes,
            'bookingtypeid': self.bookingtypeid,
            'bookingtype': self.bookingtype.name
        }


class ReferrerLog(db.Model):
    __tablename__ = 'referrerlog'

    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('lessee.id'))
    # user = db.relationship('Lessee', backref=db.backref('lessee', lazy=True))
    referrerid = db.Column(db.Integer, db.ForeignKey('lessee.id'))
    # referrer = db.relationship('Lessee', backref=db.backref('lessee', lazy=True))
    name = db.Column(db.String)


class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    id = db.Column(UUID(as_uuid=True), primary_key=True, server_default=sa_text("uuid_generate_v4()"))
    email = db.Column(db.String(254), unique=True, nullable=False)
    fname = db.Column(db.String)
    lname = db.Column(db.String)
    password = db.Column(db.String, nullable=False)
    salt = db.Column(db.String)
    roleid = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False, default=2)
    role = db.relationship('Roles', backref=db.backref('roles', lazy=True))

    def __repr__(self):
        return '<User %r>' % self.email

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'fname': self.fname,
            'lname': self.lname,
            'role': self.role.name
        }


class UserPreferences(db.Model):
    __tablename__ = 'user_preferences'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    preferences = db.Column(db.String)


class Roles(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)