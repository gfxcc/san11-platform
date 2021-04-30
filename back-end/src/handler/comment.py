import sys, os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging


from lib.protos import san11_platform_pb2
from lib.url import Url
from lib.auths import Authenticator
from lib.user import User, Activity, Action
from lib.comment import Comment
from lib.exception import Unauthenticated


logger = logging.getLogger(os.path.basename(__file__))


class CommentHandler:
    def create_comment(self, request, context):
        logger.info('In CreateComment')
        authenticator = Authenticator.from_context(context)
        logger.debug(
            f'{request.comment.author_id} =? {authenticator.session.user.user_id}')
        assert request.comment.author_id == authenticator.session.user.user_id

        comment = Comment.from_pb(request.comment)
        comment.create()

        return comment.to_pb()
    
    def delete_comment(self, request, context):
        logger.info(f'In DeleteComment: comment_id={request.comment_id}')
        comment = Comment.from_id(request.comment_id)
        authenticator = Authenticator.from_context(context)
        if not authenticator.canDeleteComment(comment):
            context.abort(code=255, details='权限不足')
        comment.delete()
        return san11_platform_pb2.Empty()

    def update_comment(self, request, context):
        logger.info(
            f'In UpdateComment: comment_id={request.comment.comment_id}')
        comment = Comment.from_id(request.comment.comment_id)
        try:
            authenticator = Authenticator.from_context(context)
        except Unauthenticated as err:
            context.abort(code=err.code, details=str(err))
        if not authenticator.canUpdateComment(current=comment, requested=request.comment):
            context.abort(code=255, details='权限不足')

        if request.comment.upvote_count:
            resource = f'comment_id:{comment.comment_id}'
            activity = Activity(
                authenticator.session.user.user_id, resource, Action.UPVOTE)
            if activity.isExist():
                # upvote from the same user will result as cancelling previous upvote
                activity.delete()
                comment.upvote_count -= 1
            else:
                # upvote_count from user may stale
                activity.create()
                comment.upvote_count += 1

        comment.update()
        return comment.to_pb()
    
    def list_comments(self, request, context):
        logger.info(f'In ListComments: parent={request.parent}')
        comments = Comment.list_comment(request.parent)
        return san11_platform_pb2.ListCommentsResponse(
            comments=[comment.to_pb() for comment in comments]
        )
