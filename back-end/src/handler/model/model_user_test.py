import unittest
from unittest.mock import MagicMock, patch

from handler import user_handler
from handler.common.exception import InvalidArgument

from . import model_user


class TestUtilFuncs(unittest.TestCase):
    def setUp(self) -> None:
        return super().setUp()

    def tearDown(self) -> None:
        return super().tearDown()

    @patch.object(model_user, 'ModelUser')
    def test_validate_username_is_ok(self, mock_ModelUser):
        usernames = [
            'san11pk',
            '三国志11',
            'a' * 32,
            '三' * 32,
        ]
        mock_ModelUser.list = MagicMock(return_value=([], ''))
        for username in usernames:
            # no raise
            model_user.validate_username(username)

    @patch.object(model_user, 'ModelUser')
    def test_validate_username_length_is_constrained(self, mock_ModelUser):
        usernames = [
            '12',
            'a'*33,
            '三' * 33,
        ]
        mock_ModelUser.list = MagicMock(return_value=([], ''))
        for username in usernames:
            self.assertRaises(
                InvalidArgument, model_user.validate_username, username)

    @patch.object(model_user, 'ModelUser')
    def test_validate_username_invalid_char_causes_raise(self, mock_ModelUser):
        usernames = [
            '1234@',
            '123 4',
        ]
        mock_ModelUser.list = MagicMock(return_value=([], ''))
        for username in usernames:
            self.assertRaises(
                InvalidArgument, model_user.validate_username, username)
