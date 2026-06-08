import json
import logging
import os
from collections import Counter, defaultdict
from datetime import datetime, timedelta

from app.protos import san11_platform_pb2
from core.errors.exceptions import InvalidArgument
from core.models.base import ListOptions, MAX_PAGE_SIZE
from core.resources.name_util import ResourceName
from core.time_util import get_now, get_timezone
from models.model_package import ModelPackage
from models.model_user import ModelUser
from models.plugins.tracklifecycle import Action, ModelActivity
from repositories.resource_repository import repository_for

logger = logging.getLogger(os.path.basename(__file__))


class AdminHandler:
    def __init__(self, user_repository=None, package_repository=None, activity_repository=None):
        self.user_repository = user_repository or repository_for(ModelUser)
        self.package_repository = package_repository or repository_for(ModelPackage)
        self.activity_repository = activity_repository or repository_for(ModelActivity)

    def get_admin_message(self, request, context):
        users = self._list_all(self.user_repository, order_by='create_time desc')
        packages = self._list_all(self.package_repository, order_by='create_time desc')
        activities = self._list_all(self.activity_repository, order_by='create_time desc')

        now = get_now()
        window_7d = now - timedelta(days=7)
        window_30d = now - timedelta(days=30)

        recent_activities = [
            activity for activity in activities
            if self._as_aware_datetime(activity.create_time) >= window_30d
        ]
        recent_users = [
            user for user in users
            if self._as_aware_datetime(user.create_time) >= window_7d
        ]
        monthly_new_users = [
            user for user in users
            if self._as_aware_datetime(user.create_time) >= window_30d
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

        users_by_id = {user.user_id: user for user in users}
        resource_state_counts = defaultdict(int)
        for package in packages:
            resource_state_counts[self._resource_state_name(package.state)] += 1

        message = {
            'generatedAt': self._isoformat(now),
            'windowDays': 30,
            'metrics': {
                'totalUsers': len(users),
                'newUsers7d': len(recent_users),
                'newUsers30d': len(monthly_new_users),
                'monthlyActiveUsers': len(active_user_activity_counts),
                'totalPackages': len(packages),
                'publicPackages': sum(1 for item in packages if item.state == san11_platform_pb2.ResourceState.NORMAL),
                'pendingReviews': sum(1 for item in packages if item.state == san11_platform_pb2.ResourceState.UNDER_REVIEW),
                'hiddenPackages': sum(1 for item in packages if item.state == san11_platform_pb2.ResourceState.HIDDEN),
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
            'resourceStates': dict(resource_state_counts),
            'recentUsers': [
                self._user_summary(user)
                for user in users[:10]
            ],
            'activeUsers': [
                self._active_user_summary(user_id, count, users_by_id, last_active_at)
                for user_id, count in active_user_activity_counts.most_common(10)
            ],
            'topPackages': [
                self._package_summary(package)
                for package in sorted(packages, key=lambda item: (item.download_count, item.like_count), reverse=True)[:8]
            ],
        }

        return san11_platform_pb2.AdminMessage(
            message=json.dumps(message, indent=4, ensure_ascii=False)
        )

    def _list_all(self, repository, order_by: str):
        return repository.list(ListOptions(
            parent=None,
            page_size=MAX_PAGE_SIZE,
            order_by=order_by,
        ))[0]

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

    def _isoformat(self, value: datetime) -> str:
        return self._as_aware_datetime(value).isoformat()
