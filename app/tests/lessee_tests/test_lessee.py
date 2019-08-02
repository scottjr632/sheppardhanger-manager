
from app import db
import app.models.models as models


def test_lessee_query(test_client, init_db):
    lessee = models.Lessee.query.filter_by(email='jsno1@gmail.com').all()
    assert len(lessee) > 0
    assert lessee[0].email == 'jsno1@gmail.com'
    assert lessee[0].fname == 'john' and lessee[0].lname == 'sno'


def test_reservation_query(test_client, init_db):
    reservation = models.Reservation.query.get(9999999)
    assert reservation is not None
    


def test_me(test_client):
    lessees = models.Lessee.query.all()
    assert len(lessees) > 0


def test_db(test_client, init_db):
    assert True
