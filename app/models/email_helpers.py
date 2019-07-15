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
    '**DATE**': 'DATE',
    '**CURRENTMONTH**': calendar.month_name[datetime.datetime.today().month],
    '**CURRENTDATE**': datetime.datetime.today().strftime("%A, %b %d, %Y"),
    '**TOMORROWDATE**': (datetime.datetime.today() + datetime.timedelta(days=1)).strftime("%A, %b %d, %Y"),
    '**CODE**': 'code',
    '**HOUSE**': 'HOUSE',
    '**ROOM**': 'ROOM',
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


def send_email(from_email: str, to_email: str, subject: str, email: str, attachements, apikey=None) -> int:
    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject,
    )
    
    message.content = Content(MimeType.text, email)
    try:
        sg = sendgrid.SendGridAPIClient((apikey if apikey else os.environ.get('SENDGRID_API_KEY1234')))
        response = sg.send(message)
        return response.status_code
    except Exception as e:
        print(e, file=sys.stderr)
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
        if hasattr(lessee, v):
            v = lessee.__dict__[v]

        formatted_template = formatted_template.replace(k, v)
    return formatted_template


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
