import datetime
import calendar

from app import db
import app.models.models as models
import app.models.email_helpers as email_helpers


def test_return_current_reservation(test_client):
    """ should return the current reservation """
    today = datetime.date.today()
    test_reservations = [
        models.Reservation(checkindate=today + datetime.timedelta(days=3), checkoutdate=today + datetime.timedelta(days=4)).serialize(),
        models.Reservation(checkindate=today - datetime.timedelta(days=40), checkoutdate=today - datetime.timedelta(days=8)).serialize(),
        models.Reservation(checkindate=today - datetime.timedelta(days=6), checkoutdate=today + datetime.timedelta(days=7)).serialize()
    ]

    assert email_helpers.return_current_reservation(*test_reservations) == test_reservations[2]
    assert email_helpers.return_current_reservation(*test_reservations) != test_reservations[1]


def test_return_upcomming_reservation(test_client):
    today = datetime.date.today()
    test_reservations = [
        models.Reservation(checkindate=today + datetime.timedelta(days=3), checkoutdate=today + datetime.timedelta(days=4)).serialize(),
        models.Reservation(checkindate=today - datetime.timedelta(days=40), checkoutdate=today - datetime.timedelta(days=8)).serialize(),
        models.Reservation(checkindate=today + datetime.timedelta(days=6), checkoutdate=today + datetime.timedelta(days=7)).serialize()
    ]
    assert email_helpers.return_current_reservation(*test_reservations) == test_reservations[0]
    assert email_helpers.return_current_reservation(*test_reservations) != test_reservations[1]


def test_return_none_for_no_reservations(test_client):
    today = datetime.date.today()
    test_reservations = [
        models.Reservation(checkindate=today - datetime.timedelta(days=3), checkoutdate=today - datetime.timedelta(days=4)).serialize(),
        models.Reservation(checkindate=today - datetime.timedelta(days=40), checkoutdate=today - datetime.timedelta(days=8)).serialize(),
        models.Reservation(checkindate=today -datetime.timedelta(days=6), checkoutdate=today - datetime.timedelta(days=7)).serialize()
    ]

    assert email_helpers.return_current_reservation(*test_reservations) is None


def test_get_template_by_name(test_client, init_db):
    template = models.EmailTemplates.query.get('my test template')
    assert template is not None
    assert len(template.template) > 0
    assert template.template == 'this is a cool template'


def test_should_fill_current_month_template(test_client, init_db):
    month = calendar.month_name[datetime.date.today().month]
    template = models.EmailTemplates.query.get('has a current month')

    formatted = email_helpers.format_template(template.template, 'jsno1@gmail.com')
    assert month in formatted


def test_should_fill_with_checkindate(test_client, init_db):
    template = models.EmailTemplates.query.get('has upcomming check in date')
    reservation = models.Reservation.query.get(9999999)
    assert reservation is not None

    formatted = email_helpers.format_template(template.template, 'jsno1@gmail.com')
    assert str(reservation.checkindate) in formatted


def test_should_fill_with_checkoutdate(test_client, init_db):
    template = models.EmailTemplates.query.get('has upcomming check out date')
    reservation = models.Reservation.query.get(9999999)
    assert reservation is not None

    formatted = email_helpers.format_template(template.template, 'jsno1@gmail.com')
    assert str(reservation.checkoutdate) in formatted