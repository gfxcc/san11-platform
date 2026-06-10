import json
import logging
import os
from collections import Counter, defaultdict
from datetime import datetime, timedelta

from app.protos import san11_platform_pb2
from core.errors.exceptions import InvalidArgument
from core.models.base import ListOptions
from core.resources.name_util import ResourceName
from core.time_util import get_now, get_timezone
from models.model_package import ModelPackage
from models.model_user import ModelUser
from models.plugins.tracklifecycle import Action, ModelActivity
from repositories.resource_repository import repository_for

logger = logging.getLogger(os.path.basename(__file__))
ACTIVITY_PAGE_SIZE = 1000


class AdminHandler:
    def __init__(self, user_repository=None, package_repository=None, activity_repository=None):
        self.user_repository = user_repository or repository_for(ModelUser)
        self.package_repository = package_repository or repository_for(ModelPackage)
        self.activity_repository = activity_repository or repository_for(ModelActivity)

    def get_admin_message(self, request, context):
        now = get_now()
        window_7d = now - timedelta(days=7)
        window_30d = now - timedelta(days=30)

        total_users = self._count(self.user_repository)
        new_users_7d = self._count(
            self.user_repository,
            filter=self._datetime_filter('create_time', window_7d),
        )
        new_users_30d = self._count(
            self.user_repository,
            filter=self._datetime_filter('create_time', window_30d),
        )
        total_packages = self._count(self.package_repository)
        package_state_counts = self._package_state_counts()
        recent_users = self._list_page(
            self.user_repository,
            page_size=10,
            order_by='create_time desc',
        )
        top_packages = self._list_page(
            self.package_repository,
            page_size=8,
            order_by='download_count desc, like_count desc',
        )
        activities = self._list_matching(
            self.activity_repository,
            filter=self._datetime_filter('create_time', window_30d),
            page_size=ACTIVITY_PAGE_SIZE,
        )

        recent_activities = [
            activity for activity in activities
            if self._as_aware_datetime(activity.create_time) >= window_30d
        ]

        activity_counts = Counter(activity.action for activity in recent_activities)
        active_user_activity_counts = Counter()
        last_active_at = {}
        for activity in recent_activities:
            actor_id = self._actor_id_from_activity(activity)
            if actor_id is None:
                continue
            active_user_activity_counts[actor_id] += 1
            current_last_active_at = last_active_at.get(actor_id)
            activity_time = self._as_aware_datetime(activity.create_time)
            if current_last_active_at is None or activity_time > current_last_active_at:
                last_active_at[actor_id] = activity_time

        top_active_users = active_user_activity_counts.most_common(10)
        users_by_id = self._users_by_id([user_id for user_id, _ in top_active_users])
        top_packages = sorted(
            top_packages,
            key=lambda item: (item.download_count, item.like_count),
            reverse=True,
        )[:8]

        message = {
            'generatedAt': self._isoformat(now),
            'windowDays': 30,
            'metrics': {
                'totalUsers': total_users,
                'newUsers7d': new_users_7d,
                'newUsers30d': new_users_30d,
                'monthlyActiveUsers': len(active_user_activity_counts),
                'totalPackages': total_packages,
                'publicPackages': package_state_counts[san11_platform_pb2.ResourceState.NORMAL],
                'pendingReviews': package_state_counts[san11_platform_pb2.ResourceState.UNDER_REVIEW],
                'hiddenPackages': package_state_counts[san11_platform_pb2.ResourceState.HIDDEN],
                'downloads30d': activity_counts[Action.DOWNLOAD.value],
                'socialActions30d': sum(activity_counts[action.value] for action in [
                    Action.LIKE,
                    Action.UPVOTE,
                    Action.SUBSCRIBE,
                    Action.UNSUBSCRIBE,
                    Action.DISLIKE,
                ]),
                'contentChanges30d': sum(activity_counts[action.value] for action in [
                    Action.CREATE,
                    Action.UPDATE,
                    Action.DELETE,
                ]),
            },
            'resourceStates': {
                self._resource_state_name(state): count
                for state, count in package_state_counts.items()
                if count
            },
            'recentUsers': [
                self._user_summary(user)
                for user in recent_users[:10]
            ],
            'activeUsers': [
                self._active_user_summary(user_id, count, users_by_id, last_active_at)
                for user_id, count in top_active_users
            ],
            'topPackages': [
                self._package_summary(package)
                for package in top_packages
            ],
        }

        return san11_platform_pb2.AdminMessage(
            message=json.dumps(message, indent=4, ensure_ascii=False)
        )

    def _count(self, repository, filter: str = '') -> int:
        list_options = ListOptions(parent=None, filter=filter)
        if hasattr(repository, 'count'):
            return repository.count(list_options)
        return len(repository.list(list_options)[0])

    def _list_page(self, repository, page_size: int, order_by: str = '', filter: str = '', watermark: int = 0):
        return repository.list(ListOptions(
            parent=None,
            page_size=page_size,
            watermark=watermark,
            order_by=order_by,
            filter=filter,
        ))[0]

    def _list_matching(self, repository, filter: str, page_size: int):
        items = []
        watermark = 0
        while True:
            page = self._list_page(
                repository,
                page_size=page_size,
                filter=filter,
                watermark=watermark,
            )
            items.extend(page)
            if len(page) < page_size:
                return items
            watermark += len(page)

    def _package_state_counts(self):
        return defaultdict(int, {
            state: self._count(self.package_repository, filter=f'state={state}')
            for state in [
                san11_platform_pb2.ResourceState.NORMAL,
                san11_platform_pb2.ResourceState.UNDER_REVIEW,
                san11_platform_pb2.ResourceState.HIDDEN,
                san11_platform_pb2.ResourceState.SCHEDULED_DELETE,
                san11_platform_pb2.ResourceState.DELETED,
            ]
        })

    def _users_by_id(self, user_ids):
        users_by_id = {}
        if not hasattr(self.user_repository, 'get'):
            return {
                user.user_id: user
                for user in self.user_repository.list(ListOptions(parent=None))[0]
                if user.user_id in user_ids
            }
        for user_id in user_ids:
            try:
                users_by_id[user_id] = self.user_repository.get(f'users/{user_id}')
            except Exception as err:
                logger.warning(f'Failed to load active user {user_id}: {err}')
        return users_by_id

    def _user_summary(self, user: ModelUser) -> dict:
        return {
            'name': user.name,
            'userId': user.user_id,
            'username': user.username,
            'type': san11_platform_pb2.User.UserType.Name(user.type),
            'imageUrl': user.image_url,
            'createTime': self._isoformat(user.create_time),
            'subscriberCount': user.subscriber_count,
        }

    def _active_user_summary(self, user_id: int, activity_count: int, users_by_id: dict, last_active_at: dict) -> dict:
        user = users_by_id.get(user_id)
        if not user:
            return {
                'userId': user_id,
                'username': f'用户 {user_id}',
                'activityCount': activity_count,
                'lastActiveAt': self._isoformat(last_active_at[user_id]),
            }

        summary = self._user_summary(user)
        summary['activityCount'] = activity_count
        summary['lastActiveAt'] = self._isoformat(last_active_at[user_id])
        return summary

    def _package_summary(self, package: ModelPackage) -> dict:
        return {
            'name': package.name,
            'packageName': package.package_name,
            'authorId': package.author_id,
            'state': self._resource_state_name(package.state),
            'downloadCount': package.download_count,
            'likeCount': package.like_count,
            'dislikeCount': package.dislike_count,
            'createTime': self._isoformat(package.create_time),
            'updateTime': self._isoformat(package.update_time),
        }

    def _actor_id_from_activity(self, activity: ModelActivity):
        try:
            resource_name = ResourceName.from_str(activity.name)
        except InvalidArgument:
            return None

        parent = resource_name.parent
        if not isinstance(parent, ResourceName) or parent.collection != 'users':
            return None
        return parent.resource_id

    def _resource_state_name(self, state: int) -> str:
        try:
            return san11_platform_pb2.ResourceState.Name(state)
        except ValueError:
            return 'RESOURCE_STATE_UNSPECIFIED'

    def _as_aware_datetime(self, value: datetime) -> datetime:
        if value.tzinfo:
            return value.astimezone(get_timezone())
        return get_timezone().localize(value)

    def _datetime_filter(self, field_name: str, value: datetime) -> str:
        return f'{field_name}>="{self._isoformat(value)}"'

    def _isoformat(self, value: datetime) -> str:
        return self._as_aware_datetime(value).isoformat()
