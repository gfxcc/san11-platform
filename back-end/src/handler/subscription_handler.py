import logging
import os
from typing import Iterable, List, Tuple

from handler.common.exception import NotFound, PermissionDenied
from handler.handler_context import HandlerContext
from handler.model.base import HandlerBase, merge_resource
from handler.model.base.base_db import ListOptions
from handler.model.base.common import FieldMask
from handler.model.model_subscription import (ModelSubscription,
                                              find_subscription)
from handler.model.model_user import ModelUser
from handler.util.resource_parser import find_resource

from .protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class SubscriptionHandler(HandlerBase):
    def create(self, parent: str, sub: ModelSubscription,
               handler_context: HandlerContext) -> ModelSubscription:
        try:
            subscription = find_subscription(parent, handler_context.user.user_id)
        except NotFound:
            pass
        else:
            return subscription
        
        sub.subscriber_id = handler_context.user.user_id
        sub.create(parent=parent, user_id=handler_context.user.user_id)

        # (TODO): Update subscriber_count on the resource being subscribed.
        target = find_resource(parent)
        if isinstance(target, ModelUser):
            target.subscriber_count += 1
            target.update(update_update_time=False)
        return sub

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelSubscription], str]:
        logger.debug(list_options)
        subs, next_page_token = ModelSubscription.list(list_options)
        return subs, next_page_token

    def update(self,
               update_sub: ModelSubscription,
               update_mask: FieldMask,
               handler_context) -> ModelSubscription:
        sub: ModelSubscription = merge_resource(
            ModelSubscription.from_name(update_sub.name), update_sub, update_mask)
        sub.update(handler_context.user.user_id)
        return sub

    def delete(self, name: str, handler_context: HandlerContext) -> ModelSubscription:
        sub = ModelSubscription.from_name(name)
        sub.delete(handler_context.user.user_id)
        return sub

    def unsubscribe(self, subscribed_resource: str, subscriber_id: int, handler_context: HandlerContext) -> None:
        if subscriber_id != handler_context.user.user_id:
            raise PermissionDenied()
        try:
            subscription = find_subscription(subscribed_resource, subscriber_id)
        except NotFound:
            return
        target = find_resource(subscribed_resource)
        if isinstance(target, ModelUser):
            target.subscriber_count -= 1
            target.update(update_update_time=False)
        subscription.delete()
        
