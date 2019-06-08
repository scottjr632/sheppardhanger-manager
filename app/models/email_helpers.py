import os

import sendgrid
from sendgrid.helpers.mail import Mail


def send_email(from_email: str, to_email: str, subject: str, email: str, attachements, apikey=None) -> int:
    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject,
        html_content=email
    )
    sg = sendgrid.SendGridAPIClient((apikey if apikey else os.environ.get('SENDGRID_API_KEY1234')))
    response = sg.send(message)
    return response.status_code
