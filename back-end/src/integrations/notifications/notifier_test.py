import os
import unittest
from email.mime.multipart import MIMEMultipart
from unittest.mock import MagicMock, patch

from core.common.env import Env
from integrations.notifications.notifier import Notifier, create_message


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

        self.assertIn('Content', message.as_string())


if __name__ == '__main__':
    unittest.main()
