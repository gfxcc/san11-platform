import logging
import os
from typing import Iterable, Tuple

from handler.model.base.base_db import ListOptions
from handler.model.model_comment import ModelComment
from handler.model.model_reply import ModelReply
from handler.util import gcs

from .common.field_mask import FieldMask, merge_resource
from .model.model_notification import ModelNotification
from .model.model_thread import ModelThread
from .protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class NotificationHandler:
    def list_notifications(self, request, handler_context) -> Tuple[Iterable[ModelNotification], str]:
        list_options = ListOptions.from_request(request)
        order_by = 'create_time desc' + \
            (f', {list_options.order_by}' if list_options.order_by else '')
        list_options.order_by = order_by
        notifications, next_page_token = ModelNotification.list(list_options)
        return notifications, next_page_token

    def update_notification(self, base_notification: ModelNotification, update_notification: ModelNotification, update_mask: FieldMask, handler_context) -> ModelThread:
        notification: ModelThread = merge_resource(
            base_notification, update_notification, update_mask)
        notification.update(handler_context.user.user_id)
        return notification

