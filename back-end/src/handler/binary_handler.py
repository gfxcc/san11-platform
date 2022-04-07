import logging
import os
import uuid
from typing import Iterable, List, Tuple

from handler.handler_context import HandlerContext
from handler.model.base import FieldMask, HandlerBase, merge_resource
from handler.model.base.base_db import ListOptions
from handler.model.model_binary import File, ModelBinary
from handler.model.model_subscription import ModelSubscription
from handler.model.model_user import ModelUser
from handler.protos import san11_platform_pb2 as pb
from handler.util.name_util import ResourceName
from handler.util.notifier import notify
from util.file_server import PACKAGE_SIZE_LIMIT, S3, Gcs

from .common.exception import InvalidArgument, ResourceExhausted, Unimplemented
from .model.model_activity import ModelActivity
from .model.model_package import ModelPackage
from .model.statistic import Statistic
from .util import gcs
from .util.size_util import human_readable
from .util.time_util import get_now

logger = logging.getLogger(os.path.basename(__file__))


def generate_binary_canonical_uri(parent: str, binary: ModelBinary):
    return f'{parent}/binaries/{binary.version}-{uuid.uuid1()}{binary.file.ext}'


class BinaryHandler(HandlerBase):
    def create(self, parent: str, binary: ModelBinary, handler_context: HandlerContext) -> ModelBinary:
        if binary.file:
            file_server = Gcs() if binary.file.server == 1 else S3()
            file: File = binary.file

            if file_server.get_file_size(file_server.temp_bucket, file.filename) + file_server.get_folder_size(file_server.resource_bucket, parent) > PACKAGE_SIZE_LIMIT:
                file_server.delete_file(file_server.temp_bucket, file.filename)
                raise ResourceExhausted(
                    message=f'工具存储空间 {gcs.PACKAGE_LIMIT_GB}GB 已用完，请考虑删除历史版本.')

            binary.size = human_readable(
                precision=2, byte=file_server.get_file_size(file_server.temp_bucket, file.uri))
            canonical_uri = generate_binary_canonical_uri(parent, binary)
            # move resource from tmp location to canonical bucket
            file_server.move_file(file_server.temp_bucket, file.uri,
                                  file_server.resource_bucket, canonical_uri)
            file.uri = canonical_uri
        elif binary.download_method:
            raise Unimplemented()
        else:
            raise InvalidArgument(
                'Either `file` or `download_method` has be specified.')
        binary.create(parent=parent, user_id=handler_context.user.user_id)
        # Post creation
        # notify all subscribers
        author = ModelUser.from_name(f'users/{handler_context.user.user_id}')
        package = ModelPackage.from_name(parent)
        for sub in ModelSubscription.list(ListOptions(parent=author.name))[0]:
            notify(
                sender_id=author.user_id,
                receiver_id=sub.subscriber_id,
                content=f'【新版本】{author.username} 更新了 {package.package_name} {binary.version}',
                link=package.name,
                image_preview=package.image_urls[0] if package.image_urls else '',
            )
        return binary

    def update(self, update_binary: ModelBinary, update_mask: FieldMask, handler_context: HandlerContext) -> ModelBinary:
        base_binary = ModelBinary.from_name(update_binary.name)
        if update_mask.has('file') and update_binary.file is None:
            base_binary.remove_resource()
        binary = merge_resource(base_resource=base_binary,
                                update_request=update_binary,
                                field_mask=update_mask)
        binary.update(user_id=handler_context.user.user_id)
        return binary

    def list_binaries(self, request, handler_context) -> Tuple[List[ModelBinary], str]:
        list_options = ListOptions.from_request(request)
        return ModelBinary.list(list_options)

    def delete(self, name: str, handler_context) -> ModelBinary:
        binary = ModelBinary.from_name(name)
        binary.delete(user_id=handler_context.user.user_id)
        return binary

    def download_binary(self, binary: ModelBinary, handler_context) -> ModelBinary:
        binary.download_count += 1
        binary.update()
        # website statistic
        Statistic.load_today().increment_download()
        # Package statistic
        package = ModelPackage.from_name(str(ResourceName.from_str(
            binary.name).parent))
        package.download_count += 1
        package.update(update_update_time=False)
        try:
            ModelActivity(
                name='', create_time=get_now(),
                action=pb.Action.DOWNLOAD, resource_name=binary.name
            ).create(parent=f'users/{handler_context.user.user_id}')
        except Exception:
            pass
        return binary
