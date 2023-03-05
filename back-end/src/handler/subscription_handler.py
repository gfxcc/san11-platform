import logging
import os
from typing import Iterable, List, Tuple

import attrs

from handler.common.exception import (InvalidArgument, NotFound,
                                      PermissionDenied)
from handler.handler_context import HandlerContext
from handler.model.base import (FieldMask, HandlerBase, ListOptions,
                                merge_resource)
from handler.model.model_user import ModelUser
from handler.model.plugins.subscribable import ModelSubscription, Subscribable
from handler.util.name_util import ResourceName
from handler.util.resource_parser import find_resource

from .protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class SubscriptionHandler(HandlerBase):
    def create(self, parent: str, sub: ModelSubscription,
               handler_context: HandlerContext) -> ModelSubscription:
        target = find_resource(sub.target)
        if not isinstance(target, Subscribable):
            raise InvalidArgument('目标无法被订阅')
        return target.subscribe(parent)

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelSubscription], str]:
        logger.debug(ModelSubscription.__annotations__)
        subs, next_page_token = ModelSubscription.list(list_options)
        return subs, next_page_token

    def update(self,
               update_resource: ModelSubscription,
               update_mask: FieldMask,
               handler_context: HandlerContext) -> ModelSubscription:
        resource: ModelSubscription = merge_resource(
            ModelSubscription.from_name(update_resource.name), update_resource, update_mask)
        resource.update(actor_info=handler_context.user.user_id)
        return resource

    def delete(self, name: str, handler_context: HandlerContext) -> ModelSubscription:
        sub: ModelSubscription = ModelSubscription.from_name(name)
        target = find_resource(sub.target)
        logger.debug(target)
        if not isinstance(target, Subscribable):
            raise InvalidArgument('目标无法被订阅')
        target.unsubscribe(str(ResourceName.from_str(sub.name).parent))
        return sub
