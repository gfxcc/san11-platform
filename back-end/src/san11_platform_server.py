from __future__ import annotations

import argparse
import logging
import os
from concurrent import futures
from typing import Optional

import attr
import grpc

import iam_util
from handler.activity_handler import ActivityHandler
from handler.admin_handler import AdminHandler
from handler.article_handler import ArticleHandler
from handler.auths import Session
from handler.binary_handler import BinaryHandler
from handler.comment_handler import CommentHandler
from handler.common.exception import *
from handler.common.field_mask import FieldMask
from handler.general_handler import GeneralHandler
from handler.image_handler import ImageHandler
from handler.model.model_article import ModelArticle
from handler.model.model_binary import ModelBinary
from handler.model.model_comment import ModelComment
from handler.model.model_notification import ModelNotification
from handler.model.model_package import ModelPackage
from handler.model.model_reply import ModelReply
from handler.model.model_tag import ModelTag
from handler.model.model_thread import ModelThread
from handler.model.model_user import ModelUser
from handler.model.user import User, verify_code
from handler.notification_handler import NotificationHandler
from handler.package_handler import PackageHandler
from handler.protos import san11_platform_pb2 as pb
from handler.protos import san11_platform_pb2_grpc
from handler.reply_handler import ReplyHandler
from handler.tag_handler import TagHandler
from handler.thread_handler import ThreadHandler
from handler.user_handler import UserHandler
from handler.util.name_util import ResourceName
from handler.util.resource_parser import find_resource

logger = logging.getLogger(os.path.basename(__file__))


