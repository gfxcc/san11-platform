import logging
import os
from typing import List, Tuple

from core.errors.exceptions import NotFound, InvalidArgument
from core.models.base import ListOptions, ModelBase
from models.plugins.tracklifecycle import Action, ModelActivity
from models.plugins.likeable import Likeable
from models.model_article import ModelArticle
from models.model_binary import ModelBinary
from models.model_comment import ModelComment
from models.model_package import ModelPackage
from models.model_reply import ModelReply
from models.model_tag import ModelTag
from models.model_thread import ModelThread
from models.model_user import ModelUser
from repositories.resource_repository import repository_for
from core.resources.resource_view import ResourceViewVisitor
from app.handler_context import HandlerContext

from app.protos import san11_platform_pb2 as pb
from core.resources.resource_parser import find_resource
from core.time_util import get_age

logger = logging.getLogger(os.path.basename(__file__))


class ActivityHandler:
    def __init__(self, activity_repository=None):
        self.activity_repository = activity_repository or repository_for(ModelActivity)

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[pb.Activity], str]:
        activities, next_page_token = self.activity_repository.list(list_options)

        enriched_activities = []
        view_visitor = ResourceViewVisitor()
        for activity in activities:
            try:
                resource = find_resource(activity.resource_name)
            except NotFound:
                resource = None
            view = view_visitor.visit(resource) if isinstance(
                resource,
                (ModelArticle, ModelBinary, ModelComment, ModelPackage,
                 ModelReply, ModelTag, ModelThread, ModelUser),
            ) else None
            enriched_activities.append(pb.Activity(
                name=activity.name,
                create_time=get_age(activity.create_time),
                action=pb.Action.ValueType(activity.action),
                resource_view=view,
            ))

        return enriched_activities, next_page_token

    def toggle(self, target: ModelBase, action: Action, handler_context: HandlerContext) -> pb.ToggleActionResponse:
        assert isinstance(
            target, Likeable), f'Resource {type(target)} is not Likeable'
        assert isinstance(
            target, ModelBase), f'Resource {type(target)} is not Likeable'

        actor = handler_context.authenticated_user
        if action == Action.LIKE:
            target.toggle_like(actor.name)
        elif action == Action.DISLIKE:
            target.toggle_dislike(actor.name)
        else:
            raise InvalidArgument(f'Invalid action {action.name} on {target}')

        repository_for(type(target)).update(target, update_update_time=False)
        return pb.ToggleActionResponse(
            like_count=target.like_count,
            dislike_count=target.dislike_count,
        )
