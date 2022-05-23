import logging
import os

from handler.handler_context import HandlerContext
from handler.model.base import FieldMask, HandlerBase, merge_resource
from handler.model.model_reply import ModelReply
from handler.model.model_thread import ModelThread
from handler.model.model_user import ModelUser
from handler.model.user import User
from handler.util.html_util import get_text_from_html
from handler.util.name_util import ResourceName
from handler.util.notifier import notify
from handler.util.resource_parser import find_resource
from handler.util.resource_view import ResourceViewVisitor

from .common.exception import NotFound
from .model.activity import Activity
from .model.model_activity import Action
from .util.time_util import get_now

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

        if isinstance(grand_parent, ModelThread):
            thread = grand_parent
            comment = find_resource(ResourceName.from_str(parent))
            view = ResourceViewVisitor().visit(thread)
            notify(
                sender_id=user_id,
                receiver_id=comment.author_id,
                content=f"{ModelUser.from_name(f'users/{user_id}').username} 回复了 {get_text_from_html(comment.text)}: {get_text_from_html(reply.text)}",
                link=view.name,
                image_preview=view.image_url,
            )
        reply.create(parent=parent, user_id=user_id)
        return reply

    def update(self, update_reply: ModelReply, update_mask: FieldMask,
               handler_context: HandlerContext) -> ModelReply:
        # Value of update_count.upvote_count is 1 if upvote event is emitted.
        # Using 1 rather than precomputed count from client side to avoid race condition
        #   where multiple upvote event is emiited at the same time.
        # Remove `upvote_count` from update_mask here and handle the count update
        #   explicitly later.
        sanitized_update_mask = FieldMask(
            set(update_mask.paths) - {'upvote_count'})
        reply = merge_resource(base_resource=ModelReply.from_name(update_reply.name),
                               update_request=update_reply,
                               field_mask=sanitized_update_mask)
        user_id = handler_context.user.user_id
        if update_mask.has('upvote_count'):
            try:
                activity = Activity.from_detail(
                    user_id=user_id, action=Action.UPVOTE, resource_name=reply.name)
            except NotFound as err:
                Activity(activity_id=0, user_id=user_id,
                         create_time=get_now(),
                         action=Action.UPVOTE, resource_name=reply.name).create()
                reply.upvote_count += 1
            else:
                # upvote from the same user will result as cancelling previous upvote
                activity.delete()
                reply.upvote_count -= 1

        reply.update(user_id=user_id)
        return reply

    def delete(self, name: str, handler_context: HandlerContext) -> ModelReply:
        reply = ModelReply.from_name(name)
        grandparent = find_resource(
            ResourceName.from_str(reply.name).parent.parent)
        if isinstance(grandparent, ModelThread):
            grandparent.reply_count -= 1
            grandparent.update(update_update_time=False)
        reply.delete(user_id=handler_context.user.user_id)
        return reply
