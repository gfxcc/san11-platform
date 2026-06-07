import logging
import os

from app.handler_context import HandlerContext
from core.errors.exceptions import InvalidArgument
from core.models.base import FieldMask, HandlerBase, merge_resource
from models.model_reply import ModelReply
from models.model_thread import ModelThread
from repositories.resource_repository import repository_for
from core.resources.name_util import ResourceName
from integrations.notifications.notifier import notify_on_creation
from core.resources.resource_parser import find_resource


logger = logging.getLogger(os.path.basename(__file__))


class ReplyHandler(HandlerBase):
    def __init__(self, reply_repository=None, thread_repository=None):
        self.reply_repository = reply_repository or repository_for(ModelReply)
        self.thread_repository = thread_repository or repository_for(ModelThread)

    def create(self, parent: str, reply: ModelReply,
               handler_context: HandlerContext) -> ModelReply:
        user_id = handler_context.authenticated_user.user_id
        reply.author_id = user_id
        grand_parent = find_resource(ResourceName.from_str(parent).parent)
        if isinstance(grand_parent, ModelThread):
            thread = grand_parent
            thread.reply_count += 1
            thread.latest_commented_time = reply.create_time
            thread.latest_commenter_id = user_id
            self.thread_repository.update(thread, update_update_time=False)

        self.reply_repository.create(
            parent=parent, resource=reply, actor_info=user_id)

        # Post creation
        notify_on_creation(reply)
        return reply

    def update(self, update_reply: ModelReply, update_mask: FieldMask,
               handler_context: HandlerContext) -> ModelReply:
        sanitized_update_mask = FieldMask(
            set(update_mask.paths) - {'like_count', 'dislike_count'})
        reply = merge_resource(base_resource=self.reply_repository.get(update_reply.name),
                               update_request=update_reply,
                               field_mask=sanitized_update_mask)
        actor = handler_context.authenticated_user

        if update_mask.has('like_count'):
            reply.toggle_like(actor.name)

        is_visitor = True if set(update_mask.paths) <= {
            'like_count', 'dislike_count'} else False
        if is_visitor:
            self.reply_repository.update(reply, update_update_time=False)
        else:
            self.reply_repository.update(reply, actor_info=actor.name)
        return reply

    def delete(self, name: str, handler_context: HandlerContext) -> ModelReply:
        reply = self.reply_repository.get(name)
        parent = ResourceName.from_str(reply.name).parent
        if not isinstance(parent, ResourceName):
            raise InvalidArgument(f'Reply {reply.name} has no comment parent')
        grandparent = find_resource(parent.parent)
        if isinstance(grandparent, ModelThread):
            grandparent.reply_count -= 1
            self.thread_repository.update(grandparent, update_update_time=False)
        return self.reply_repository.delete(
            reply, actor_info=handler_context.authenticated_user.user_id)
