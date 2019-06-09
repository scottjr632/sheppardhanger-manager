import os
import sys
from functools import wraps

import sendgrid
from sendgrid.helpers.mail import Mail, Content, MimeType


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
