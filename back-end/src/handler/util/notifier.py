import base64
import logging
import os
from email.mime.text import MIMEText
from typing import Dict

from apiclient import errors
from google.oauth2 import service_account
from googleapiclient.discovery import build
from handler.model.model_notification import ModelNotification
from handler.model.user import User
from handler.util.time_util import get_now
from src.handler.protos.san11_platform_pb2 import Activity

logger = logging.getLogger(os.path.basename(__file__))


class Notifier:
    NOTIFIER_EMAIL_ADDRESS = 'no-reply@san11pk.org'
    NOTIFIER_SERVICE_ACCOUNT_FILE = os.environ.get(
        'NOTIFIER_SERVICE_ACCOUNT_FILE')

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


def send_email(to: str, subject: str, content: str) -> None:
    '''Sends an email in the name of the backend system.'''
    Notifier().send_email(to, subject, content)


def send_message(sender_id: int, receiver_id: int, content: str,
                 link: str, image_preview: str):
    '''
    Send a message within the website.
    '''
    noti = ModelNotification(
        name='',  # autofill by method `create`.
        sender_id=sender_id,
        create_time=get_now(),
        update_time=get_now(),
        content=content,
        image_preview=image_preview,
        link=link,
    )
    noti.create(parent=f'users/{receiver_id}')

def notify(receiver: User, activity: Activity) -> None:
    ...