@attr.s(auto_attribs=True)
class HandlerContext:
    user: Optional[User]
    service_context: grpc.ServicerContext

    @classmethod
    def from_service_context(cls, service_context: grpc.ServicerContext) -> HandlerContext:
        '''
        Constructs a HandlerContext. A valid session is not required.
        '''
        session = None
        sid = dict(service_context.invocation_metadata()).get('sid', None)
        if not sid:
            return cls(user=None, service_context=None)
        try:
            session = Session.from_sid(sid)
        except Unauthenticated:
            return cls(user=None, service_context=None)
        else:
            return cls(user=session.user, service_context=service_context)


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
    @iam_util.assert_resource_owner('{parent}')
    def CreateBinary(self, request, context):
        parent, binary = request.parent, ModelBinary.from_pb(request.binary)
        package = ModelPackage.from_name(parent)
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
        package = ModelPackage.from_name(
            str(ResourceName.from_str(binary.name).parent))
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user.user_id == package.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.binary_handler.update_binary(binary, update_mask, handler_context).to_pb()

    def DeleteBinary(self, request, context):
        binary = ModelBinary.from_name(request.name)
        package = ModelPackage.from_name(
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

    # Tags
    @iam_util.assert_admin
    def CreateTag(self, request, context):
        parent, tag = request.parent, ModelTag.from_pb(request.tag)
        handler_context = HandlerContext.from_service_context(context)
        created_tag = self.tag_handler.create_tag(
            parent, tag, handler_context)
        return created_tag.to_pb()

    @iam_util.assert_admin
    def DeleteTag(self, request, context):
        tag = ModelTag.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.tag_handler.delete_tag(tag, handler_context).to_pb()

    def ListTags(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        tags, next_page_token = self.tag_handler.list_tags(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListTagsResponse(
            tags=[tag.to_pb() for tag in tags],
            next_page_token=next_page_token,
        )

    # package
    @iam_util.assert_login
    def CreatePackage(self, request, context):
        parent, package = request.parent, ModelPackage.from_pb(request.package)
        handler_context = HandlerContext.from_service_context(context)
        created_package = self.package_handler.create_package(
            parent, package, handler_context)
        return created_package.to_pb()

    def GetPackage(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        return self.package_handler.get_package(request.name, handler_context).to_pb()

    def ListPackages(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        packages, next_page_token = self.package_handler.list_packages(
            request=request,
            handler_context=handler_context,
        )
        ret = pb.ListPackagesResponse(
            packages=[package.to_pb() for package in packages],
            next_page_token=next_page_token,
        )
        return ret

    @iam_util.assert_resource_owner('{package.name}')
    def UpdatePackage(self, request, context):
        update_package, update_mask = ModelPackage.from_pb(request.package), \
            FieldMask.from_pb(request.update_mask)
        package = ModelPackage.from_name(request.package.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.package_handler.update_package(package, update_package, update_mask, handler_context).to_pb()

    @iam_util.assert_admin
    def DeletePackage(self, request, context):
        package = ModelPackage.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.package_handler.delete_package(package, handler_context).to_pb()

    def SearchPackages(self, request, context):
        return self.package_handler.search_packages(request, context)

    # activities
    def ListActivities(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        activities, next_page_token = self.activity_handler.list_activities(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListActivitiesResponse(
            activities=list(activities),
            next_page_token=next_page_token,
        )

    # users
    def CreateUser(self, request, context):
        parent, user, = request.parent, ModelUser.from_pb(request.user)
        handler_context = HandlerContext.from_service_context(context)
        if not verify_code(user.email, request.verification_code):
            context.abort(code=Unauthenticated().code,
                          message='邮箱未经验证')
        created_user, session = self.thread_handler.create_thread(
            parent, user, handler_context)
        return pb.CreateUserResponse(
            user=created_user.to_pb(),
            sid=session.sid,
        )

    def GetUser(self, request, context):
        return self.user_handler.get_user(request.name, context).to_pb()

    def ListUsers(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        users, next_page_token = self.user_handler.list_users(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListUsersResponse(
            users=[user.to_pb() for user in users],
            next_page_token=next_page_token,
        )

    @iam_util.assert_user('user.user_id')
    def UpdateUser(self, request, context):
        update_user, update_mask = ModelUser.from_pb(request.user), \
            FieldMask.from_pb(request.update_mask)
        # `password` has to be updated via API `UpdatePassword`
        update_mask.paths -= set('password')
        user = ModelUser.from_name(request.user.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.user_handler.update_user(user, update_user, update_mask, handler_context).to_pb()

    def SignIn(self, request, context):
        user, password = ModelUser.from_pb(request.user), request.password
        handler_context = HandlerContext.from_service_context(context)
        user, sid = self.user_handler.sign_in(user, password, handler_context)
        return pb.SignInResponse(
            user=user.to_pb(),
            sid=sid,
        )

    def SignOut(self, request, context):
        # (TODO)
        return pb.Status(code=0, message='登出成功')

    def UpdatePassword(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        user = ModelUser.from_name(request.user.name)
        update_user = ModelUser.from_name(user.name)
        # User may update password on following scenarios
        # 1. Update password while loged in.
        # 2. Fetch verification_code when password is forgot.
        if request.verification_code:
            if not verify_code(user.email, request.verification_code):
                context.abort(code=PermissionDenied().code, details='验证码不正确')
        else:
            try:
                current_user = iam_util.load_user(context)
            except Unauthenticated as e:
                context.abort(code=e.code, details=str(e))
            if current_user.user_id != user.user_id:
                context.abort(code=Unauthenticated().code,
                              details=Unauthenticated().message)
        update_user.password = password
        update_mask = FieldMask({'password'})
        return self.user_handler.update_user(user, update_user, update_mask,
                                             handler_context).to_pb()

    def SendVerificationCode(self, request, context):
        self.user_handler.send_verification_code(request.email, context)
        return pb.Empty

    def VerifyEmail(self, request, context):
        return self.user_handler.verify_email(request, context)

    def VerifyNewUser(self, request, context):
        return self.user_handler.verify_new_user(request, context)

    #############
    # Old model #
    #############

    # image

    @iam_util.assert_resource_owner('{parent}')
    def CreateImage(self, request, context):
        return self.image_handler.create_image(request, context)

    # general
    def GetStatistic(self, request, context):
        return self.general_handler.get_statistic(request, context)

    def GetAdminMessage(self, request, context):
        return self.admin_handler.get_admin_message(request, context)


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
    FORMAT = '%(asctime)-15s %(levelname)s %(name)s:%(lineno)s [func=%(funcName)s] %(message)s'
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
