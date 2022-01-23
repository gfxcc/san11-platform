import unittest
import uuid

from . import user_util


class TestUtilFuncs(unittest.TestCase):

    def test_hash_and_verify_password(self):
        passwords = [str(uuid.uuid4()) for i in range(10)]
        for pw in passwords:
            self.assertTrue(
                user_util.verify_password(pw, user_util.hash_password(pw))
            )
