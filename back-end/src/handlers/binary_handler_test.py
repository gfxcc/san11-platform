import unittest
from types import SimpleNamespace
from unittest.mock import Mock, patch

from core.errors.exceptions import ResourceExhausted
from handlers.binary_handler import BinaryHandler
from integrations.files.file_server import (
    BINARY_SIZE_LIMIT, PACKAGE_SIZE_LIMIT, BucketClass, FileServerType,
)


class BinaryUploadLimitTest(unittest.TestCase):
    def setUp(self):
        self.repository = Mock()
        self.handler = BinaryHandler(self.repository, Mock(), Mock())
        self.storage = Mock()
        self.storage.get_folder_size.return_value = 0
        self.binary = SimpleNamespace(
            file=SimpleNamespace(server=FileServerType.GCS.value,
                                 uri='upload.zip', ext='.zip'),
            version='v1.0.0', size='',
        )
        self.context = SimpleNamespace(
            authenticated_user=SimpleNamespace(user_id=1))
        self.parent = 'categories/1/packages/1'
        for name, value in (
            ('get_file_server', self.storage),
            ('find_resource', SimpleNamespace()),
            ('repository_for', Mock()),
            ('notify_on_creation', None),
        ):
            patcher = patch('handlers.binary_handler.' + name,
                            return_value=value)
            patcher.start()
            self.addCleanup(patcher.stop)

    def test_accepts_reported_11_mb_file(self):
        self.storage.get_file_size.return_value = 11 * 1024 * 1024
        self.handler.create(self.parent, self.binary, self.context)
        self.storage.move_file.assert_called_once()
        self.repository.create.assert_called_once()
        self.storage.delete_file.assert_not_called()

    def test_accepts_exactly_20_mb(self):
        self.storage.get_file_size.return_value = 20 * 1024 * 1024
        self.handler.create(self.parent, self.binary, self.context)
        self.storage.move_file.assert_called_once()
        self.repository.create.assert_called_once()
        self.storage.get_file_size.assert_called_once_with(
            BucketClass.TEMP, 'upload.zip')

    def test_rejects_one_byte_over_limit_before_publishing(self):
        self.storage.get_file_size.return_value = BINARY_SIZE_LIMIT + 1
        with self.assertRaises(ResourceExhausted) as error:
            self.handler.create(self.parent, self.binary, self.context)
        self.assertIn('20MB', error.exception.message)
        self.storage.delete_file.assert_called_once_with(
            BucketClass.TEMP, 'upload.zip')
        self.storage.move_file.assert_not_called()
        self.repository.create.assert_not_called()

    def test_still_enforces_package_quota(self):
        self.storage.get_file_size.return_value = BINARY_SIZE_LIMIT
        self.storage.get_folder_size.return_value = (
            PACKAGE_SIZE_LIMIT - BINARY_SIZE_LIMIT + 1)
        with self.assertRaises(ResourceExhausted):
            self.handler.create(self.parent, self.binary, self.context)
        self.storage.delete_file.assert_called_once_with(
            BucketClass.TEMP, 'upload.zip')
        self.storage.move_file.assert_not_called()
        self.repository.create.assert_not_called()

    def test_accepts_exact_package_quota(self):
        self.storage.get_file_size.return_value = BINARY_SIZE_LIMIT
        self.storage.get_folder_size.return_value = (
            PACKAGE_SIZE_LIMIT - BINARY_SIZE_LIMIT)
        self.handler.create(self.parent, self.binary, self.context)
        self.repository.create.assert_called_once()


if __name__ == '__main__':
    unittest.main()
