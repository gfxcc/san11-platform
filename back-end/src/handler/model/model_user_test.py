import unittest
from unittest.mock import MagicMock, patch

from handler.common.exception import InvalidArgument

from . import model_user


class TestUtilFuncs(unittest.TestCase):
    def setUp(self) -> None:
        return super().setUp()

    def tearDown(self) -> None:
        return super().tearDown()

    @patch('handler.repository.repository_for')
    def test_validate_username_is_ok(self, mock_repository_for):
        usernames = [
            'san11pk',
            '三国志11',
            'a' * 32,
            '三' * 32,
        ]
        mock_repository_for.return_value.list = MagicMock(return_value=([], ''))
        for username in usernames:
            # no raise
            model_user.validate_username(username)

    @patch('handler.repository.repository_for')
    def test_validate_username_length_is_constrained(self, mock_repository_for):
        usernames = [
            '12',
            'a'*33,
            '三' * 33,
        ]
        mock_repository_for.return_value.list = MagicMock(return_value=([], ''))
        for username in usernames:
            self.assertRaises(
                InvalidArgument, model_user.validate_username, username)

    @patch('handler.repository.repository_for')
    def test_validate_username_invalid_char_causes_raise(self, mock_repository_for):
        usernames = [
            '1234@',
            '123 4',
        ]
        mock_repository_for.return_value.list = MagicMock(return_value=([], ''))
        for username in usernames:
            self.assertRaises(
                InvalidArgument, model_user.validate_username, username)

    @patch('handler.repository.repository_for')
    def test_validate_email_valid_emails(self, mock_repository_for):
        emails = [
            'ycao181@gmail.com',
            'test@test.com',
        ]
        mock_repository_for.return_value.list = MagicMock(return_value=([], ''))
        for email in emails:
            # no raise
            model_user.validate_email(email)

    @patch('handler.repository.repository_for')
    def test_validate_email_invalid_email_causes_raise(self, mock_repository_for):
        emails = [
            'what',
            'invalid.com',
        ]
        mock_repository_for.return_value.list = MagicMock(return_value=([], ''))
        for email in emails:
            self.assertRaises(
                InvalidArgument, model_user.validate_email, email)
