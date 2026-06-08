import json
import unittest
from datetime import timedelta

from app.protos import san11_platform_pb2 as pb
from core.time_util import get_now
from handlers.admin_handler import AdminHandler
from models.model_package import ModelPackage
from models.model_user import DEFAULT_USER_AVATAR, ModelUser, default_user_settings
from models.plugins.tracklifecycle import Action, ModelActivity


class FakeRepository:
    def __init__(self, resources):
        self.resources = resources

    def list(self, list_options):
        return self.resources, ''


class AdminHandlerTest(unittest.TestCase):
    def test_get_admin_message_returns_operational_summary(self):
        now = get_now()
        users = [
            self._user(1, 'admin', pb.User.UserType.ADMIN, now - timedelta(days=1)),
            self._user(2, 'author', pb.User.UserType.REGULAR, now - timedelta(days=12)),
            self._user(3, 'old-user', pb.User.UserType.REGULAR, now - timedelta(days=80)),
        ]
        packages = [
            self._package('categories/1/packages/10', '公开资源', pb.NORMAL, 12, 4),
            self._package('categories/1/packages/11', '待审资源', pb.UNDER_REVIEW, 2, 1),
            self._package('categories/2/packages/12', '隐藏资源', pb.HIDDEN, 1, 0),
        ]
        activities = [
            self._activity('users/1/activities/1', Action.CREATE, now - timedelta(days=2)),
            self._activity('users/2/activities/2', Action.DOWNLOAD, now - timedelta(days=3)),
            self._activity('users/2/activities/3', Action.LIKE, now - timedelta(days=4)),
            self._activity('users/3/activities/4', Action.DOWNLOAD, now - timedelta(days=45)),
        ]
        handler = AdminHandler(
            user_repository=FakeRepository(users),
            package_repository=FakeRepository(packages),
            activity_repository=FakeRepository(activities),
        )

        response = handler.get_admin_message(None, None)
        message = json.loads(response.message)

        self.assertEqual(message['metrics']['totalUsers'], 3)
        self.assertEqual(message['metrics']['newUsers7d'], 1)
        self.assertEqual(message['metrics']['newUsers30d'], 2)
        self.assertEqual(message['metrics']['monthlyActiveUsers'], 2)
        self.assertEqual(message['metrics']['pendingReviews'], 1)
        self.assertEqual(message['metrics']['downloads30d'], 1)
        self.assertEqual(message['metrics']['socialActions30d'], 1)
        self.assertEqual(message['metrics']['contentChanges30d'], 1)
        self.assertEqual(message['resourceStates']['NORMAL'], 1)
        self.assertEqual(message['resourceStates']['UNDER_REVIEW'], 1)
        self.assertEqual(message['topPackages'][0]['packageName'], '公开资源')
        self.assertEqual(message['activeUsers'][0]['username'], 'author')

    def _user(self, user_id: int, username: str, user_type: int, create_time):
        return ModelUser(
            name=f'users/{user_id}',
            username=username,
            email=f'{username}@example.com',
            type=user_type,
            image_url=DEFAULT_USER_AVATAR,
            website='',
            hashed_password='',
            subscriber_count=0,
            create_time=create_time,
            update_time=create_time,
            settings=default_user_settings(),
        )

    def _package(self, name: str, package_name: str, state: int, download_count: int, like_count: int):
        now = get_now()
        return ModelPackage(
            name=name,
            package_name=package_name,
            description='',
            create_time=now,
            update_time=now,
            state=state,
            author_id=1,
            image_urls=[],
            tags=[],
            download_count=download_count,
            like_count=like_count,
            dislike_count=0,
            subscriber_count=0,
        )

    def _activity(self, name: str, action: Action, create_time):
        return ModelActivity(
            name=name,
            create_time=create_time,
            action=action.value,
            resource_name='categories/1/packages/10',
        )


if __name__ == '__main__':
    unittest.main()
