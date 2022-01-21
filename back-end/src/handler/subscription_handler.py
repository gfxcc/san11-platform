import logging
import os
from typing import Iterable, Tuple

from handler.model.base.base_db import ListOptions
from handler.model.model_subscription import ModelSubscription

from .common.field_mask import FieldMask, merge_resource
from .protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class SubscriptionHandler:
    def create_subscription(self, parent: str, sub: ModelSubscription,
                            handler_context) -> ModelSubscription:
        sub.subscriber_id = handler_context.user.user_id
        sub.type = pb.SubscribeType.ALL
        sub.create(parent=parent, user_id=handler_context.user.user_id)

        # (TODO): Update subscriber_count on the resource being subscribed.
        return sub

    def list_subscriptions(self, request, handler_context) -> Tuple[Iterable[ModelSubscription], str]:
        list_options = ListOptions.from_request(request)
        subs, next_page_token = ModelSubscription.list(list_options)
        return subs, next_page_token

    def update_subscription(self, base_sub: ModelSubscription,
                            update_sub: ModelSubscription,
                            update_mask: FieldMask,
                            handler_context) -> ModelSubscription:
        sub: ModelSubscription = merge_resource(
            base_sub, update_sub, update_mask)
        sub.update(handler_context.user.user_id)
        return sub

    def delete_subscription(self, sub: ModelSubscription, handler_context) -> ModelSubscription:
        sub.delete(handler_context.user.user_id)
        return sub
