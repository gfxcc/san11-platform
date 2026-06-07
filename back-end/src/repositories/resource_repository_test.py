import unittest
from unittest import mock
from typing import Any, Dict, List, Optional, Tuple

from core.errors.exceptions import FailedPrecondition, NotFound
from core.models.base import ListOptions
from core.models.base.base_storage import StorageSerializable
from core.models.base.common.list_options import PostgresAdaptor
from repositories.resource_repository import ResourceRepository, repository_for


class FakeModel(StorageSerializable):
    _DB_TABLE = 'packages'
    _LIST_OPTIONS_ADAPTOR = PostgresAdaptor({})

    def __init__(self, name='', value='value'):
        self.name = name
        self.value = value
        self.create_mock = mock.Mock()
        self.update_mock = mock.Mock()
        self.delete_mock = mock.Mock()

    @classmethod
    def from_db(cls, data):
        return cls(name=data.get('name', ''), value=data.get('value', ''))

    def to_db(self):
        return {
            'name': self.name,
            'value': self.value,
        }

    def create(self, parent, actor_info=None):
        self.create_mock(parent=parent, actor_info=actor_info)

    def update(self, update_update_time=True, actor_info=None):
        self.update_mock(update_update_time=update_update_time,
                         actor_info=actor_info)

    def delete(self, actor_info=None):
        self.delete_mock(actor_info=actor_info)


class FakeStorage:
    def __init__(self):
        self.get_result: Optional[Dict[str, str]] = None
        self.list_result: List[Tuple[Dict[str, str]]] = []
        self.exists_result: bool = False
        self.insert_result: int = 7
        self.calls: List[Tuple[Any, ...]] = []

    def get(self, table, parent, resource_id):
        self.calls.append(('get', table, parent, resource_id))
        return self.get_result

    def list(self, table, where_statement, order_statement, limit_statement, params):
        self.calls.append(('list', table, where_statement,
                           order_statement, limit_statement, params))
        return self.list_result

    def exists(self, table, parent, resource_id):
        self.calls.append(('exists', table, parent, resource_id))
        return self.exists_result

    def insert(self, table, parent, data, resource_id=None):
        self.calls.append(('insert', table, parent, data, resource_id))
        return self.insert_result if resource_id is None else resource_id

    def update(self, table, parent, resource_id, data):
        self.calls.append(('update', table, parent, resource_id, data))

    def delete(self, table, parent, resource_id):
        self.calls.append(('delete', table, parent, resource_id))


class ResourceRepositoryTest(unittest.TestCase):
    def test_get_loads_resource_from_storage(self):
        storage = FakeStorage()
        storage.get_result = {'name': 'packages/1', 'value': 'loaded'}
        repository = ResourceRepository(FakeModel, storage=storage)

        resource = repository.get('packages/1')

        self.assertEqual('packages/1', resource.name)
        self.assertEqual('loaded', resource.value)
        self.assertEqual([('get', 'packages', '', 1)], storage.calls)

    def test_get_raises_not_found_when_row_missing(self):
        repository = ResourceRepository(FakeModel, storage=FakeStorage())

        with self.assertRaises(NotFound):
            repository.get('packages/1')

    def test_list_loads_resources_and_next_page_token(self):
        storage = FakeStorage()
        storage.list_result = [
            ({'name': 'users/1/packages/1', 'value': 'one'},),
            ({'name': 'users/1/packages/2', 'value': 'two'},),
        ]
        repository = ResourceRepository(FakeModel, storage=storage)
        list_options = ListOptions(parent='users/1', page_size=2)

        resources, next_page_token = repository.list(list_options)

        self.assertEqual(['one', 'two'], [r.value for r in resources])
        self.assertTrue(next_page_token)

    def test_find_requires_exactly_one_match(self):
        repository = ResourceRepository(FakeModel)

        with mock.patch.object(repository, 'list',
                               return_value=([FakeModel(value='one')], '')):
            self.assertEqual('one', repository.find('users/1', 'value="one"').value)

        with mock.patch.object(repository, 'list', return_value=([], '')):
            with self.assertRaises(NotFound):
                repository.find('users/1', 'value="missing"')

        with mock.patch.object(repository, 'list',
                               return_value=([FakeModel(), FakeModel()], '')):
            with self.assertRaises(FailedPrecondition):
                repository.find('users/1', 'value="duplicate"')

    def test_create_inserts_resource_then_runs_lifecycle_hook(self):
        storage = FakeStorage()
        repository = ResourceRepository(FakeModel, storage=storage)
        resource = FakeModel(value='new')

        with mock.patch.object(repository, '_update') as update_mock:
            self.assertIs(repository.create('users/1', resource, actor_info=123),
                          resource)

        self.assertEqual('users/1/packages/7', resource.name)
        self.assertEqual(
            ('insert', 'packages', 'users/1',
             {'name': '', 'value': 'new'}, None),
            storage.calls[0],
        )
        update_mock.assert_called_once_with(resource)
        resource.create_mock.assert_called_once_with(parent='users/1',
                                                     actor_info=123)

    def test_update_runs_lifecycle_hook_then_persists(self):
        repository = ResourceRepository(FakeModel)
        resource = FakeModel(name='packages/1')

        with mock.patch.object(repository, '_update') as update_mock:
            self.assertIs(repository.update(resource, update_update_time=False,
                                            actor_info=123), resource)

        resource.update_mock.assert_called_once_with(update_update_time=False,
                                                     actor_info=123)
        update_mock.assert_called_once_with(resource)

    def test_delete_runs_lifecycle_hook_then_deletes_row(self):
        storage = FakeStorage()
        repository = ResourceRepository(FakeModel, storage=storage)
        resource = FakeModel(name='packages/1')

        self.assertIs(repository.delete(resource, actor_info=123), resource)

        resource.delete_mock.assert_called_once_with(actor_info=123)
        self.assertEqual(('delete', 'packages', '', 1), storage.calls[-1])

    def test_repository_for_reuses_repository_instances(self):
        self.assertIs(repository_for(FakeModel), repository_for(FakeModel))


if __name__ == '__main__':
    unittest.main()
