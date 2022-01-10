import logging
import os
from typing import Iterable, Tuple

from handler.common.field_mask import FieldMask, merge_resource
from handler.model.base.base_db import ListOptions

from .model.model_notification import ModelNotification

logger = logging.getLogger(os.path.basename(__file__))


class NotificationHandler:
    def list_notifications(self, request, handler_context) -> Tuple[Iterable[ModelNotification], str]:
        list_options = ListOptions.from_request(request)
        order_by = 'create_time desc' + \
            (f', {list_options.order_by}' if list_options.order_by else '')
        filter = 'unread = true' + \
            (f' AND {list_options.filter}' if list_options.filter else '')
        list_options.order_by = order_by
        list_options.filter = filter
        notifications, next_page_token = ModelNotification.list(list_options)
        return notifications, next_page_token

    def update_notification(self,
                            source: ModelNotification,
                            dest: ModelNotification,
                            update_mask: FieldMask,
                            handler_context) -> ModelNotification:
        notification: ModelNotification = merge_resource(
            dest, source, update_mask)
        notification.update(handler_context.user.user_id)
        return notification
