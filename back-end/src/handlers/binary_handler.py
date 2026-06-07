import logging
import os
import uuid
from typing import Iterable, List, Tuple

from app.handler_context import HandlerContext
from core.models.base import (MAX_PAGE_SIZE, FieldMask, HandlerBase,
                                ListOptions, merge_resource)
from models.model_binary import File, ModelBinary
from models.model_user import ModelUser
from models.plugins.tracklifecycle import ModelActivity
from app.protos import san11_platform_pb2 as pb
from repositories.resource_repository import repository_for
from integrations.files.file_server import (PACKAGE_SIZE_LIMIT, BucketClass,
                                      FileServerType, get_file_server)
from core.resources.name_util import ResourceName, get_parent
from integrations.notifications.notifier import notify_on_creation
from core.resources.resource_parser import find_resource

from core.errors.exceptions import InvalidArgument, ResourceExhausted, Unimplemented
from models.model_package import ModelPackage
from integrations.stats.statistic import Statistic
from core.size_util import human_readable
from core.time_util import get_now

logger = logging.getLogger(os.path.basename(__file__))


def generate_binary_canonical_uri(parent: str, binary: ModelBinary):
    return f'{parent}/binaries/{binary.version}-{uuid.uuid1()}{binary.file.ext}'


class BinaryHandler(HandlerBase):
    def __init__(self, binary_repository=None, package_repository=None,
                 activity_repository=None):
        self.binary_repository = binary_repository or repository_for(ModelBinary)
        self.package_repository = package_repository or repository_for(ModelPackage)
        self.activity_repository = activity_repository or repository_for(ModelActivity)

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
        self.binary_repository.create(
            parent=parent, resource=binary, actor_info=handler_context.authenticated_user.user_id)
        # Post creation
        notify_on_creation(binary)
        # Update the `update_time` in package.
        parent_resource = find_resource(parent)
        repository_for(type(parent_resource)).update(parent_resource)
        return binary

    def update(self, update_binary: ModelBinary, update_mask: FieldMask, handler_context: HandlerContext) -> ModelBinary:
        base_binary = self.binary_repository.get(update_binary.name)
        if update_mask.has('file') and update_binary.file is None:
            base_binary.remove_resource()
        binary = merge_resource(base_resource=base_binary,
                                update_request=update_binary,
                                field_mask=update_mask)
        return self.binary_repository.update(
            binary, actor_info=handler_context.authenticated_user.user_id)

    def list_binaries(self, request, handler_context) -> Tuple[List[ModelBinary], str]:
        list_options = ListOptions.from_request(request)
        return self.binary_repository.list(list_options)

    def delete(self, name: str, handler_context: HandlerContext) -> ModelBinary:
        binary = self.binary_repository.get(name)

        return self.binary_repository.delete(
            binary, actor_info=handler_context.authenticated_user.user_id)

    def download_binary(self, binary: ModelBinary, handler_context) -> ModelBinary:
        # website statistic
        Statistic.load_today().increment_download()  # Package statistic
        package = self.package_repository.get(get_parent(binary.name))
        package.download_count += 1
        self.package_repository.update(package, update_update_time=False)
        try:
            self.activity_repository.create(
                parent=f'users/{handler_context.authenticated_user.user_id}',
                resource=ModelActivity(
                name='', create_time=get_now(),
                action=pb.Action.DOWNLOAD, resource_name=binary.name
                ))
        except Exception:
            pass

        binary.download_count += 1
        self.binary_repository.update(binary)
        if binary.file:
            # Populate url for download.
            file = binary.file
            filename = f'{package.package_name}-{binary.version}{file.ext}'
            binary.file.url = get_file_server(
                FileServerType(file.server)).get_url(BucketClass.REGULAR, file.uri, filename)
        return binary
