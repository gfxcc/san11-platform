import logging
import sys
import os
import uuid


from .model.activity import Activity, Action
from .common.field_mask import FieldMask, merge_resource
from .util import gcs
from .util.size_util import human_readable
from .common.exception import InvalidArgument, PermissionDenied
from .model.statistic import Statistic
from .model.binary import Binary
from .model.package import Package
from .auths import Authenticator
from .common.url import Url
from .protos import san11_platform_pb2
from .util.time_util import get_now

logger = logging.getLogger(os.path.basename(__file__))


class BinaryHandler:
    def create_binary(self, request, context):
        def get_binary_url(parent: Url, binary: Binary):
            category_to_ext = {
                1: {
                    'SIRE 1': '.sirecm',
                    'SIRE 2': '.scp'
                },  # SIRE plugin
                2: '.zip',  # Player tools
                3: '.zip'  # Mods
            }
            assert parent.type == 'packages'
            if parent.category_id == 1:
                ext = category_to_ext[parent.category_id][binary.tag]
            else:
                ext = category_to_ext[parent.category_id]
            return f'{str(parent)}/binaries/{binary.version}-{uuid.uuid1()}{ext}'

        auth = Authenticator.from_context(context)
        parent = Url(request.parent)
        if not auth.canUploadBinary(parent=parent):
            context.abort(code=PermissionDenied.code,
                          details=PermissionDenied.message)
        binary = Binary.from_pb(request.binary, parent=request.parent)
        binary.package_id = parent.package_id
        binary.url = get_binary_url(parent, binary)
        # prepare resource
        if request.HasField('url'):
            binary_size = gcs.get_file_size(gcs.TMP_BUCKET, request.url)
            binary.size = human_readable(precision=2, byte=binary_size)
            expected_disk_usage = binary_size + \
                gcs.disk_usage_under(request.parent)
            if expected_disk_usage > gcs.PACKAGE_LIMIT_GB * 1024 * 1024 * 1024:
                gcs.delete_file(gcs.TMP_BUCKET, request.url)
                context.abort(
                    code=255, details=f'工具存储空间 {gcs.PACKAGE_LIMIT_GB}GB 已用完，请考虑删除历史版本.')
            # move resource from tmp location to canonical bucket
            gcs.move_file(gcs.TMP_BUCKET, request.url,
                          gcs.CANONICAL_BUCKET, binary.url)
            logger.info(
                f'{expected_disk_usage/(1024*1024*1024)}GB is used for {request.parent}')
        else:
            raise InvalidArgument(
                'Invalid resource: it has to be one of [data, url, download_method]')

        # create db entry
        binary.create(user_id=auth.session.user.user_id)
        return binary.to_pb()

    def delete_binary(self, request, context):
        binary = Binary.from_id(request.binary_id)
        auth = Authenticator.from_context(context)
        if not auth.canDeleteBinary(binary):
            context.abort(code=PermissionDenied.code,
                          details=PermissionDenied.message)
        binary.delete(user_id=auth.session.user.user_id)
        return san11_platform_pb2.Empty()

    def update_binary(self, request, context):
        base_binary = Binary.from_id(request.binary.binary_id)

        auth = Authenticator.from_context(context)
        if not auth.canUpdateBinary(base_binary):
            context.abort(code=PermissionDenied.code,
                          details=PermissionDenied.message)

        update_binary = Binary.from_pb(request.binary, parent=None)
        update_mask = FieldMask.from_pb(request.update_mask)
        if update_mask.has('url') and update_binary.url == '':
            base_binary.remove_resource()
        binary = merge_resource(base_resource=base_binary,
                                update_request=update_binary,
                                field_mask=update_mask)
        binary.update(user_id=auth.session.user.user_id)
        return binary.to_pb()

    def get_binary(self, request, context):
        binary = Binary.from_id(request.binary_id)
        return binary.to_pb()

    def list_binaries(self, request, context):
        binaries = Binary.list(0, '', package_id=request.package_id)
        package = Package.from_id(request.package_id)
        for binary in binaries:
            if not binary.parent:
                binary.parent = package.name
        return san11_platform_pb2.ListBinariesResponse(binaries=[
            binary.to_pb() for binary in binaries
        ])

    def download_binary(self, request, context):
        logger.info(f'In DownloadBinary: binary_id={request.binary_id}')
        binary = Binary.from_id(request.binary_id)
        binary.download()
        logger.debug(f'{binary} is downloaded')
        # website statistic
        Statistic.load_today().increment_download()
        # Package statistic
        Package.from_id(Url(request.parent).id).increment_download()
        try:
            auth = Authenticator.from_context(context)
            Activity(activity_id=None, user_id=auth.session.user.user_id, create_time=get_now(
            ), action=Action.DOWNLOAD, resource_name=binary.name).create()
        except Exception:
            pass
        return binary.to_pb()
