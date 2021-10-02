import logging
import os
import re

from handler.model.base.base_db import ListOptions
from handler.model.model_binary import ModelBinary
from handler.model.model_comment import ModelComment
from handler.model.model_reply import ModelReply
from handler.model.model_thread import ModelThread

from .auths import Authenticator
from .common.exception import PermissionDenied
from .common.field_mask import FieldMask, merge_resource
from .common.image import Image
from .model.package import Package, Status
from .model.user import User
from .protos import san11_platform_pb2
from .util.notifier import Notifier

logger = logging.getLogger(os.path.basename(__file__))


class PackageHandler:
    def create_package(self, request, context):
        auth = Authenticator.from_context(context)
        package = Package.from_pb(request.package)
        user = auth.session.user
        package.author_id = user.user_id
        package.create(user_id=user.user_id)
        try:
            notifer = Notifier()
            for admin in User.list(0, '', user_type='admin'):
                notifer.send_email(
                    admin.email, '新工具待审核', f'[{package.package_name}] 已被 {user.username} 创建。请审核。')
        except Exception as err:
            logger.error(f'Failed to notify admin: {err}')
        return package.to_pb()

    def delete_package(self, request, context):
        package = Package.from_id(request.package.package_id)

        auth = Authenticator.from_context(context)
        if not auth.canDeletePackage(package):
            context.abort(code=PermissionDenied().code,
                          details=PermissionDenied().message)

        for image_url in package.image_urls:
            try:
                Image.from_url(image_url).delete()
            except Exception:
                logger.error(f'Failed to delete image: image_url={image_url}')

        for binary in ModelBinary.list(ListOptions(parent=package.name))[0]:
            try:
                binary.delete(user_id=auth.session.user.user_id)
            except Exception as err:
                logger.error(
                    f'Failed to delete binary: binary={binary} err={err}')

        for comment in ModelComment.list(ListOptions(parent=package.name))[0]:
            try:
                comment.delete(user_id=auth.session.user.user_id)
            except Exception as err:
                logger.error(f'Failed to delete {comment} under {self}: {err}')

        package.delete(user_id=auth.session.user.user_id)
        logger.info(f'Package is deleted: {package}')

        return san11_platform_pb2.Empty()

    def get_package(self, request, context):
        package = Package.from_id(request.package_id).to_pb()

        # TODO: remove backfill code for comment/reply migration
        def simplify_text(text: str) -> str:
            if match := re.match(r'<p>(?P<subject>.+)</p>', text):
                return match['subject']
            return text
        if not ModelThread.list(ListOptions(parent=package.name))[0]:
            for comment in ModelComment.list(ListOptions(parent=package.name))[0]:
                replies, _ = ModelReply.list(ListOptions(
                    parent=comment.name, order_by='create_time'))
                thread = ModelThread(
                    name='',
                    subject=simplify_text(comment.text),
                    content='RT',
                    author_id=comment.author_id,
                    state=san11_platform_pb2.ResourceState.NORMAL,
                    tags=[],
                    view_count=0,
                    like_count=0,
                    comment_count=len(replies),
                    reply_count=0,
                    latest_commented_time=replies[-1].create_time if replies else comment.create_time,
                    latest_commenter_id=replies[-1].author_id if replies else 0,
                    pinned=False,
                    create_time=comment.create_time,
                    update_time=comment.create_time,
                )
                thread.create(package.name)

                for i, reply in enumerate(replies):
                    new_comment = ModelComment(
                        name='',
                        author_id=reply.author_id,
                        text=reply.text,
                        create_time=reply.create_time,
                        update_time=reply.update_time,
                        upvote_count=reply.upvote_count,
                        index=i+1,
                    )
                    new_comment.create(thread.name)
        # TODO: END
        return package

    def list_packages(self, request, context):
        try:
            user = Authenticator.from_context(context=context).session.user
        except Exception:
            user = None

        return san11_platform_pb2.ListPackagesResponse(packages=[
            package.to_pb()
            for package in Package.list(0, '',
                                        category_id=request.category_id,
                                        author_id=request.author_id,
                                        tag_id=request.tag_id
                                        ) if package.status == Status.NORMAL or
            (user and user.user_id == package.author_id and package.status in [Status.UNDER_REVIEW, Status.HIDDEN]) or
            (user and user.user_type == 'admin')
            # package's status is normal or user is admin or author of the package
        ])

    def search_packages(self, request, context):
        return san11_platform_pb2.SearchPackagesResponse(
            packages=[package.to_pb() for package in Package.search(request.page_size,
                                                                    request.page_token,
                                                                    request.query)])

    def update_package(self, request, context):
        logger.debug(request.package.image_urls)
        base_package = Package.from_id(request.package.package_id)

        auth = Authenticator.from_context(context)
        if not auth.canUpdatePackage(base_package):
            context.abort(code=PermissionDenied().code,
                          details=PermissionDenied().message)

        # patch update_mask as Package store tag_ids internal while tags is used
        # for public protos
        update_mask = FieldMask.from_pb(request.update_mask)
        if 'tags' in update_mask.paths:
            update_mask.paths.remove('tags')
            update_mask.paths.add('tag_ids')
        package = merge_resource(base_resource=base_package,
                                 update_request=Package.from_pb(
                                     request.package),
                                 field_mask=update_mask)
        # Delete image resources
        for image_url_to_delete in set(base_package.image_urls) - set(package.image_urls):
            try:
                image = Image.from_url(image_url_to_delete)
                image.delete()
            except Exception as err:
                logger.error(f'Failed to delete {image_url_to_delete}: {err}')
        package.update(user_id=auth.session.user.user_id)
        return package.to_pb()
