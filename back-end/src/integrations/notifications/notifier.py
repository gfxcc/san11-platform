import base64
import html
import logging
import os
from dataclasses import dataclass
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Union, Optional

try:
    from googleapiclient.errors import HttpError
except ImportError:
    HttpError = None

from core.common.env import Env, get_env
from core.common.visitor import visitor
from core.errors.exceptions import InvalidArgument
from models.model_article import ModelArticle
from models.model_binary import ModelBinary
from models.model_comment import ModelComment
from models.model_notification import ModelNotification
from models.model_package import ModelPackage
from models.model_reply import ModelReply
from models.model_tag import ModelTag
from models.model_thread import ModelThread
from models.model_user import DEFAULT_USER_AVATAR, ModelUser, get_user_by_username
from repositories.resource_repository import repository_for
from core.html_util import get_mentions, get_text_from_html
from core.resources.name_util import get_parent
from core.resources.resource_parser import find_resource
from core.resources.resource_view import ResourceViewVisitor, get_resource_url
from core.time_util import get_now
from core.url import get_full_url, get_image_url

logger = logging.getLogger(os.path.basename(__file__))

TESTING_RECEIVERS = ['ycao181@gmail.com']
NOTIFIER_EMAIL_ADDRESS = 'no-reply@san11pk.org'
EMAIL_TEMPLATE_FILE = Path(__file__).with_name('email_template.html')


@dataclass
class EmailContext:
    headline: str
    notification_type: str
    kicker: str
    actor_name: str
    actor_avatar: str
    actor_context: str
    body_text: str
    cta_label: str
    footer_reason: str = '你收到这封邮件，是因为你开启了 San11 分享平台的邮件通知。'
    parent_title: str = ''
    parent_type: str = ''
    parent_meta: str = ''
    parent_image: str = ''
    previous_text: str = ''
    comment_index: str = ''


class Notifier:
    def __init__(self, service_account_file: Optional[str] = None) -> None:
        self._service_account_file = (
            service_account_file
            or os.environ.get('NOTIFIER_SERVICE_ACCOUNT_FILE')
        )
        self._service = None

    def send_email(self, message: MIMEMultipart) -> None:
        if not self._service_account_file:
            if get_env() == Env.PROD:
                raise RuntimeError(
                    'Email delivery is not configured: '
                    'NOTIFIER_SERVICE_ACCOUNT_FILE is required in PROD'
                )
            logger.info(
                'Skip email delivery in %s: '
                'NOTIFIER_SERVICE_ACCOUNT_FILE is not configured',
                get_env().name,
            )
            return

        if get_env() == Env.DEV and message['to'] not in TESTING_RECEIVERS:
            logger.debug(
                'Skip email delivery in DEV for non-testing receiver %s',
                message['to'],
            )
            return

        if self._service is None:
            self._service = self._gmail_login()

        raw_message = base64.urlsafe_b64encode(
            message.as_bytes()).decode('utf-8')
        try:
            message = self._service.users().messages().send(
                userId='me', body={'raw': raw_message}).execute()
            logger.debug(f"Message Id: {message['id']}")
        except Exception as error:
            if HttpError is not None and isinstance(error, HttpError):
                logger.debug(f"An error occurred: {error}")
            else:
                raise

    def _gmail_login(self):
        from google.oauth2 import service_account
        from googleapiclient.discovery import build

        SCOPES = ['https://www.googleapis.com/auth/gmail.send']

        credentials = service_account.Credentials.from_service_account_file(
            self._service_account_file, scopes=SCOPES)
        delegated_credentials = credentials.with_subject(
            NOTIFIER_EMAIL_ADDRESS)
        service = build('gmail', 'v1', credentials=delegated_credentials, cache_discovery=False)
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
    repository_for(ModelNotification).create(
        parent=f'users/{receiver_id}', resource=noti)


def notify(sender: ModelUser, receiver: ModelUser, content: str,
           link: str, image_preview: str,
           email_context: Optional[EmailContext] = None) -> None:
    '''
    '''
    logger.debug(f'Notifying {receiver.username} on {content}')
    # 1. Send notification to the user.
    _send_notification(
        sender.user_id, receiver.user_id, content, link, image_preview
    )

    # 2. if the user has enabled email notification, send an email.
    if receiver.settings.notification.send_emails:
        # TODO: pass notifier as an argument.
        Notifier().send_email(
            create_message(receiver=receiver.email,
                            receiver_avatar=sender.get_avatar_url(),
                            subject=f'{sender.username} 在 san11pk.org 的新动态',
                            content=content,
                            link=link,
                            image_preview=image_preview,
                            actor_name=sender.username,
                            notification_type='站内动态',
                            email_context=email_context))


