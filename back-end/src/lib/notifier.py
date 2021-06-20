import logging
import os
from re import sub
from typing import Dict
from googleapiclient.discovery import build
from apiclient import errors
from httplib2 import Http
from email.mime.text import MIMEText
import base64
from google.oauth2 import service_account

from .user import User


logger = logging.getLogger(os.path.basename(__file__))


class Notifier:
    NOTIFIER_EMAIL_ADDRESS = 'no-reply@san11pk.org'
    NOTIFIER_SERVICE_ACCOUNT_FILE = os.environ.get('NOTIFIER_SERVICE_ACCOUNT_FILE')

    def __init__(self) -> None:
        self._service = self._gmail_login()

    def send_email(self, to: str, subject: str, content: str) -> None:
        body = self._create_message(to, subject, content)
        try:
            message = (self._service.users().messages().send(userId='me', body=body)
                       .execute())
        except errors.HttpError as error:
            print('An error occurred: %s' % error)
        logger.info(f'Notifier sent an email to {to}: {subject}-{content}')

    def _create_message(self, to: str, subject: str, content: str) -> Dict:
        """Create a message for an email.
        Args:
            sender: Email address of the sender.
            to: Email address of the receiver.
            subject: The subject of the email message.
            message_text: The text of the email message.
        Returns:
            An object containing a base64url encoded email object.
        """
        message = MIMEText(content)
        message['to'] = to
        message['from'] = self.NOTIFIER_EMAIL_ADDRESS
        message['subject'] = subject
        return {'raw': base64.urlsafe_b64encode(message.as_string().encode()).decode()}

    def _gmail_login(self):
        SCOPES = ['https://www.googleapis.com/auth/gmail.send']

        credentials = service_account.Credentials.from_service_account_file(
            self.NOTIFIER_SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        delegated_credentials = credentials.with_subject(
            self.NOTIFIER_EMAIL_ADDRESS)
        service = build('gmail', 'v1', credentials=delegated_credentials)
        return service
