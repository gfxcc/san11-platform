import os
import unittest
from unittest.mock import patch

from core.common.credentials import CredentialConfigurationError
from core.common.env import Env
from integrations.files.file_server import BucketClass, Gcs, S3


class FileServerConfigurationTest(unittest.TestCase):
    @patch.dict(os.environ, {}, clear=True)
    @patch('integrations.files.file_server.get_env', return_value=Env.DEV)
    def test_gcs_cleanup_is_skipped_without_credentials_outside_prod(self, _):
        server = Gcs()

        with self.assertLogs('file_server.py', level='INFO') as logs:
            server.delete_by_prefix(BucketClass.REGULAR, 'discussion/threads/380')

        self.assertIn(
            'Skip GCS prefix deletion for discussion/threads/380 in DEV',
            logs.output[0],
        )

    @patch.dict(os.environ, {}, clear=True)
    @patch('integrations.files.file_server.get_env', return_value=Env.PROD)
    def test_gcs_cleanup_requires_credentials_in_prod(self, _):
        with self.assertRaisesRegex(
                RuntimeError, 'GCLOUD_CREDENTIALS_FILE is required'):
            Gcs().delete_by_prefix(
                BucketClass.REGULAR, 'discussion/threads/380')

    @patch.dict(os.environ, {}, clear=True)
    def test_required_gcs_operation_has_clear_configuration_error(self):
        with self.assertRaisesRegex(
                CredentialConfigurationError,
                'Google Cloud integration is not configured: '
                'GCLOUD_CREDENTIALS_FILE is required'):
            Gcs().get_file_size(BucketClass.REGULAR, 'resource')

    @patch.dict(os.environ, {}, clear=True)
    @patch('integrations.files.file_server.get_env', return_value=Env.DEV)
    def test_s3_cleanup_is_skipped_without_credentials_outside_prod(self, _):
        server = S3()

        with self.assertLogs('file_server.py', level='INFO') as logs:
            server.delete_file(BucketClass.REGULAR, 'resource')

        self.assertIn('Skip S3 file deletion for resource in DEV', logs.output[0])


if __name__ == '__main__':
    unittest.main()
