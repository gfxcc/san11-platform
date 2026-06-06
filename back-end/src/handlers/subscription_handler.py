import logging
import os
from typing import Iterable, List, Tuple

import attrs

from core.errors.exceptions import (InvalidArgument, NotFound,
                                      PermissionDenied)
from app.handler_context import HandlerContext
from core.models.base import (FieldMask, HandlerBase, ListOptions,
                                merge_resource)
from models.model_user import ModelUser
from models.plugins.subscribable import ModelSubscription, Subscribable
from repositories.resource_repository import repository_for
from core.resources.name_util import ResourceName
from core.resources.resource_parser import find_resource

from app.protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class SubscriptionHandler(HandlerBase):
    def __init__(self, subscription_repository=None):
        self.subscription_repository = (
            subscription_repository or repository_for(ModelSubscription))

    def create(self, parent: str, sub: ModelSubscription,
               handler_context: HandlerContext) -> ModelSubscription:
        target = find_resource(sub.target)
        if not isinstance(target, Subscribable):
            raise InvalidArgument('目标无法被订阅')
        return target.subscribe(parent)

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelSubscription], str]:
        logger.debug(ModelSubscription.__annotations__)
        subs, next_page_token = self.subscription_repository.list(list_options)
        return subs, next_page_token

    def update(self,
               update_resource: ModelSubscription,
               update_mask: FieldMask,
               handler_context: HandlerContext) -> ModelSubscription:
        resource: ModelSubscription = merge_resource(
            self.subscription_repository.get(update_resource.name), update_resource, update_mask)
        return self.subscription_repository.update(
            resource, actor_info=handler_context.user.user_id)

    def delete(self, name: str, handler_context: HandlerContext) -> ModelSubscription:
        sub: ModelSubscription = self.subscription_repository.get(name)
        target = find_resource(sub.target)
        logger.debug(target)
        if not isinstance(target, Subscribable):
            raise InvalidArgument('目标无法被订阅')
        target.unsubscribe(str(ResourceName.from_str(sub.name).parent))
        return sub
