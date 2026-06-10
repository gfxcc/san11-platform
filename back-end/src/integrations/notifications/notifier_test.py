import os
import unittest
from email.mime.multipart import MIMEMultipart
from unittest.mock import MagicMock, patch

from core.common.env import Env
from integrations.notifications.notifier import Notifier, create_message


def _message_text(message, subtype=None):
    parts = []
    for part in message.walk():
        if part.get_content_maintype() == 'multipart':
            continue
        if subtype is not None and part.get_content_subtype() != subtype:
            continue
        payload = part.get_payload(decode=True)
        if payload is None:
            continue
        charset = part.get_content_charset() or 'utf-8'
        parts.append(payload.decode(charset))
    return '\n'.join(parts)


class NotifierTest(unittest.TestCase):
    def setUp(self):
        self.message = MIMEMultipart()
        self.message['to'] = 'ycao181@gmail.com'

    @patch.dict(os.environ, {}, clear=True)
    @patch('integrations.notifications.notifier.get_env', return_value=Env.DEV)
    def test_missing_credentials_skips_email_outside_prod(self, _):
        notifier = Notifier()

        with self.assertLogs(
                'notifier.py', level='INFO') as logs:
            notifier.send_email(self.message)

        self.assertIn(
            'Skip email delivery in DEV: '
            'NOTIFIER_SERVICE_ACCOUNT_FILE is not configured',
            logs.output[0],
        )

    @patch.dict(os.environ, {}, clear=True)
    @patch('integrations.notifications.notifier.get_env', return_value=Env.PROD)
    def test_missing_credentials_fails_with_clear_error_in_prod(self, _):
        notifier = Notifier()

        with self.assertRaisesRegex(
                RuntimeError, 'NOTIFIER_SERVICE_ACCOUNT_FILE is required'):
            notifier.send_email(self.message)

    @patch('integrations.notifications.notifier.get_env', return_value=Env.DEV)
    def test_gmail_login_is_lazy_and_reused(self, _):
        service = MagicMock()
        notifier = Notifier(service_account_file='/configured/credentials.json')
        notifier._gmail_login = MagicMock(return_value=service)

        notifier.send_email(self.message)
        notifier.send_email(self.message)

        notifier._gmail_login.assert_called_once_with()
        self.assertEqual(
            2,
            service.users.return_value.messages.return_value.send.call_count,
        )

    def test_create_message_loads_template_from_notification_package(self):
        message = create_message(
            receiver='receiver@example.com',
            receiver_avatar='https://example.com/avatar.png',
            subject='Subject',
            content='Content',
            link=None,
        )

        self.assertIn('Content', _message_text(message))

    def test_create_message_renders_preview_and_cta(self):
        message = create_message(
            receiver='receiver@example.com',
            receiver_avatar='https://example.com/avatar.png',
            subject='Subject',
            content='Content',
            link='packages/123',
            image_preview='images/preview.png',
            actor_name='Sender',
            notification_type='站内动态',
        )

        rendered = _message_text(message)

        self.assertIn('Sender', rendered)
        self.assertIn('http://localhost:4200/packages/123', rendered)
        self.assertIn('http://localhost:4200/images/preview.png', rendered)
        self.assertEqual(
            '<http://localhost:4200/settings/notifications>',
            message['List-Unsubscribe'],
        )

    def test_create_message_escapes_dynamic_content(self):
        message = create_message(
            receiver='receiver@example.com',
            receiver_avatar='https://example.com/avatar.png',
            subject='<Subject>',
            content='<script>alert("x")</script>',
            link=None,
            footer_reason='<footer>',
        )

        rendered = _message_text(message, subtype='html')

        self.assertIn('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;', rendered)
        self.assertIn('&lt;footer&gt;', rendered)
        self.assertNotIn('<script>alert("x")</script>', rendered)


if __name__ == '__main__':
    unittest.main()
