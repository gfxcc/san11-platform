import os, sys, logging, time, re
import grpc

from typing import List
from concurrent import futures

from handler.protos import san11_platform_pb2_grpc
from handler import PackageHandler, BinaryHandler, ImageHandler, \
                    CommentHandler, ReplyHandler, UserHandler, \
                    ActivityHandler, GeneralHandler, TagHandler, \
                    AdminHandler, ArticleHandler


logger = logging.getLogger(os.path.basename(__file__))


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

    # binaries
    def CreateBinary(self, request, context):
        return self.binary_handler.create_binary(request, context)
    
    def UpdateBinary(self, request, context):
        return self.binary_handler.update_binary(request, context)

    def GetBinary(self, request, context):
        return self.binary_handler.get_binary(request, context)

    def ListBinaries(self, request, context):
        return self.binary_handler.list_binaries(request, context)

    def DeleteBinary(self, request, context):
        return self.binary_handler.delete_binary(request, context)
    
    def DownloadBinary(self, request, context):
        return self.binary_handler.download_binary(request, context)

    # image
    def CreateImage(self, request, context):
        return self.image_handler.create_image(request, context)

    # Comments
    def CreateComment(self, request, context):
        return self.comment_handler.create_comment(request, context)

    def UpdateComment(self, request, context):
        return self.comment_handler.update_comment(request, context)

    def ListComments(self, request, context):
        return self.comment_handler.list_comments(request, context)

    def DeleteComment(self, request, context):
        return self.comment_handler.delete_comment(request, context)

    def CreateReply(self, request, context):
        return self.reply_handler.create_reply(request, context)

    def UpdateReply(self, request, context):
        return self.reply_handler.update_reply(request, context)

    def DeleteReply(self, request, context):
        return self.reply_handler.delete_reply(request, context)

    # Article
    def CreateArticle(self, request, context):
        return self.article_handler.create_article(request, context)
    
    def GetArticle(self, request, context):
        return self.article_handler.get_article(request, context)
    
    def ListArticle(self, request, context):
        return self.article_handler.list_article(request, context)
    
    def UpdateArticle(self, request, context):
        return self.article_handler.update_article(request, context)
    
    def DeleteArticle(self, request, context):
        return self.article_handler.delete_article(request, context)

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


def init_log():
    FORMAT = '%(asctime)-15s %(levelname)s %(name)s %(message)s'
    logging.basicConfig(level=logging.NOTSET, format=FORMAT)


if __name__ == '__main__':
    init_log()
    serve()
