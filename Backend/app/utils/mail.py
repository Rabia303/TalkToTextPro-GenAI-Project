# backend/app/utils/mail.py
from flask_mail import Message
from flask import current_app

def send_email(recipient, subject, body, html_body=None):
    try:
        msg = Message(
            subject=subject,
            recipients=[recipient],
            body=body,
            html=html_body
        )
        mail_ext = current_app.extensions.get('mail')
        if not mail_ext:
            current_app.logger.error("Mail extension not configured")
            return False
        mail_ext.send(msg)
        current_app.logger.info(f"Email sent to: {recipient}")
        return True
    except Exception as e:
        current_app.logger.error(f"Failed to send email to {recipient}: {e}")
        return False
