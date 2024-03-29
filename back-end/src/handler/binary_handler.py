import logging
import os
import uuid
from typing import Iterable, List, Tuple

from handler.handler_context import HandlerContext
from handler.model.base import (MAX_PAGE_SIZE, FieldMask, HandlerBase,
                                ListOptions, merge_resource)
from handler.model.model_binary import File, ModelBinary
from handler.model.model_user import ModelUser
from handler.model.plugins.tracklifecycle import ModelActivity
from handler.protos import san11_platform_pb2 as pb
from handler.util.file_server import (PACKAGE_SIZE_LIMIT, BucketClass,
                                      FileServerType, get_file_server)
from handler.util.name_util import ResourceName, get_parent
from handler.util.notifier import notify_on_creation
from handler.util.resource_parser import find_resource

from .common.exception import InvalidArgument, ResourceExhausted, Unimplemented
from .model.model_package import ModelPackage
from .model.statistic import Statistic
from .util.size_util import human_readable
from .util.time_util import get_now

logger = logging.getLogger(os.path.basename(__file__))


def generate_binary_canonical_uri(parent: str, binary: ModelBinary):
    return f'{parent}/binaries/{binary.version}-{uuid.uuid1()}{binary.file.ext}'


class BinaryHandler(HandlerBase):
    def create(self, parent: str, binary: ModelBinary, handler_context: HandlerContext) -> ModelBinary:
        if binary.file:
            file_server = get_file_server(FileServerType(binary.file.server))
            file: File = binary.file

            if file_server.get_file_size(BucketClass.TEMP, file.uri) + file_server.get_folder_size(BucketClass.REGULAR, parent) > PACKAGE_SIZE_LIMIT:
                file_server.delete_file(BucketClass.TEMP, file.uri)
                raise ResourceExhausted(
                    message=f'工具存储空间 {PACKAGE_SIZE_LIMIT/1024/1024/1024}GB 已用完，请考虑删除历史版本.')

            binary.size = human_readable(
                precision=2, byte=file_server.get_file_size(BucketClass.TEMP, file.uri))
            canonical_uri = generate_binary_canonical_uri(parent, binary)
            # move resource from tmp location to canonical bucket
            file_server.move_file(BucketClass.TEMP, file.uri,
                                  BucketClass.REGULAR, canonical_uri)
            file.uri = canonical_uri
        elif binary.cloud_disk_file:
            ...
        elif binary.download_method:
            raise Unimplemented()
        else:
            raise InvalidArgument(
                'Either `file` or `download_method` has be specified.')
        binary.create(parent=parent, actor_info=handler_context.user.user_id)
        # Post creation
        notify_on_creation(binary)
        # Update the `update_time` in package.
        find_resource(parent).update()
        return binary

    def update(self, update_binary: ModelBinary, update_mask: FieldMask, handler_context: HandlerContext) -> ModelBinary:
        base_binary = ModelBinary.from_name(update_binary.name)
        if update_mask.has('file') and update_binary.file is None:
            base_binary.remove_resource()
        binary = merge_resource(base_resource=base_binary,
                                update_request=update_binary,
                                field_mask=update_mask)
        binary.update(actor_info=handler_context.user.user_id)
        return binary

    def list_binaries(self, request, handler_context) -> Tuple[List[ModelBinary], str]:
        list_options = ListOptions.from_request(request)
        return ModelBinary.list(list_options)

    def delete(self, name: str, handler_context: HandlerContext) -> ModelBinary:
        binary = ModelBinary.from_name(name)

        binary.delete(actor_info=handler_context.user.user_id)
        return binary

    def download_binary(self, binary: ModelBinary, handler_context) -> ModelBinary:
        # website statistic
        Statistic.load_today().increment_download()  # Package statistic
        package = ModelPackage.from_name(get_parent(binary.name))
        package.download_count += 1
        package.update(update_update_time=False)
        try:
            ModelActivity(
                name='', create_time=get_now(),
                action=pb.Action.DOWNLOAD, resource_name=binary.name
            ).create(parent=f'users/{handler_context.user.user_id}')
        except Exception:
            pass

        binary.download_count += 1
        binary.update()
        if binary.file:
            # Populate url for download.
            file = binary.file
            filename = f'{package.package_name}-{binary.version}{file.ext}'
            binary.file.url = get_file_server(
                FileServerType(file.server)).get_url(BucketClass.REGULAR, file.uri, filename)
        return binary
