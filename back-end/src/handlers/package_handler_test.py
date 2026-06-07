import unittest
from types import SimpleNamespace

from app.protos import san11_platform_pb2 as pb
from core.errors.exceptions import PermissionDenied
from core.models.base import FieldMask
from handlers.package_handler import verify_package_update_permission


class PackageUpdatePermissionTest(unittest.TestCase):
    def setUp(self):
        self.current = SimpleNamespace(author_id=7, state=pb.ResourceState.NORMAL)
        self.author = SimpleNamespace(user_id=7, is_admin=lambda: False)
        self.admin = SimpleNamespace(user_id=1, is_admin=lambda: True)
        self.other_user = SimpleNamespace(user_id=9, is_admin=lambda: False)

    def test_author_can_edit_content(self):
        verify_package_update_permission(
            self.current,
            SimpleNamespace(state=pb.ResourceState.NORMAL),
            FieldMask(['package_name', 'description', 'image_urls', 'tags']),
            self.author,
        )

    def test_admin_cannot_edit_author_content(self):
        with self.assertRaises(PermissionDenied):
            verify_package_update_permission(
                self.current,
                SimpleNamespace(state=pb.ResourceState.NORMAL),
                FieldMask(['description']),
                self.admin,
            )

    def test_admin_can_moderate_state(self):
        verify_package_update_permission(
            self.current,
            SimpleNamespace(state=pb.ResourceState.HIDDEN),
            FieldMask(['state']),
            self.admin,
        )

    def test_author_can_only_request_scheduled_delete(self):
        verify_package_update_permission(
            self.current,
            SimpleNamespace(state=pb.ResourceState.SCHEDULED_DELETE),
            FieldMask(['state']),
            self.author,
        )

        with self.assertRaises(PermissionDenied):
            verify_package_update_permission(
                self.current,
                SimpleNamespace(state=pb.ResourceState.HIDDEN),
                FieldMask(['state']),
                self.author,
            )

    def test_non_owner_cannot_edit_content(self):
        with self.assertRaises(PermissionDenied):
            verify_package_update_permission(
                self.current,
                SimpleNamespace(state=pb.ResourceState.NORMAL),
                FieldMask(['tags']),
                self.other_user,
            )

    def test_rejects_unsupported_fields(self):
        with self.assertRaises(PermissionDenied):
            verify_package_update_permission(
                self.current,
                SimpleNamespace(state=pb.ResourceState.NORMAL),
                FieldMask(['author_id']),
                self.author,
            )


if __name__ == '__main__':
    unittest.main()
