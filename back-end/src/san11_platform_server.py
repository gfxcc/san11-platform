from __future__ import annotations

import argparse
import logging
import os
from concurrent import futures
from typing import Optional

import attr
import grpc

import iam_util
from handler import (ActivityHandler, AdminHandler, ArticleHandler,
                     BinaryHandler, CommentHandler, GeneralHandler,
                     ImageHandler, NotificationHandler, PackageHandler,
                     ReplyHandler, TagHandler, UserHandler)
from handler.auths import Session
from handler.common.exception import *
from handler.common.field_mask import FieldMask
from handler.model.model_article import ModelArticle
from handler.model.model_binary import ModelBinary
from handler.model.model_comment import ModelComment
from handler.model.model_notification import ModelNotification
from handler.model.model_reply import ModelReply
from handler.model.model_thread import ModelThread
from handler.model.package import Package
from handler.model.user import User
from handler.protos import san11_platform_pb2 as pb
from handler.protos import san11_platform_pb2_grpc
from handler.thread_handler import ThreadHandler
from handler.util.resource_parser import ResourceName, find_resource

logger = logging.getLogger(os.path.basename(__file__))


@attr.s(auto_attribs=True)
class HandlerContext:
    user: Optional[User]

    @classmethod
    def from_service_context(cls, service_context: grpc.ServicerContext) -> HandlerContext:
        '''
        Constructs a HandlerContext. A valid session is not required.
        '''
        session = None
        sid = dict(service_context.invocation_metadata()).get('sid', None)
        if not sid:
            return cls(user=None)
        try:
            session = Session.from_sid(sid)
        except Unauthenticated:
            return cls(user=None)
        else:
            return cls(user=session.user)


