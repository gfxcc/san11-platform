import logging
import os

from handler.handler_context import HandlerContext
from handler.model.base import FieldMask, HandlerBase, merge_resource
from handler.model.model_reply import ModelReply
from handler.model.model_thread import ModelThread
from handler.util.name_util import ResourceName
from handler.util.notifier import notify_on_creation
from handler.util.resource_parser import find_resource


logger = logging.getLogger(os.path.basename(__file__))


class ReplyHandler(HandlerBase):
    def create(self, parent: str, reply: ModelReply,
               handler_context: HandlerContext) -> ModelReply:
        user_id = handler_context.user.user_id
        reply.author_id = user_id
        grand_parent = find_resource(ResourceName.from_str(parent).parent)
        if isinstance(grand_parent, ModelThread):
            thread = grand_parent
            thread.reply_count += 1
            thread.latest_commented_time = reply.create_time
            thread.latest_commenter_id = user_id
            thread.update(update_update_time=False)

        reply.create(parent=parent, actor_info=user_id)

        # Post creation
        notify_on_creation(reply)
        return reply

    def update(self, update_reply: ModelReply, update_mask: FieldMask,
               handler_context: HandlerContext) -> ModelReply:
        sanitized_update_mask = FieldMask(
            set(update_mask.paths) - {'like_count', 'dislike_count'})
        reply = merge_resource(base_resource=ModelReply.from_name(update_reply.name),
                               update_request=update_reply,
                               field_mask=sanitized_update_mask)
        actor = handler_context.user

        if update_mask.has('like_count'):
            reply.toggle_like(actor.name)

        is_visitor = True if set(update_mask.paths) <= {
            'like_count', 'dislike_count'} else False
        if is_visitor:
            reply.update(update_update_time=False)
        else:
            reply.update(actor_info=actor.name)
        return reply

    def delete(self, name: str, handler_context: HandlerContext) -> ModelReply:
        reply = ModelReply.from_name(name)
        grandparent = find_resource(
            ResourceName.from_str(reply.name).parent.parent)
        if isinstance(grandparent, ModelThread):
            grandparent.reply_count -= 1
            grandparent.update(update_update_time=False)
        reply.delete(actor_info=handler_context.user.user_id)
        return reply
