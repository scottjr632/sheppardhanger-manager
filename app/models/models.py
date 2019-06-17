import sys
from datetime import datetime
import collections

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text as sa_text
import sqlalchemy.types as types
import enum
from sqlalchemy import Enum

from app import db

class StatusEnum(enum.Enum):
    archived = 'archived'
    active = 'active'


class ChoiceType(types.TypeDecorator):

    impl = types.String

    def __init__(self, choices, **kw):
        self.choices = dict(choices)
        super(ChoiceType, self).__init__(**kw)

    def process_bind_param(self, value, dialect):
        return [k for k, v in self.choices.items() if v == value][0]

    def process_result_value(self, value, dialect):
        return self.choices[value]


class TDYType(db.Model):
    __tablename__ = 'tdytype'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }


class GuestType(db.Model):
    __tablename__ = 'guesttype'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }


class RankType(db.Model):
    __tablename__ = 'ranktype'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }


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
            'housename': self.house.name if self.house else '',
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
    rank = db.Column(db.String, db.ForeignKey('ranktype.id'))
    rankname = db.relationship('RankType', backref=db.backref('ranktype', lazy=True))
    email = db.Column(db.String, unique=True)
    phone = db.Column(db.String(length=16))
    address = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    zipcode = db.Column(db.String)
    notes = db.Column(db.String)
    status = db.Column(Enum(StatusEnum, name='statusenum', create_type=False))
    reservationid = db.Column(db.Integer)
    reservation = db.relationship('Reservation', backref=db.backref('reservations', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'fname': self.fname,
            'lname': self.lname,
            'rank': self.rankname.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zipcode': self.zipcode,
            'notes': self.notes,
            'status': self.status.value if self.status else '',
            'reservations': [res.serialize() for res in self.reservation],
        }

    def update(self, **kwargs):
        for k, v in kwargs.items():
            if hasattr(self, k): setattr(self, k, v)


class Reservation(db.Model):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True)
    lesseeid = db.Column(db.Integer, db.ForeignKey('lessee.id'))
    lessee = db.relationship('Lessee', backref=db.backref('lessee', lazy=True))
    purpose = db.Column(db.String, db.ForeignKey('tdytype.id'))
    purposename = db.relationship('TDYType', backref=db.backref('tdytype', lazy=True))
    numberofguests = db.Column(db.Integer, db.ForeignKey('guesttype.id'))
    guesttype = db.relationship('GuestType', backref=db.backref('guesttype', lazy=True))
    pet = db.Column(db.Boolean)
    checkindate = db.Column(db.Date)
    checkoutdate = db.Column(db.Date)
    roomid = db.Column(db.Integer, db.ForeignKey('rooms.id'))
    room = db.relationship('Room', backref=db.backref('rooms', lazy=True))
    status = db.Column(Enum(StatusEnum, name='statusenum', create_type=False))
    notes = db.Column(db.String)
    bookingtypeid = db.Column(db.Integer, db.ForeignKey('bookingtype.id'))
    bookingtype = db.relationship('BookingType', backref=db.backref('bookingtype', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'lesseeid': self.lessee.id if self.lessee else '',
            'lesseefname': self.lessee.fname if self.lessee else '',
            'lesseelname': self.lessee.lname if self.lessee else '',
            'lesseeemail': self.lessee.email if self.lessee else '',
            'purpose': self.purposename.name if self.purpose else '',
            'numberofguests': self.guesttype.name if self.guesttype else '',
            'pet': self.pet,
            'checkindate': self.checkindate,
            'checkoutdate': self.checkoutdate,
            'lengthofstay': (self.checkoutdate - self.checkindate).days,
            'roomid': self.roomid,
            'room': self.room.name if self.room else '',
            'house': self.room.house.name if self.room else '',
            'notes': self.notes,
            'status': self.status.value if self.status else '',
            'bookingtypeid': self.bookingtypeid,
            'bookingtype': self.bookingtype.name
        }

    def update(self, **kwargs):
        for k, v in kwargs.items():
            if k == 'bookingtype': continue
            if k == 'room': continue
            if k == 'bookingtype': continue
            # if k == 'checkindate': continue
            # if k == 'checkoutdate': continue
            if v == None or v == '': continue
            if hasattr(self, k): setattr(self, k, v)


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


class RefreshToken(db.Model):
    __tablename__ = 'refreshtokens'
    __table_args__ = (
        db.PrimaryKeyConstraint('userid'),
    )

    userid = db.Column(db.Integer, db.ForeignKey('users.id'))
    tokenname = db.Column(db.String)
    token = db.Column(db.String)
    expireat = db.Column(db.Date)

    def serialize(self):
        return {
            userid: self.userid,
            tokenname: self.tokenname,
            token: self.token,
            expireat: self.expireat
        }


class EmailTemplates(db.Model):
    __tablename__ = 'email_templates'
    __table_args__ = {'extend_existing': True}

    name = db.Column(db.String, primary_key=True)
    template = db.Column(db.String)

    def serialize(self):
        return {
            'name': self.name,
            'template': self.template
        }
