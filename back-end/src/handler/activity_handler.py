import logging
import os
from typing import List, Tuple

from handler.common.exception import NotFound, InvalidArgument
from handler.model.base import ListOptions, ModelBase
from handler.model.plugins.tracklifecycle import Action, ModelActivity
from handler.model.plugins.likeable import Likeable
from handler.util.resource_view import ResourceViewVisitor
from handler.handler_context import HandlerContext

from .protos import san11_platform_pb2 as pb
from .util.resource_parser import find_resource
from .util.time_util import get_age

logger = logging.getLogger(os.path.basename(__file__))


class ActivityHandler:
    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[pb.Activity], str]:
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

    def toggle(self, target: ModelBase, action: Action, handler_context: HandlerContext) -> pb.ToggleActionResponse:
        assert isinstance(
            target, Likeable), f'Resource {type(target)} is not Likeable'
        assert isinstance(
            target, ModelBase), f'Resource {type(target)} is not Likeable'

        actor = handler_context.user
        if action == Action.LIKE:
            target.toggle_like(actor.name)
        elif action == Action.DISLIKE:
            target.toggle_dislike(actor.name)
        else:
            raise InvalidArgument(f'Invalid action {action.name} on {target}')

        target.update(update_update_time=False)
        return pb.ToggleActionResponse(
            like_count=target.like_count,
            dislike_count=target.dislike_count,
        )
