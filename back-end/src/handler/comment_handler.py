import logging
import os
from typing import Iterable, Tuple

from src.handler.util.notifier import send_message

from handler.common.field_mask import FieldMask, merge_resource
from handler.model.base.base_db import ListOptions
from handler.model.model_comment import ModelComment
from handler.model.model_thread import ModelThread
from handler.util.resource_parser import ResourceName, find_resource

from .common.exception import NotFound
from .model.activity import Action, Activity
from .util.time_util import get_now

logger = logging.getLogger(os.path.basename(__file__))


class CommentHandler:
    def create_comment(self, parent: str, comment: ModelComment,
                       handler_context) -> ModelComment:
        user_id = handler_context.user.user_id
        comment.author_id = user_id
        parent_obj = find_resource(parent)
        if isinstance(parent_obj, ModelThread):
            thread = parent_obj
            thread.comment_count += 1
            thread.latest_commented_time = comment.create_time
            thread.latest_commenter_id = user_id
            thread.update(update_update_time=False)
            comment.index = thread.comment_count
        comment.create(parent=parent, user_id=user_id)

        # Send notification
        if isinstance(parent_obj, ModelThread):
            thread = parent_obj
            send_message(
                sender_id=user_id,
                receiver_id=thread.author_id,
                content='{User.from_id(user_id).username} 评论了 {thread.subject}',
                link=thread.name,
                image_preview='',
            )
        return comment

    def update_comment(self, base_comment: ModelComment, update_comment: ModelComment, update_mask: FieldMask,
                       handler_context) -> ModelComment:
        # Value of update_count.upvote_count is 1 if upvote event is emitted.
        # Using 1 rather than precomputed count from client side to avoid race condition
        #   where multiple upvote event is emiited at the same time.
        # Remove `upvote_count` from update_mask here and handle the count update
        #   explicitly later.
        sanitized_update_mask = FieldMask(
            set(update_mask.paths) - {'upvote_count'})
        comment = merge_resource(base_resource=base_comment,
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

        comment.update(user_id=user_id)
        return comment

    def list_comments(self, request,
                      handler_context) -> Tuple[Iterable[ModelComment], str]:
        list_options = ListOptions.from_request(request)
        return ModelComment.list(list_options=list_options)

    def delete_comment(self, comment: ModelComment,
                       handler_context) -> ModelComment:
        parent = find_resource(ResourceName.from_str(comment.name).parent)
        if isinstance(parent, ModelThread):
            thread = parent
            thread.comment_count -= 1
            thread.reply_count -= len(replies)
            thread.update(update_update_time=False)
        comment.delete(user_id=handler_context.user.user_id)
        return comment
