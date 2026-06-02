import json
import unittest
from unittest import mock

from handler.storage import PostgresResourceStorage


class PostgresResourceStorageTest(unittest.TestCase):
    def test_get_returns_data_cell_when_row_exists(self):
        storage = PostgresResourceStorage()

        with mock.patch('handler.storage.run_sql_with_param_and_fetch_one',
                        return_value=({'name': 'packages/1'},)) as sql_mock:
            self.assertEqual({'name': 'packages/1'},
                             storage.get('packages', None, 1))

        sql_mock.assert_called_once()

    def test_get_returns_none_when_row_missing(self):
        storage = PostgresResourceStorage()

        with mock.patch('handler.storage.run_sql_with_param_and_fetch_one',
                        return_value=None):
            self.assertIsNone(storage.get('packages', None, 1))

    def test_insert_serializes_resource_data_and_returns_id(self):
        storage = PostgresResourceStorage()

        with mock.patch('handler.storage.run_sql_with_param_and_fetch_one',
                        return_value=(7,)) as sql_mock:
            self.assertEqual(7, storage.insert(
                'packages',
                'users/1',
                {'name': '', 'value': 'new'},
            ))

        params = sql_mock.call_args.args[1]
        self.assertEqual('users/1', params['parent'])
        self.assertEqual({'name': '', 'value': 'new'},
                         json.loads(params['data']))

    def test_update_serializes_resource_data(self):
        storage = PostgresResourceStorage()

        with mock.patch('handler.storage.run_sql_with_param') as sql_mock:
            storage.update('packages', None, 1, {'name': 'packages/1'})

        params = sql_mock.call_args.args[1]
        self.assertEqual(None, params['parent'])
        self.assertEqual(1, params['resource_id'])
        self.assertEqual({'name': 'packages/1'}, json.loads(params['data']))


if __name__ == '__main__':
    unittest.main()
