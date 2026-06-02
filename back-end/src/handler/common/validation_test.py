import unittest

from handler.common.exception import PermissionDenied, Unauthenticated
from handler.common.validation import (require_authenticated,
                                       require_authenticated_condition,
                                       require_permission)


class ValidationTest(unittest.TestCase):
    def test_require_authenticated_returns_user(self):
        user = object()

        self.assertIs(user, require_authenticated(user))

    def test_require_authenticated_rejects_missing_user(self):
        with self.assertRaises(Unauthenticated):
            require_authenticated(None)

    def test_require_permission_rejects_false_condition(self):
        with self.assertRaises(PermissionDenied):
            require_permission(False)

    def test_require_authenticated_condition_preserves_unauthenticated_error(self):
        with self.assertRaises(Unauthenticated):
            require_authenticated_condition(False)


if __name__ == '__main__':
    unittest.main()
