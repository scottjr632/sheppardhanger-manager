import os
import sys
import logging
import calendar
import datetime
from functools import wraps

import sendgrid
from sendgrid.helpers.mail import Mail, Content, MimeType

import app.models.models as models
import app.models.lessee_helpers as lessee_helpers
from app import db, utils


FORMATTERS = {
    '**LESSEENAME**': 'fname',
    '**DATE**': '#*#* DATE #*#*',
    '**CURRENTMONTH**': calendar.month_name[datetime.datetime.today().month],
    '**CURRENTDATE**': datetime.datetime.today().strftime("%A, %b %d, %Y"),
    '**TOMORROWDATE**':
        (datetime.datetime.today() +
         datetime.timedelta(days=1)).strftime("%A, %b %d, %Y"),

    '**CODE**': 'reservation:doorcode',
    '**HOUSE**': 'reservation:house',
    '**ROOM**': 'reservation:room',
    '**RESERVATIONCHECKINDATE**': 'reservation:checkindate',
    '**RESERVATIONCHECKOUTDATE**': 'reservation:checkoutdate',
    '**RESERVATIONMONTH**': 'reservation:month',
    '**LESSEEADDRESS**': 'address',
    '**LESSE1**': 'LESSEE'
}


def format_email_template(email: str, **kwargs) -> str:
    """ formats an email template with the proper format thingys.
    the kwargs should be a dictionary and replacers should start
    and end with ** """

    for k, v in kwargs.items():
        email = email.replace(k, v)

    return email


def html_wrapper(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return '<html>{}</html'.format(f(*args, **kwargs)) 
    return wrapper


def send_email(from_email: str, to_email: str, subject: str, email: str, 
               attachements=[], apikey=None) -> int:
    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject,
    )

    message.content = Content(MimeType.text, email)
    try:
        apikey = apikey if apikey else os.environ.get('SENDGRID_API_KEY1234')
        sg = sendgrid.SendGridAPIClient(apikey)
        response = sg.send(message)
        return response.status_code
    except Exception as e:
        logging.error(e)
        return 500


def get_all_templates() -> list:
    res = models.EmailTemplates.query.all()
    return res


def get_template(template_name: str) -> str:
    res = models.EmailTemplates.query.get(template_name)
    return res.template if res is not None else ''


def get_email_template(template_name: str) -> models.EmailTemplates:
    return models.EmailTemplates.query.get(template_name)


def format_template(template: str, lessee_email: str) -> str:
    logging.info('TESTETESTESTETSETSTSETETES')
    lessee = lessee_helpers.get_lessee_by_email(lessee_email)
    if not len(lessee) == 1:
        raise Exception('Unable to find lessee with email %s' % lessee_email)

    lessee = lessee[0]
    formatted_template = template
    for k, v in FORMATTERS.items():
        test = v.split(':')
        if test[0] == 'reservation':
            reservataions = lessee.serialize()['reservations']
            res = return_current_reservation(*reservataions)
            if res is not None:
                if test[1] == 'month':
                    v = calendar.month_name[res['checkindate'].month]
                else:
                    v = res[test[1]] or v
            else:
                v = '#*#* NO CURRENT RESERVATION FOUND *#*#'
        elif hasattr(lessee, v):
            v = lessee.__dict__[v]

        formatted_template = formatted_template.replace(k, str(v))
    return formatted_template


def return_current_reservation(*reservataions) -> bool:
    from datetime import date
    c_date = date.today()
    for res in reservataions:
        if res['checkindate'] <= c_date <= res['checkoutdate']:
            return res
    for res in reservataions:
        if res['checkindate'] >= c_date:
            return res

    return None


@utils.rollback_on_error
def update_template_name(old_name: str, new_name: str):
    template = models.EmailTemplates.query.get(old_name)
    template.name = new_name.upper()

    db.session.add(template)
    db.session.commit()


@utils.rollback_on_error
def insert_new_template(data):
    template = models.EmailTemplates(**data)

    db.session.merge(template)
    db.session.commit()


@utils.rollback_on_error
def delete_email_template(name):
    template = models.EmailTemplates.query.get(name)

    db.session.delete(template)
    db.session.commit()