def create_message(receiver: str,
                   receiver_avatar: Optional[str],
                   subject: str, 
                   content: str, 
                   link: Optional[str],
                   image_preview: Optional[str] = None,
                   actor_name: Optional[str] = None,
                   notification_type: str = '站内通知',
                   cta_label: str = '查看详情',
                   footer_reason: str = (
                       '你收到这封邮件，是因为你开启了 San11 分享平台的邮件通知。'
                   ),
                   email_context: Optional[EmailContext] = None) -> MIMEMultipart:
    if receiver_avatar is None:
        receiver_avatar = get_image_url(DEFAULT_USER_AVATAR)
    if email_context and not email_context.actor_avatar:
        email_context.actor_avatar = receiver_avatar
    preferences_url = get_full_url('settings/notifications')
    cta_url = get_full_url(link) if link else ''
    preview_url = _resolve_image_url(image_preview) if image_preview else ''

    message = MIMEMultipart('alternative')
    message['from'] = NOTIFIER_EMAIL_ADDRESS
    message['to'] = receiver
    message['subject'] = subject
    message['List-Unsubscribe'] = f'<{preferences_url}>'

    with EMAIL_TEMPLATE_FILE.open('r', encoding='utf-8') as template_file:
        template = template_file.read()

    plain_text = _create_plain_text(
        content=content,
        link=cta_url,
        preferences_url=preferences_url,
        email_context=email_context,
    )
    html_text = _render_email_template(
        template=template,
        subject=subject,
        content=content,
        receiver_avatar=receiver_avatar,
        link=cta_url,
        image_preview=preview_url,
        actor_name=actor_name,
        notification_type=notification_type,
        cta_label=cta_label,
        footer_reason=footer_reason,
        preferences_url=preferences_url,
        email_context=email_context,
    )

    message.attach(MIMEText(plain_text, 'plain', 'utf-8'))
    message.attach(MIMEText(html_text, 'html', 'utf-8'))
    return message


def _create_plain_text(
        content: str,
        link: str,
        preferences_url: str,
        email_context: Optional[EmailContext] = None) -> str:
    if email_context:
        lines = [
            email_context.headline,
            '',
            email_context.body_text,
            '',
        ]
        if email_context.parent_title:
            lines.extend(['发生在:', email_context.parent_title])
            if email_context.parent_meta:
                lines.extend([email_context.parent_meta])
            lines.append('')
        if email_context.previous_text:
            lines.extend(['前文:', email_context.previous_text, ''])
    else:
        lines = [
            content,
            '',
        ]
    if link:
        label = email_context.cta_label if email_context else '查看详情'
        lines.extend([f'{label}:', link, ''])
    lines.extend(['通知偏好:', preferences_url])
    return '\n'.join(lines)


def _render_email_template(
        template: str,
        subject: str,
        content: str,
        receiver_avatar: str,
        link: str,
        image_preview: str,
        actor_name: Optional[str],
        notification_type: str,
        cta_label: str,
        footer_reason: str,
        preferences_url: str,
        email_context: Optional[EmailContext] = None) -> str:
    if email_context:
        return _render_context_email_template(
            template=template,
            subject=subject,
            link=link,
            preferences_url=preferences_url,
            context=email_context,
        )

    escaped_content = html.escape(content)
    escaped_subject = html.escape(subject)
    escaped_actor_name = html.escape(actor_name or 'San11 分享平台')
    safe_link = html.escape(link, quote=True)
    safe_preview_url = html.escape(image_preview, quote=True)

    replacements = {
        'subject': escaped_subject,
        'preheader': escaped_content,
        'notification_type': html.escape(notification_type),
        'kicker': '你关注的内容有新进展' if link else '账号安全通知',
        'headline': escaped_content,
        'receiver_avatar': html.escape(receiver_avatar, quote=True),
        'actor_name': escaped_actor_name,
        'actor_context': '来自 San11 分享平台',
        'content': escaped_content,
        'image_preview': safe_preview_url,
        'preview_image_style': '' if image_preview else 'display: none;',
        'preview_title': escaped_subject,
        'preview_text': escaped_content,
        'cta_url': safe_link,
        'cta_label': html.escape(cta_label),
        'footer_reason': html.escape(footer_reason),
        'preferences_url': html.escape(preferences_url, quote=True),
        'context_section_style': 'display: none; max-height: 0; overflow: hidden;',
        'parent_image_style': 'display: none;',
        'parent_image': '',
        'parent_text_padding': '',
        'parent_title': '',
        'parent_meta': '',
        'actor_avatar': '',
        'comment_index': '',
        'comment_actor_name': '',
        'comment_actor_context': '',
        'comment_body': '',
        'previous_section_style': 'display: none;',
        'previous_text': '',
        'source_link_style': 'display: none;',
        'generic_section_style': 'display: table; width: 100%;',
        'avatar_section_style': 'margin-bottom: 18px;',
        'summary_margin': '0 0 18px',
        'preview_section_style': (
            'display: table; width: 100%; margin: 0;'
            if image_preview else
            'display: none; max-height: 0; overflow: hidden; width: 100%; margin: 0;'
        ),
        'cta_section_style': (
            'display: table;'
            if link else
            'display: none; max-height: 0; overflow: hidden;'
        ),
    }

    rendered = template
    for key, value in replacements.items():
        rendered = rendered.replace(f'{{{{{key}}}}}', value)
    return rendered


