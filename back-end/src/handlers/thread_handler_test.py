import unittest

from app.protos import san11_platform_pb2 as pb
from core.models.base import ListOptions
from handlers.thread_handler import ThreadHandler


class FakeThreadRepository:
    def __init__(self):
        self.list_options = None

    def list(self, list_options):
        self.list_options = list_options
        return [], 'next-token'


class FakeUser:
    def __init__(self, admin=False):
        self._admin = admin

    def is_admin(self):
        return self._admin


class FakeContext:
    def __init__(self, user=None):
        self.user = user


class ThreadHandlerListTest(unittest.TestCase):
    def test_non_admin_preserves_filter_and_requires_normal_state(self):
        repository = FakeThreadRepository()
        handler = ThreadHandler(thread_repository=repository)

        _, next_page_token = handler.list_threads(
            ListOptions(
                parent='discussion',
                order_by='latest_commented_time desc',
                filter='tags:"反馈"',
            ),
            FakeContext(user=FakeUser(admin=False)),
        )

        self.assertEqual('next-token', next_page_token)
        self.assertEqual(
            'pinned desc, latest_commented_time desc',
            repository.list_options.order_by,
        )
        self.assertEqual(
            f'(tags:"反馈") AND (state={pb.ResourceState.NORMAL})',
            repository.list_options.filter,
        )

    def test_admin_preserves_requested_filter(self):
        repository = FakeThreadRepository()
        handler = ThreadHandler(thread_repository=repository)

        handler.list_threads(
            ListOptions(parent=None, filter='state=2'),
            FakeContext(user=FakeUser(admin=True)),
        )

        self.assertEqual('state=2', repository.list_options.filter)


if __name__ == '__main__':
    unittest.main()
