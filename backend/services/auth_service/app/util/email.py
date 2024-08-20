from flask_mail import Message, Mail
from flask import current_app
from .. import mail


def send_email(to, subject, body):
    msg = Message(subject, recipients=[to], body=body, sender=current_app.config['MAIL_DEFAULT_SENDER'])
    mail.send(msg)
