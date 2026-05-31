import unittest
from unittest import mock

from handler.common.exception import FailedPrecondition, NotFound
from handler.model.base import ListOptions
from handler.model.base.common.list_options import PostgresAdaptor
from handler.repository import ResourceRepository, repository_for


class FakeModel:
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


class ResourceRepositoryTest(unittest.TestCase):
    def test_get_loads_resource_from_storage(self):
        repository = ResourceRepository(FakeModel)

        with mock.patch('handler.repository.run_sql_with_param_and_fetch_one',
                        return_value=({'name': 'packages/1', 'value': 'loaded'},)):
            resource = repository.get('packages/1')

        self.assertEqual('packages/1', resource.name)
        self.assertEqual('loaded', resource.value)

    def test_get_raises_not_found_when_row_missing(self):
        repository = ResourceRepository(FakeModel)

        with mock.patch('handler.repository.run_sql_with_param_and_fetch_one',
                        return_value=None):
            with self.assertRaises(NotFound):
                repository.get('packages/1')

    def test_list_loads_resources_and_next_page_token(self):
        repository = ResourceRepository(FakeModel)
        list_options = ListOptions(parent='users/1', page_size=2)

        with mock.patch('handler.repository.run_sql_with_param_and_fetch_all',
                        return_value=[
                            ({'name': 'users/1/packages/1', 'value': 'one'},),
                            ({'name': 'users/1/packages/2', 'value': 'two'},),
                        ]):
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
        repository = ResourceRepository(FakeModel)
        resource = FakeModel(value='new')

        with mock.patch('handler.repository.run_sql_with_param_and_fetch_one',
                        return_value=(7,)) as insert_mock, \
                mock.patch.object(repository, '_update') as update_mock:
            self.assertIs(repository.create('users/1', resource, actor_info=123),
                          resource)

        self.assertEqual('users/1/packages/7', resource.name)
        insert_mock.assert_called_once()
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
        repository = ResourceRepository(FakeModel)
        resource = FakeModel(name='packages/1')

        with mock.patch('handler.repository.run_sql_with_param') as sql_mock:
            self.assertIs(repository.delete(resource, actor_info=123), resource)

        resource.delete_mock.assert_called_once_with(actor_info=123)
        sql_mock.assert_called_once()

    def test_repository_for_reuses_repository_instances(self):
        self.assertIs(repository_for(FakeModel), repository_for(FakeModel))


if __name__ == '__main__':
    unittest.main()