def _render_context_email_template(
        template: str,
        subject: str,
        link: str,
        preferences_url: str,
        context: EmailContext) -> str:
    parent_image = _resolve_image_url(context.parent_image) if context.parent_image else ''
    replacements = {
        'subject': html.escape(subject),
        'preheader': html.escape(context.body_text),
        'notification_type': html.escape(context.notification_type),
        'kicker': html.escape(context.kicker),
        'headline': html.escape(context.headline),
        'receiver_avatar': '',
        'actor_name': '',
        'actor_context': '',
        'content': '',
        'image_preview': '',
        'preview_image_style': 'display: none;',
        'preview_title': '',
        'preview_text': '',
        'cta_url': html.escape(link, quote=True),
        'cta_label': html.escape(context.cta_label),
        'footer_reason': html.escape(context.footer_reason),
        'preferences_url': html.escape(preferences_url, quote=True),
        'context_section_style': 'display: table; width: 100%; margin: 0;',
        'parent_image_style': '' if parent_image else 'display: none;',
        'parent_image': html.escape(parent_image, quote=True),
        'parent_text_padding': 'padding-left: 14px;' if parent_image else '',
        'parent_title': html.escape(context.parent_title),
        'parent_meta': html.escape(
            ' · '.join(
                item for item in [context.parent_type, context.parent_meta]
                if item
            )
        ),
        'actor_avatar': html.escape(_resolve_image_url(context.actor_avatar), quote=True),
        'comment_index': html.escape(context.comment_index),
        'comment_actor_name': html.escape(context.actor_name),
        'comment_actor_context': html.escape(context.actor_context),
        'comment_body': _escape_multiline(context.body_text),
        'previous_section_style': (
            '' if context.previous_text else 'display: none;'
        ),
        'previous_text': html.escape(context.previous_text),
        'source_link_style': (
            'display: inline-block; color: #64748b; font-size: 13px; '
            'font-weight: 750; text-decoration: none;'
            if link else
            'display: none;'
        ),
        'generic_section_style': 'display: none; max-height: 0; overflow: hidden;',
        'avatar_section_style': '',
        'summary_margin': '0',
        'preview_section_style': 'display: none; max-height: 0; overflow: hidden;',
        'cta_section_style': (
            'display: table;'
            if link else
            'display: none; max-height: 0; overflow: hidden;'
        ),
    }

    rendered = template
    for key, value in replacements.items():
        rendered = rendered.replace(f'{{{{{key}}}}}', value)
    return rendered


def _escape_multiline(text: str) -> str:
    lines = [line for line in html.escape(text).splitlines() if line.strip()]
    if not lines:
        return ''
    return '<br>'.join(lines)


def _resolve_image_url(uri: str) -> str:
    if uri.startswith('http'):
        return uri
    return get_image_url(uri)


def _text_excerpt(content: str, max_len: int = 220) -> str:
    text = get_text_from_html(content).strip()
    text = ' '.join(text.split())
    if len(text) <= max_len:
        return text
    return f'{text[:max_len - 1]}…'


def _resource_type_label(resource) -> str:
    if isinstance(resource, ModelPackage):
        return '剧本包'
    if isinstance(resource, ModelBinary):
        return '版本更新'
    if isinstance(resource, ModelArticle):
        return '文章'
    if isinstance(resource, ModelThread):
        return '讨论'
    if isinstance(resource, ModelComment):
        return '评论'
    if isinstance(resource, ModelReply):
        return '回复'
    if isinstance(resource, ModelUser):
        return '用户主页'
    if isinstance(resource, ModelTag):
        return '标签'
    return '内容'


