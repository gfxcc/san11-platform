import unittest
from unittest import mock

from app import dev_seed
from core.common.env import Env


class DevSeedTest(unittest.TestCase):
    def test_seed_dev_data_is_disabled_outside_dev(self):
        with mock.patch.object(dev_seed, 'get_env', return_value=Env.PROD), \
             mock.patch.object(dev_seed, '_upsert_dev_account') as upsert_account, \
             mock.patch.object(dev_seed, '_upsert_dev_author_package') as upsert_package:
            dev_seed.seed_dev_data()

        upsert_account.assert_not_called()
        upsert_package.assert_not_called()

    def test_seed_dev_data_creates_expected_dev_principals(self):
        with mock.patch.object(dev_seed, 'get_env', return_value=Env.DEV), \
             mock.patch.object(dev_seed, '_upsert_dev_account') as upsert_account, \
             mock.patch.object(dev_seed, '_upsert_dev_author_package') as upsert_package:
            dev_seed.seed_dev_data()

        self.assertEqual(3, upsert_account.call_count)
        self.assertEqual(
            ['dev_admin', 'dev_author', 'dev_user'],
            [call.args[0].username for call in upsert_account.call_args_list],
        )
        upsert_package.assert_called_once()


if __name__ == '__main__':
    unittest.main()
