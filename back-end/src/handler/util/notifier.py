import base64
import logging
import os
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Union

from apiclient import errors
from google.oauth2 import service_account
from googleapiclient.discovery import build

from handler.common.env import Env, get_env
from handler.common.visitor import _methods, visitor
from handler.model.model_binary import ModelBinary
from handler.model.model_comment import ModelComment
from handler.model.model_notification import ModelNotification
from handler.model.model_package import ModelPackage
from handler.model.model_reply import ModelReply
from handler.model.model_thread import ModelThread
from handler.model.model_user import ModelUser
from handler.util.html_util import get_mentioned_users
from handler.util.name_util import get_parent
from handler.util.resource_parser import find_resource
from handler.util.resource_view import ResourceViewVisitor, get_resource_url
from handler.util.time_util import get_now

logger = logging.getLogger(os.path.basename(__file__))

TESTING_RECEIVERS = ['ycao181@gmail.com']


class Notifier:
    NOTIFIER_EMAIL_ADDRESS = 'no-reply@san11pk.org'
    NOTIFIER_SERVICE_ACCOUNT_FILE = os.environ.get(
        'NOTIFIER_SERVICE_ACCOUNT_FILE')

    def __init__(self) -> None:
        self._service = self._gmail_login()

    def send_email(self, message: MIMEMultipart) -> None:
        if get_env() == Env.DEV and message['to'] not in TESTING_RECEIVERS:
            logger.debug(f"Skip sending email: {message}")
            return
        raw_message = base64.urlsafe_b64encode(
            message.as_bytes()).decode('utf-8')
        try:
            message = self._service.users().messages().send(
                userId='me', body={'raw': raw_message}).execute()
            logger.debug(f"Message Id: {message['id']}")
        except errors.HttpError as error:
            logger.debug(f"An error occurred: {error}")

    def _gmail_login(self):
        SCOPES = ['https://www.googleapis.com/auth/gmail.send']

        credentials = service_account.Credentials.from_service_account_file(
            self.NOTIFIER_SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        delegated_credentials = credentials.with_subject(
            self.NOTIFIER_EMAIL_ADDRESS)
        service = build('gmail', 'v1', credentials=delegated_credentials)
        return service


def send_email(receiver: str, subject: str, content: str) -> None:
    message = MIMEMultipart()
    message['to'] = receiver
    message['subject'] = subject
    message.attach(MIMEText(content))
    Notifier().send_email(message)

def _send_notification(sender_id: int, receiver_id: int, content: str,
                      link: str, image_preview: str):
    '''
    Sends a notification to the user.
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


def notify(sender: ModelUser, receiver: ModelUser, content: str,
           link: str, image_preview: str) -> None:
    '''
    '''
    # 1. Send notification to the user.
    _send_notification(
        sender.user_id, receiver.user_id, content, link, image_preview
    )

    # 2. if the user has enabled email notification, send an email.
    if receiver.settings.notification.send_emails:
        # TODO: pass notifier as an argument.
        Notifier().send_email(
            _create_message(sender.email,
                           receiver.email,
                           f'{sender.username} 在 San11pk 上发了一条消息',
                           content,
                           link))

def _create_message(sender: str, receiver: str, subject: str, content: str, link: str) -> MIMEMultipart:
    message = MIMEMultipart()
    message['to'] = receiver
    message['from'] = sender
    message['subject'] = subject
    message.attach(MIMEText(content))

    message.attach(MIMEText(f"<a href='{link}'>点击查看</a>", 'html'))
    return message


class CreationNotifier:
    @visitor(ModelPackage)
    def visit(self, package: ModelPackage) -> None:  # type: ignore
        '''Notify all subscribers of the author when a new package is created.'''
        author = ModelUser.from_user_id(package.author_id)
        view = ResourceViewVisitor().visit(package)  # type: ignore
        link = get_resource_url(package)
        for sub in package.list_subscriptions():
            subscriber = ModelUser.from_name(sub.subscriber_name)
            if not subscriber.settings.notification.subscriptions:
                continue
            notify(
                sender=author,
                receiver=subscriber,
                content=f'{author.username} 发布了 {view.display_name}',
                link=link,
                image_preview=view.image_url,
            )

    @visitor(ModelBinary)
    def visit(self, binary: ModelBinary) -> None:  # type: ignore
        '''
        Notify
            * subscribers of the author
            * subscribers of the package
        '''
        package = ModelPackage.from_name(get_parent(binary.name))
        author = ModelUser.from_user_id(package.author_id)
        view = ResourceViewVisitor().visit(package)  # type: ignore
        link = get_resource_url(binary)

        notified_users = set()
        for sub in package.list_subscriptions():
            subscriber = ModelUser.from_name(sub.subscriber_name)
            if not subscriber.settings.notification.subscriptions:
                continue
            notified_users.add(subscriber.user_id)
            notify(
                sender=author,
                receiver=subscriber,
                content=f'{author.username} 更新了 {view.display_name}',
                link=link,
                image_preview=view.image_url,
            )
            notified_users.add(subscriber.user_id)

        for sub in author.list_subscriptions():
            subscriber = ModelUser.from_name(sub.subscriber_name)
            if subscriber.user_id in notified_users:
                continue
            if not subscriber.settings.notification.subscriptions:
                continue
            notify(
                sender=author,
                receiver=subscriber,
                content=f'{author.username} 更新了 {view.display_name}',
                link=link,
                image_preview=view.image_url,
            )
            notified_users.add(subscriber.user_id)

    @visitor(ModelThread)
    def visit(self, thread: ModelThread) -> None:  # type: ignore
        '''
        Notify
            * parent resource author
            * Mentioned users
        '''
        return self._visit_post(thread)

    @visitor(ModelComment)
    def visit(self, comment: ModelComment) -> None:  # type: ignore
        '''
        Notify
            * parent resource author
            * Mentioned users
        '''
        return self._visit_post(comment)

    @visitor(ModelReply)
    def visit(self, reply: ModelReply) -> None:  # type: ignore
        '''
        Notify
            * parent resource author
            * Mentioned users
        '''
        return self._visit_post(reply)

    def _visit_post(self, post: Union[ModelComment, ModelReply, ModelThread]) -> None:
        '''
        Notify
            * parent resource author
            * Mentioned users
        '''
        author = ModelUser.from_user_id(post.author_id)
        view = ResourceViewVisitor().visit(post)  # type: ignore
        link = get_resource_url(post)

        notified_users = set()
        parent_resource_author = ModelUser.from_user_id(
            find_resource(get_parent(post.name)).author_id)

        enabled = False
        if isinstance(post, ModelThread):
            enabled = parent_resource_author.settings.notification.threads
        elif isinstance(post, ModelComment) or isinstance(post, ModelReply):
            enabled = parent_resource_author.settings.notification.comments

        if enabled:
            notify(
                sender=author,
                receiver=parent_resource_author,
                content=f'{author.username} 评论了 {view.display_name}',
                link=link,
                image_preview=view.image_url,
            )
            notified_users.add(parent_resource_author.user_id)

        for user_id in get_mentioned_users(post.content):
            user = ModelUser.from_user_id(user_id)
            if user.user_id in notified_users:
                continue
            if not user.settings.notification.mentions:
                continue
            notify(
                sender=author,
                receiver=user,
                content=f'{author.username} 在评论中@了你',
                link=link,
                image_preview=view.image_url,
            )
            notified_users.add(user.user_id)


def notify_on_creation(resource: Union[ModelPackage, ModelBinary, ModelThread, ModelComment, ModelReply]) -> None:
    '''
    Notify users on creation of a resource.

    This function will not raise any exceptions.
    '''
    try:
        CreationNotifier().visit(resource)  # type: ignore
    except Exception as e:
        logging.exception(f'Failed to notify on creation of {resource.name}: {e}')
