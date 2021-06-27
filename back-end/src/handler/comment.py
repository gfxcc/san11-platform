from lib.time_util import get_now
from lib.exception import Unauthenticated, NotFound
from lib.comment import Comment
from lib.user import User
from lib.activity import Activity, Action
from lib.auths import Authenticator
from lib.url import Url
from lib.protos import san11_platform_pb2
from datetime import datetime
import logging
import sys
import os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))


logger = logging.getLogger(os.path.basename(__file__))


class CommentHandler:
    def create_comment(self, request, context):
        logger.info('In CreateComment')
        auth = Authenticator.from_context(context)
        assert request.comment.author_id == auth.session.user.user_id

        comment = Comment.from_pb(request.comment)
        comment.create(user_id=auth.session.user.user_id)

        return comment.to_pb()

    def delete_comment(self, request, context):
        logger.info(f'In DeleteComment: comment_id={request.comment_id}')
        comment = Comment.from_id(request.comment_id)
        auth = Authenticator.from_context(context)
        if not auth.canDeleteComment(comment):
            context.abort(code=255, details='权限不足')
        comment.delete(user_id=auth.session.user.user_id)
        return san11_platform_pb2.Empty()

    def update_comment(self, request, context):
        logger.info(
            f'In UpdateComment: comment_id={request.comment.comment_id}')
        comment = Comment.from_id(request.comment.comment_id)
        try:
            auth = Authenticator.from_context(context)
        except Unauthenticated as err:
            context.abort(code=err.code, details=str(err))
        if not auth.canUpdateComment(current=comment, requested=request.comment):
            context.abort(code=255, details='权限不足')

        if request.comment.upvote_count:
            try:
                activity = Activity.from_detail(
                    user_id=auth.session.user.user_id, action=Action.UPVOTE, resource_name=comment.name)
            except NotFound as err:
                Activity(activity_id=0, user_id=auth.session.user.user_id,
                         create_time=get_now(),
                         action=Action.UPVOTE, resource_name=comment.name).create()
                comment.upvote_count += 1
            else:
                # upvote from the same user will result as cancelling previous upvote
                activity.delete()
                comment.upvote_count -= 1

        comment.update(user_id=auth.session.user.user_id, track=False)
        return comment.to_pb()

    def list_comments(self, request, context):
        logger.info(f'In ListComments: parent={request.parent}')
        comments = Comment.list(0, '', parent=request.parent)
        return san11_platform_pb2.ListCommentsResponse(
            comments=[comment.to_pb() for comment in comments]
        )
