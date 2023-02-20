import imp
import logging
import os
import re
from typing import Iterable, List, Tuple

from handler.handler_context import HandlerContext
from handler.model.base import FieldMask, HandlerBase, merge_resource
from handler.model.base.base_db import ListOptions
from handler.model.model_comment import ModelComment
from handler.model.model_reply import ModelReply
from handler.model.model_thread import ModelThread
from handler.model.model_user import ModelUser
from handler.util.html_util import get_text_from_html
from handler.util.name_util import ResourceName
from handler.util.notifier import notify, send_message
from handler.util.resource_parser import find_resource
from handler.util.resource_view import ResourceViewVisitor

from .common.exception import NotFound
from .model.activity import Action, Activity
from .util.time_util import get_now

logger = logging.getLogger(os.path.basename(__file__))


class CommentHandler(HandlerBase):
    def create(self, parent: str, comment: ModelComment, handler_context: HandlerContext) -> ModelComment:
        user_id = handler_context.user.user_id
        username = ModelUser.from_name(f'users/{user_id}').username
        comment.author_id = user_id
        parent_obj = find_resource(parent)
        if isinstance(parent_obj, ModelThread):
            thread = parent_obj
            thread.comment_count += 1
            thread.latest_commented_time = comment.create_time
            thread.latest_commenter_id = user_id
            thread.update(update_update_time=False)
            comment.index = thread.comment_count
        comment.create(parent=parent, actor_info=user_id)
        comment_view = ResourceViewVisitor().visit(comment)

        # Post creation
        # 1. Send notification to thread author
        if isinstance(parent_obj, ModelThread):
            thread = parent_obj
            receiver = ModelUser.from_name(f'users/{thread.author_id}')
            if receiver.settings.notification.comments:
                notify(
                    sender_id=user_id,
                    receiver_id=receiver.user_id,
                    content=f"{username} 评论了 {comment_view.display_name}: {get_text_from_html(thread.content)}",
                    link=comment_view.name,
                    image_preview=comment_view.image_url,
                )
        # 2. Send notification to user be @
        # (TODO): wrapper this into a func so that it can be reused by reply, thread.
        content = comment.text
        # A sample of @user element `<a class="mention" href="users/73">@一笑悬命</a>`
        pattern = r'<a [^>]* href="users/(?P<user_id>[0-9]+)">@(?P<username>[^<]+)</a>'
        for at_user_id, at_username in re.findall(pattern, content):
            receiver = ModelUser.from_name(f'users/{at_user_id}')
            if receiver.settings.notification.mentions:
                notify(
                    sender_id=user_id,
                    receiver_id=receiver.user_id,
                    content=f"{username} 在评论中提到了你",
                    link=comment_view.name,
                    image_preview='',
                )
        return comment

    def list(self, list_options: ListOptions,
             handler_context: HandlerContext) -> Tuple[List[ModelComment], str]:
        return ModelComment.list(list_options=list_options)

    def update(self, update_comment: ModelComment, update_mask: FieldMask,
               handler_context: HandlerContext) -> ModelComment:
        # Value of update_count.upvote_count is 1 if upvote event is emitted.
        # Using 1 rather than precomputed count from client side to avoid race condition
        #   where multiple upvote event is emiited at the same time.
        # Remove `upvote_count` from update_mask here and handle the count update
        #   explicitly later.
        sanitized_update_mask = FieldMask(
            set(update_mask.paths) - {'upvote_count'})
        comment = merge_resource(base_resource=ModelComment.from_name(update_comment.name),
                                 update_request=update_comment,
                                 field_mask=sanitized_update_mask)
        user_id = handler_context.user.user_id

        if update_mask.has('upvote_count'):
            try:
                activity = Activity.from_detail(
                    user_id=user_id, action=Action.UPVOTE, resource_name=comment.name)
            except NotFound as err:
                Activity(activity_id=0, user_id=user_id,
                         create_time=get_now(),
                         action=Action.UPVOTE, resource_name=comment.name).create()
                comment.upvote_count += 1
            else:
                # upvote from the same user will result as cancelling previous upvote
                activity.delete()
                comment.upvote_count -= 1

        comment.update(actor_info=user_id)
        return comment

    def delete(self, name: str, handler_context: HandlerContext) -> ModelComment:
        comment = ModelComment.from_name(name)
        parent = find_resource(ResourceName.from_str(name).parent)
        replies = ModelReply.list(ListOptions(parent=name))[0]
        if isinstance(parent, ModelThread):
            thread = parent
            thread.comment_count -= 1
            thread.reply_count -= len(replies)
            thread.update(update_update_time=False)
        comment.delete(actor_info=handler_context.user.user_id)
        return comment
