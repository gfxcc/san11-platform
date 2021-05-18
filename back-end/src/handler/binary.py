import sys, os, uuid
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging

from lib.protos import san11_platform_pb2
from lib.url import Url
from lib.auths import Authenticator
from lib.package import Package
from lib.binary import Binary
from lib.statistic import Statistic
from lib.exception import InvalidArgument, PermissionDenied
from lib.sire_plugin import SirePlugin, SIRE_VERSION_TO_SUFFIX
from lib.resource import create_resource
from lib.util.size_util import human_readable
from lib import gcs
from lib.field_mask import FieldMask, merge_resource


logger = logging.getLogger(os.path.basename(__file__))


class BinaryHandler:
    def create_binary(self, request, context):
        logger.info(f'In create_binary') 
        def get_binary_url(parent: Url, binary: Binary):
            category_to_ext = {
                1: {
                    'sire1': '.sirecm',
                    'sire2': '.scp'
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

        authenticate = Authenticator.from_context(context)
        parent = Url(request.parent)
        if not authenticate.canUploadBinary(parent=parent):
            context.abort(code=PermissionDenied.code, details=PermissionDenied.message)
        binary = Binary.from_pb(request.binary)
        binary.package_id = parent.package_id
        binary.url = get_binary_url(parent, binary)
        # prepare resource
        if request.HasField('url'):
            binary_size = gcs.get_file_size(gcs.TMP_BUCKET, request.url)
            binary.size = human_readable(precision=2, byte=binary_size)
            expected_disk_usage = binary_size + gcs.disk_usage_under(request.parent)
            if  expected_disk_usage > gcs.PACKAGE_LIMIT_GB * 1024 * 1024 * 1024:
                gcs.delete_file(gcs.TMP_BUCKET, request.url)
                context.abort(code=255, details=f'工具存储空间 {gcs.PACKAGE_LIMIT_GB}GB 已用完，请考虑删除历史版本.')
            # move resource from tmp location to canonical bucket
            gcs.move_file(gcs.TMP_BUCKET, request.url, gcs.CANONICAL_BUCKET, binary.url)
            logger.info(f'{expected_disk_usage/(1024*1024*1024)}GB is used for {request.parent}')
        else:
            raise InvalidArgument('Invalid resource: it has to be one of [data, url, download_method]')

        # create db entry
        binary.create()
        return binary.to_pb()

    def delete_binary(self, request, context):
        logger.info(f'In delete_binary: binary_id={request.binary_id}')
        binary = Binary.from_id(request.binary_id)
        authenticate = Authenticator.from_context(context)
        if not authenticate.canDeleteBinary(binary):
            context.abort(code=PermissionDenied.code, details=PermissionDenied.message)
        binary.delete()
        return san11_platform_pb2.Empty()
    
    def update_binary(self, request, context):
        logger.info(f'In update_binary: binary_id={request.binary.binary_id}')
        base_binary = Binary.from_id(request.binary.binary_id)
        auth = Authenticator.from_context(context)
        if not auth.canUpdateBinary(base_binary):
            context.abort(code=PermissionDenied.code, details=PermissionDenied.message)
        binary = merge_resource(base_resource=base_binary,
                                update_request=Binary.from_pb(request.binary),
                                field_mask=FieldMask.from_pb(request.update_mask))
        binary.update()
        return binary.to_pb()

    def get_binary(self, request, context):
        logger.info(f'In get_binary: binary_id={request.binary_id}')
        binary = Binary.from_id(request.binary_id)
        return binary.to_pb()

    def list_binaries(self, request, context):
        logger.info(f'In list_binaries: package_id: {request.package_id}')
        return san11_platform_pb2.ListBinariesResponse(binaries=[
            binary.to_pb() for binary in Binary.list(0, '', package_id=request.package_id)
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
        return binary.to_pb()