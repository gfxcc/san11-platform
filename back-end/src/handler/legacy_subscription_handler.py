import logging
import os
from typing import Iterable, List, Tuple

import attrs

from handler.common.exception import NotFound, PermissionDenied
from handler.handler_context import HandlerContext
from handler.model.base import (FieldMask, HandlerBase, ListOptions,
                                merge_resource)
from handler.model.model_legacy_subscription import (ModelLegacySubscription,
                                                     find_subscription)
from handler.model.model_user import ModelUser
from handler.util.resource_parser import find_resource

from .protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class LegacySubscriptionHandler(HandlerBase):
    def create(self, parent: str, sub: ModelLegacySubscription,
               handler_context: HandlerContext) -> ModelLegacySubscription:
        try:
            subscription = find_subscription(
                parent, handler_context.user.user_id)
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

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelLegacySubscription], str]:
        for a in attrs.fields(ModelLegacySubscription):
            logger.debug(a)
        logger.debug(ModelLegacySubscription.__annotations__)
        subs, next_page_token = ModelLegacySubscription.list(list_options)
        return subs, next_page_token

    def update(self,
               update_resource: ModelLegacySubscription,
               update_mask: FieldMask,
               handler_context: HandlerContext) -> ModelLegacySubscription:
        resource: ModelLegacySubscription = merge_resource(
            ModelLegacySubscription.from_name(update_resource.name), update_resource, update_mask)
        resource.update(user_id=handler_context.user.user_id)
        return resource

    def delete(self, name: str, handler_context: HandlerContext) -> ModelLegacySubscription:
        resource: ModelLegacySubscription = ModelLegacySubscription.from_name(
            name)
        resource.delete(handler_context.user.user_id)
        return resource

    def unsubscribe(self, subscribed_resource: str, subscriber_id: int, handler_context: HandlerContext) -> None:
        if subscriber_id != handler_context.user.user_id:
            raise PermissionDenied()
        try:
            subscription = find_subscription(
                subscribed_resource, subscriber_id)
        except NotFound:
            return
        target = find_resource(subscribed_resource)
        if isinstance(target, ModelUser):
            target.subscriber_count -= 1
            target.update(update_update_time=False)
        subscription.delete()
