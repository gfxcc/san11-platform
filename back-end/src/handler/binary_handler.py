from typing import Iterable, Optional
from handler.util.resource_parser import ResourceName, parse_name
from handler.model.model_binary import File, ModelBinary
import logging
import sys
import os
import uuid


from .model.activity import Activity, Action
from .common.field_mask import FieldMask, merge_resource
from .util import gcs
from .util.size_util import human_readable
from .common.exception import InvalidArgument, PermissionDenied, ResourceExhausted, Unimplemented
from .model.statistic import Statistic
from .model.binary import Binary
from .model.package import Package
from .auths import Authenticator
from .common.url import Url
from .protos import san11_platform_pb2
from .util.time_util import get_now
from .common.api import parse_filter

logger = logging.getLogger(os.path.basename(__file__))


def check_per_package_size(target_location: str, tmp_file: str):
    '''
    Returns:
        True: if size of target_location will not exceed PACKAGE_LIMIT_GB after
            tmp_file be moved under target_location.
    '''
    assert tmp_file.startswith(
        target_location), f'tmp_file is not under target_location: tmp_file={tmp_file}, target_location={target_location}'
    binary_size = gcs.get_file_size(gcs.TMP_BUCKET, tmp_file)
    expected_disk_usage = binary_size + \
        gcs.disk_usage_under(target_location)
    if expected_disk_usage > gcs.PACKAGE_LIMIT_GB * 1024 * 1024 * 1024:
        return False
    return True


def generate_binary_canonical_uri(parent: str, binary: ModelBinary):
    return f'{parent}/binaries/{binary.version}-{uuid.uuid1()}{binary.file.ext}'


class BinaryHandler:
    def create_binary(self, parent: str, binary: ModelBinary, handler_context) -> ModelBinary:
        if binary.file:
            file: File = binary.file
            if not check_per_package_size(parent, file.uri):
                gcs.delete_file(gcs.TMP_BUCKET, file.uri)
                raise ResourceExhausted(
                    message=f'工具存储空间 {gcs.PACKAGE_LIMIT_GB}GB 已用完，请考虑删除历史版本.')

            binary.size = human_readable(
                precision=2, byte=gcs.get_file_size(gcs.TMP_BUCKET, file.uri))
            canonical_uri = generate_binary_canonical_uri(parent, binary)
            # move resource from tmp location to canonical bucket
            gcs.move_file(gcs.TMP_BUCKET, file.uri,
                          gcs.CANONICAL_BUCKET, canonical_uri)
            file.uri = canonical_uri
        elif binary.download_method:
            raise Unimplemented()
        else:
            raise InvalidArgument(
                'Either `file` or `download_method` has be specified.')
        binary.create(parent=parent, user_id=handler_context.user.user_id)
        return binary

    def update_binary(self, binary: ModelBinary, update_mask: FieldMask, handler_context) -> ModelBinary:
        base_binary = ModelBinary.from_name(binary.name)
        update_binary = binary
        if update_mask.has('file') and update_binary.file is None:
            base_binary.remove_resource()
        binary = merge_resource(base_resource=base_binary,
                                update_request=update_binary,
                                field_mask=update_mask)
        binary.update(user_id=handler_context.user.user_id)
        return binary

    def list_binaries(self, parent: str, page_size: int, page_token: str, sort_by: Optional[str], filter: Optional[str], handler_context) -> Iterable[ModelBinary]:
        # # TODO: remove migration hack
        # binaries = Binary.list(0, '')
        # for binary in binaries:
        #     model_binary = ModelBinary.from_legacy(binary)
        #     if not model_binary.is_exist():
        #         model_binary.create(binary.parent, binary.id)
        list_kwargs = {}
        if filter:
            list_kwargs = parse_filter(ModelBinary, filter)

        logger.debug(f'in list_binary: {parent}')
        return ModelBinary.list(parent=parent, order_by_field='create_time', **list_kwargs)

    def download_binary(self, binary: ModelBinary, handler_context) -> ModelBinary:
        binary.download_count += 1
        binary.update()
        # website statistic
        Statistic.load_today().increment_download()
        # Package statistic
        parent, _, _ = parse_name(binary.name)
        Package.from_name(ResourceName.from_str(binary.name).parent).increment_download()
        try:
            Activity(activity_id=None, user_id=handler_context.user.user_id, create_time=get_now(
            ), action=Action.DOWNLOAD, resource_name=binary.name).create()
        except Exception:
            pass
        return binary

    def delete_binary(self, binary: ModelBinary, handler_context) -> ModelBinary:
        binary.delete(user_id=handler_context.user.user_id)
        return binary
