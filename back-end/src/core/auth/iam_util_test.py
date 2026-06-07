import unittest
from types import SimpleNamespace
from unittest import mock

from core.auth.iam_util import assert_resource_owner
from core.errors.exceptions import PermissionDenied


class ResourceOwnerPermissionTest(unittest.TestCase):
    def test_admin_does_not_bypass_when_disabled(self):
        admin = SimpleNamespace(user_id=1, is_admin=lambda: True)
        context = SimpleNamespace(user=admin)
        request = SimpleNamespace(parent='categories/1/packages/7')

        @assert_resource_owner('parent', allow_admin=False)
        def handler(_self, _request, _context):
            return 'allowed'

        with mock.patch('core.auth.iam_util.find_resource',
                        return_value=SimpleNamespace(author_id=7)):
            with self.assertRaises(PermissionDenied):
                handler(None, request, context)

    def test_admin_can_bypass_governance_check_by_default(self):
        admin = SimpleNamespace(user_id=1, is_admin=lambda: True)
        context = SimpleNamespace(user=admin)
        request = SimpleNamespace(parent='categories/1/packages/7')

        @assert_resource_owner('parent')
        def handler(_self, _request, _context):
            return 'allowed'

        self.assertEqual('allowed', handler(None, request, context))


if __name__ == '__main__':
    unittest.main()
