import logging
import os
from typing import List, Tuple

from handler.common.exception import NotFound
from handler.model.base import ListOptions
from handler.model.plugins.tracklifecycle import ModelActivity
from handler.util.resource_view import ResourceViewVisitor

from .protos import san11_platform_pb2 as pb
from .util.resource_parser import find_resource
from .util.time_util import get_age

logger = logging.getLogger(os.path.basename(__file__))


class ActivityHandler:
    def list(self, list_options: ListOptions, handler_context) -> Tuple[List[pb.Activity], str]:
        # # (TODO): BEGIN = Remove logic for model migration.
        # if not ModelActivity.list(ListOptions(parent='users/1'))[0]:
        #     for activity in Activity.list(page_size=1000, page_token=''):
        #         new_model = ModelActivity.from_v1(activity)
        #         new_model.create(parent=f'users/{activity.user_id}')
        # # END
        activities, next_page_token = ModelActivity.list(list_options)

        enriched_activities = []
        view_visitor = ResourceViewVisitor()
        for activity in activities:
            try:
                resource = find_resource(activity.resource_name)
            except NotFound:
                resource = None
            view = view_visitor.visit(resource) if resource else None
            enriched_activities.append(pb.Activity(
                name=activity.name,
                create_time=get_age(activity.create_time),
                action=activity.action,
                resource_view=view,
            ))

        return enriched_activities, next_page_token