def _context_resource_for_post(
        post: Union[ModelComment, ModelReply, ModelThread],
        parent_resource):
    if isinstance(parent_resource, ModelComment):
        try:
            return find_resource(get_parent(parent_resource.name))
        except Exception:
            return parent_resource
    return parent_resource


def _previous_text_for_post(parent_resource) -> str:
    if isinstance(parent_resource, ModelComment):
        return _text_excerpt(parent_resource.content, max_len=120)
    return ''


def _comment_index_for_post(post: Union[ModelComment, ModelReply, ModelThread]) -> str:
    if isinstance(post, ModelComment):
        return f'#{post.index}'
    if isinstance(post, ModelReply):
        return '回复'
    return '新帖'


def _post_email_context(
        post: Union[ModelComment, ModelReply, ModelThread],
        author: ModelUser,
        parent_resource,
        headline: str,
        notification_type: str,
        actor_context: str,
        cta_label: str) -> EmailContext:
    context_resource = _context_resource_for_post(post, parent_resource)
    context_view = ResourceViewVisitor().visit(context_resource)
    parent_type = _resource_type_label(context_resource)
    body_text = _text_excerpt(post.content)
    return EmailContext(
        headline=headline,
        notification_type=notification_type,
        kicker='网站里有新的讨论动态',
        actor_name=author.username,
        actor_avatar=author.get_avatar_url(),
        actor_context=actor_context,
        body_text=body_text,
        cta_label=cta_label,
        footer_reason='你收到这封邮件，是因为你开启了 San11 分享平台的评论与提及通知。',
        parent_title=context_view.display_name,
        parent_type=parent_type,
        parent_meta='版本更新讨论' if isinstance(context_resource, ModelPackage) else '',
        parent_image=context_view.image_url,
        previous_text=_previous_text_for_post(parent_resource),
        comment_index=_comment_index_for_post(post),
    )


