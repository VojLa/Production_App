import smtplib
from email.message import EmailMessage
from app.core.config import settings

class EmailService:
    def send_email(self, to_email:str, subject:str, html_body:str, text_body:str|None=None)->None:
        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = settings.SMTP_FROM
        msg['To'] = to_email
        msg.set_content(text_body or html_body)
        msg.add_alternative(html_body, subtype='html')
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
            if settings.SMTP_USE_TLS:
                smtp.starttls()
            if settings.SMTP_USERNAME:
                smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            smtp.send_message(msg)
