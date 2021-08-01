from handler.model.reply import Reply
from handler.model.model_reply import ModelReply
from handler.common.field_mask import FieldMask, merge_resource
from typing import Iterable, Optional, Tuple
from handler.model.model_comment import ModelComment
import logging
import sys
import os

from .util.time_util import get_now
from .common.exception import Unauthenticated, NotFound
from .common.api import parse_filter
from .model.comment import Comment
from .model.user import User
from .model.activity import Activity, Action
from .auths import Authenticator
from .protos import san11_platform_pb2
from datetime import datetime


logger = logging.getLogger(os.path.basename(__file__))


class CommentHandler:
    def create_comment(self, parent: str, comment: ModelComment,
                       handler_context) -> ModelComment:
        user_id = handler_context.user.user_id
        comment.author_id = user_id
        comment.create(parent=parent, user_id=user_id)
        return comment

    def update_comment(self, comment: ModelComment, update_mask: FieldMask,
                       handler_context) -> ModelComment:
        base_comment = ModelComment.from_name(comment.name)
        comment = merge_resource(base_resource=base_comment,
                                 update_request=comment,
                                 field_mask=update_mask)
        comment.upvote_count = base_comment.upvote_count
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

    def list_comments(self, parent: str, page_size: int, page_token: str,
                      sort_by: Optional[str], filter: Optional[str],
                      handler_context) -> Tuple[Iterable[ModelComment], str]:
        # TODO: remove backfill logic
        for reply in Reply.list(0, ''):
            model = ModelReply.from_legacy(reply)
            if not model.is_exist():
                model.create(parent=reply.parent, resource_id=reply.id)

        for comment in Comment.list(0, ''):
            model = ModelComment.from_legacy(comment)
            if not model.is_exist():
                model.create(parent=comment.parent, resource_id=comment.id)
        # TODO: END

        list_kwargs = {}
        if filter:
            list_kwargs = parse_filter(ModelComment, filter)

        return ModelComment.list(parent=parent, order_by_field='create_time', **list_kwargs), ''

    def delete_comment(self, comment: ModelComment,
                       handler_context) -> ModelComment:
        for reply in ModelReply.list(parent=comment.name):
            reply.delete()
        comment.delete(user_id=handler_context.user.user_id)
        return comment