class CreationNotifier:
    @visitor(ModelPackage)
    def visit(self, package: ModelPackage) -> None:  # type: ignore
        '''Notify all subscribers of the author when a new package is created.'''
        author = ModelUser.from_user_id(package.author_id)
        view = ResourceViewVisitor().visit(package)  # type: ignore
        link = get_resource_url(package)

        # Don't notify the author.
        notified_users = {package.author_id}
        for sub in package.list_subscriptions():
            subscriber = repository_for(ModelUser).get(sub.subscriber_name)
            if subscriber.user_id in notified_users:
                continue
            if not subscriber.settings.notification.subscriptions:
                continue
            notify(
                sender=author,
                receiver=subscriber,
                content=f'{author.username} 发布了【{view.display_name}】',
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
        package = repository_for(ModelPackage).get(get_parent(binary.name))
        author = ModelUser.from_user_id(package.author_id)
        view = ResourceViewVisitor().visit(binary)  # type: ignore
        link = get_resource_url(binary)

        # Don't notify the author.
        notified_users = {package.author_id}
        for sub in package.list_subscriptions():
            subscriber = repository_for(ModelUser).get(sub.subscriber_name)
            if subscriber.user_id in notified_users:
                continue
            if not subscriber.settings.notification.subscriptions:
                continue
            notified_users.add(subscriber.user_id)
            notify(
                sender=author,
                receiver=subscriber,
                content=f'{author.username} 更新了【{view.display_name}】',
                link=link,
                image_preview=view.image_url,
            )
            notified_users.add(subscriber.user_id)

        for sub in author.list_subscriptions():
            subscriber = repository_for(ModelUser).get(sub.subscriber_name)
            if subscriber.user_id in notified_users:
                continue
            if not subscriber.settings.notification.subscriptions:
                continue
            notify(
                sender=author,
                receiver=subscriber,
                content=f'{author.username} 更新了【{view.display_name}】',
                link=link,
                image_preview=view.image_url,
            )
            notified_users.add(subscriber.user_id)

    @visitor(ModelArticle)
    def visit(self, article: ModelArticle) -> None:  # type: ignore
        '''
        Notify
            * subscribers of the author
        '''
        author = ModelUser.from_user_id(article.author_id)
        view = ResourceViewVisitor().visit(article)  # type: ignore
        link = get_resource_url(article)

        # Don't notify the author.
        notified_users = {article.author_id}
        for sub in author.list_subscriptions():
            subscriber = repository_for(ModelUser).get(sub.subscriber_name)
            if subscriber.user_id in notified_users:
                continue
            if not subscriber.settings.notification.subscriptions:
                continue
            notify(
                sender=author,
                receiver=subscriber,
                content=f'{author.username} 发布了 文章【{view.display_name}】',
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

            Only for ModelThread:
                * subscribers of the author
        '''
        author = ModelUser.from_user_id(post.author_id)
        view = ResourceViewVisitor().visit(post)  # type: ignore
        link = get_resource_url(post)

        # Don't notify the author
        notified_users = {post.author_id}
        parent_resource = None

        try:
            parent_resource = find_resource(get_parent(post.name))
        except InvalidArgument as e:
            # Parent is not a resource, don't notify.
            pass
        else:
            if not isinstance(
                    parent_resource,
                    (ModelPackage, ModelBinary, ModelArticle, ModelThread,
                     ModelComment, ModelReply, ModelUser, ModelTag)):
                return
            context_resource = _context_resource_for_post(post, parent_resource)
            context_resource_view = ResourceViewVisitor().visit(context_resource)
            parent_author_id = getattr(parent_resource, 'author_id', None)
            if not isinstance(parent_author_id, int):
                return
            parent_resource_author = ModelUser.from_user_id(
                parent_author_id)

            enabled = False
            if isinstance(post, ModelThread):
                enabled = parent_resource_author.settings.notification.threads
            elif isinstance(post, ModelComment) or isinstance(post, ModelReply):
                enabled = parent_resource_author.settings.notification.comments

            if enabled and parent_resource_author.user_id not in notified_users:
                email_context = _post_email_context(
                    post=post,
                    author=author,
                    parent_resource=parent_resource,
                    headline=(
                        f'{author.username} 评论了「'
                        f'{context_resource_view.display_name}」'
                    ),
                    notification_type='评论通知',
                    actor_context='评论了你的内容 · 刚刚',
                    cta_label='查看评论',
                )
                notify(
                    sender=author,
                    receiver=parent_resource_author,
                    content=(
                        f'{author.username} 评论了'
                        f'【{context_resource_view.display_name}】'
                    ),
                    link=link,
                    image_preview=view.image_url,
                    email_context=email_context,
                )
                notified_users.add(parent_resource_author.user_id)

        for mention in get_mentions(post.content):
            if mention.user_id is None and not mention.username:
                continue
            try:
                user = (
                    ModelUser.from_user_id(mention.user_id)
                    if mention.user_id is not None else
                    get_user_by_username(mention.username)
                )
            except Exception as e:
                logger.error(f'Failed to get mentioned user {mention}: {e}')
                continue
            if user.user_id in notified_users:
                continue

            if not user.settings.notification.mentions:
                continue
            email_context = None
            if parent_resource is not None:
                context_resource = _context_resource_for_post(
                    post, parent_resource)
                context_resource_view = ResourceViewVisitor().visit(
                    context_resource)
                email_context = _post_email_context(
                    post=post,
                    author=author,
                    parent_resource=parent_resource,
                    headline=(
                        f'{author.username} 在「'
                        f'{context_resource_view.display_name}」中 @ 了你'
                    ),
                    notification_type='提及通知',
                    actor_context='在评论中提到了你 · 刚刚',
                    cta_label='查看提及',
                )
            notify(
                sender=author,
                receiver=user,
                content=f'{author.username} 在评论中@了你',
                link=link,
                image_preview=view.image_url,
                email_context=email_context,
            )
            notified_users.add(user.user_id)
        
        if isinstance(post, ModelThread):
            for sub in author.list_subscriptions():
                subscriber = repository_for(ModelUser).get(sub.subscriber_name)
                if subscriber.user_id in notified_users:
                    continue
                if not subscriber.settings.notification.subscriptions:
                    continue
                notify(
                    sender=author,
                    receiver=subscriber,
                    content=f'{author.username} 更新了【{view.display_name}】',
                    link=link,
                    image_preview=view.image_url,
                )
                notified_users.add(subscriber.user_id)


def notify_on_creation(resource: Union[ModelPackage, ModelBinary, ModelArticle, ModelThread, ModelComment, ModelReply]) -> None:
    '''
    Notify users on creation of a resource.

    This function will not raise any exceptions.
    '''
    try:
        CreationNotifier().visit(resource)  # type: ignore
    except Exception as e:
        logging.exception(
            f'Failed to notify on creation of {resource.name}: {e}')