class RouteGuideServicer(san11_platform_pb2_grpc.RouteGuideServicer):
    def __init__(self):
        self.package_handler = PackageHandler()
        self.binary_handler = BinaryHandler()
        self.image_handler = ImageHandler()
        self.comment_handler = CommentHandler()
        self.reply_handler = ReplyHandler()
        self.user_handler = UserHandler()
        self.activity_handler = ActivityHandler()
        self.general_handler = GeneralHandler()
        self.tag_handler = TagHandler()
        self.admin_handler = AdminHandler()
        self.article_handler = ArticleHandler()
        self.thread_handler = ThreadHandler()
        self.notification_handler = NotificationHandler()
    #############
    # New model #
    #############
    # Article

    @iam_util.assert_login
    def CreateArticle(self, request, context):
        parent, article = request.parent, ModelArticle.from_pb(request.article)
        handler_context = HandlerContext.from_service_context(context)
        created_article = self.article_handler.create_article(
            parent, article, handler_context)
        return created_article.to_pb()

    def GetArticle(self, request, context):
        name = request.name
        handler_context = HandlerContext.from_service_context(context)
        return self.article_handler.get_article(name, handler_context).to_pb()

    def ListArticles(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        articles, next_page_token = self.article_handler.list_articles(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListArticlesResponse(
            articles=[article.to_pb() for article in articles],
            next_page_token=next_page_token,
        )

    @iam_util.assert_resource_owner('{article.name}')
    def UpdateArticle(self, request, context):
        update_article, update_mask = ModelArticle.from_pb(
            request.article), FieldMask.from_pb(request.update_mask)
        article = ModelArticle.from_name(request.article.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.article_handler.update_article(article, update_article, update_mask, handler_context).to_pb()

    @iam_util.assert_resource_owner('{name}')
    def DeleteArticle(self, request, context):
        article = ModelArticle.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.article_handler.delete_article(article, handler_context).to_pb()

    # binaries
    @iam_util.assert_login
    def CreateBinary(self, request, context):
        parent, binary = request.parent, ModelBinary.from_pb(request.binary)
        package = Package.from_name(parent)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user.user_id == package.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        created_binary = self.binary_handler.create_binary(
            parent, binary, handler_context)
        return created_binary.to_pb()

    def ListBinaries(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        binaries, next_page_token = self.binary_handler.list_binaries(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListBinariesResponse(
            binaries=[binary.to_pb() for binary in binaries],
            next_page_token=next_page_token,
        )

    @iam_util.assert_login
    def UpdateBinary(self, request, context):
        binary, update_mask = ModelBinary.from_pb(
            request.binary), FieldMask.from_pb(request.update_mask)
        package = Package.from_name(
            str(ResourceName.from_str(binary.name).parent))
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user.user_id == package.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.binary_handler.update_binary(binary, update_mask, handler_context).to_pb()

    @iam_util.assert_login
    def DeleteBinary(self, request, context):
        binary = ModelBinary.from_name(request.name)
        package = Package.from_name(
            str(ResourceName.from_str(binary.name).parent))
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user.user_id == package.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.binary_handler.delete_binary(binary, handler_context).to_pb()

    def DownloadBinary(self, request, context):
        binary = ModelBinary.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.binary_handler.download_binary(binary, handler_context).to_pb()

    # Comments
    @iam_util.assert_login
    def CreateComment(self, request, context):
        parent, comment = request.parent, ModelComment.from_pb(request.comment)
        handler_context = HandlerContext.from_service_context(context)
        created_comment = self.comment_handler.create_comment(
            parent, comment, handler_context)
        return created_comment.to_pb()

    def ListComments(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        comments, next_page_token = self.comment_handler.list_comments(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListCommentsResponse(
            comments=[comment.to_pb() for comment in comments],
            next_page_token=next_page_token,
        )

    @iam_util.assert_login
    def UpdateComment(self, request, context):
        update_comment, update_mask = ModelComment.from_pb(request.comment), \
            FieldMask.from_pb(request.update_mask)
        comment = ModelComment.from_name(request.comment.name)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user.user_id == comment.author_id or handler_context.user.user_type == 'admin' or update_mask.paths == {
            'upvote_count'}, '权限验证失败'
        return self.comment_handler.update_comment(comment, update_comment, update_mask, handler_context).to_pb()

    @iam_util.assert_resource_owner('{name}')
    def DeleteComment(self, request, context):
        comment = ModelComment.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.comment_handler.delete_comment(comment, handler_context).to_pb()

    # Reply
    @iam_util.assert_login
    def CreateReply(self, request, context):
        parent, reply = request.parent, ModelReply.from_pb(request.reply)
        handler_context = HandlerContext.from_service_context(context)
        created_reply = self.reply_handler.create_reply(
            parent, reply, handler_context)
        return created_reply.to_pb()

    @iam_util.assert_login
    def UpdateReply(self, request, context):
        update_reply, update_mask = ModelReply.from_pb(request.reply), \
            FieldMask.from_pb(request.update_mask)
        reply = ModelReply.from_name(request.reply.name)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user.user_id == reply.author_id or handler_context.user.user_type == 'admin' or update_mask.paths == {
            'upvote_count'}, '权限验证失败'
        return self.reply_handler.update_reply(reply, update_reply, update_mask, handler_context).to_pb()

    @iam_util.assert_resource_owner('{name}')
    def DeleteReply(self, request, context):
        reply = ModelReply.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.reply_handler.delete_reply(reply, handler_context).to_pb()

    # Thread
    @iam_util.assert_login
    def CreateThread(self, request, context):
        parent, thread = request.parent, ModelThread.from_pb(request.thread)
        handler_context = HandlerContext.from_service_context(context)
        created_thread = self.thread_handler.create_thread(
            parent, thread, handler_context)
        return created_thread.to_pb()

    def GetThread(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        return self.thread_handler.get_thread(request.name, handler_context).to_pb()

    def ListThreads(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        threads, next_page_token = self.thread_handler.list_threads(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListThreadsResponse(
            threads=[thread.to_pb() for thread in threads],
            next_page_token=next_page_token,
        )

    @iam_util.assert_resource_owner('{thread.name}')
    def UpdateThread(self, request, context):
        update_thread, update_mask = ModelThread.from_pb(request.thread), \
            FieldMask.from_pb(request.update_mask)
        thread = ModelThread.from_name(request.thread.name)
        handler_context = HandlerContext.from_service_context(context)
        if 'pinned' in update_mask.paths:
            if not handler_context.user or not (handler_context.user.is_admin() or find_resource(ResourceName.from_str(thread.name).parent).author_id == handler_context.user.user_id):
                context.abort(PermissionDenied().code,
                              PermissionDenied().message)
        return self.thread_handler.update_thread(thread, update_thread, update_mask, handler_context).to_pb()

    @iam_util.assert_resource_owner('{name}')
    def DeleteThread(self, request, context):
        thread = ModelThread.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.thread_handler.delete_thread(thread, handler_context).to_pb()

    # TODO: Only allow a user list notifications send to that user.
    def ListNotifications(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        notifications, next_page_token = self.notification_handler.list_notifications(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListNotificationsResponse(
            notifications=[notification.to_pb()
                           for notification in notifications],
            next_page_token=next_page_token,
        )

    # @iam_util.assert_resource_owner('{notification.name}.receiver_id')
    def UpdateNotification(self, request, context):
        source, update_mask = ModelNotification.from_pb(
            request.notification), request.update_mask
        dest = ModelNotification.from_name(request.notification.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.notification_handler.update_notification(source, dest, update_mask, handler_context).to_pb()

    #############
    # Old model #
    #############

    def CreatePackage(self, request, context):
        return self.package_handler.create_package(request, context)

    def UpdatePackage(self, request, context):
        return self.package_handler.update_package(request, context)

    def GetPackage(self, request, context):
        return self.package_handler.get_package(request, context)

    def ListPackages(self, request, context):
        return self.package_handler.list_packages(request, context)

    def DeletePackage(self, request, context):
        return self.package_handler.delete_package(request, context)

    def SearchPackages(self, request, context):
        return self.package_handler.search_packages(request, context)

    # image
    def CreateImage(self, request, context):
        return self.image_handler.create_image(request, context)

    # users
    def SignUp(self, request, context):
        return self.user_handler.sign_up(request, context)

    def SignIn(self, request, context):
        return self.user_handler.sign_in(request, context)

    def SignOut(self, request, context):
        return self.user_handler.sign_out(request, context)

    def UpdateUser(self, request, context):
        return self.user_handler.update_user(request, context)

    def UpdatePassword(self, request, context):
        return self.user_handler.update_password(request, context)

    def GetUser(self, request, context):
        return self.user_handler.get_user(request, context)

    def ListUsers(self, request, context):
        return self.user_handler.list_users(request, context)

    def SendVerificationCode(self, request, context):
        return self.user_handler.send_verification_code(request, context)

    def VerifyEmail(self, request, context):
        return self.user_handler.verify_email(request, context)

    def VerifyNewUser(self, request, context):
        return self.user_handler.verify_new_user(request, context)

    # activities
    def ListActivities(self, request, context):
        return self.activity_handler.list_activities(request, context)

    # general
    def GetStatistic(self, request, context):
        return self.general_handler.get_statistic(request, context)

    def GetAdminMessage(self, request, context):
        return self.admin_handler.get_admin_message(request, context)

    # Tags
    def CreateTag(self, request, context):
        return self.tag_handler.create_tag(request, context)

    def DeleteTag(self, request, context):
        return self.tag_handler.delete_tag(request, context)

    def ListTags(self, request, context):
        return self.tag_handler.list_tags(request, context)


def serve():
    options = [('grpc.max_receive_message_length', 30 * 1024 * 1024)]  # 30 MB
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10),
                         options=options)
    san11_platform_pb2_grpc.add_RouteGuideServicer_to_server(
        RouteGuideServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    logging.info('Server started...')
    server.wait_for_termination()


def init_log(verbose: bool):
    FORMAT = '%(asctime)-15s %(levelname)s %(name)s %(message)s'
    logging.basicConfig(
        level=logging.INFO if not verbose else logging.NOTSET, format=FORMAT)


def parse_args():
    parser = argparse.ArgumentParser(description='san11_platform main server')
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='verbose mode')
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = parse_args()
    init_log(args.verbose)
    serve()
