import sys, os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging


from lib.protos import san11_platform_pb2
from lib.url import Url
from lib.auths import Authenticator
from lib.package import Package
from lib.binary import Binary
from lib.statistic import Statistic
from lib.sire_plugin import SirePlugin, SIRE_VERSION_TO_SUFFIX


logger = logging.getLogger(os.path.basename(__file__))


class BinaryHandler:
    def upload_binary(self, request, context):
        logger.info(f'In UploadBinary: parent={request.parent}')
        authenticate = Authenticator.from_context(context)
        if not authenticate.canUploadBinary(parent=Url(request.parent)):
            context.abort(code=255, details='权限不足')

        # If request.sire_version is not set, the default value is 0
        # suffix will evaluated as None in such case.
        suffix = SIRE_VERSION_TO_SUFFIX.get(request.sire_version, None)
        Binary.create_under_parent(
            request.parent, request.binary, request.data, suffix)

        if request.sire_auto_convert:
            sire_version, sire_plugin = request.sire_version, SirePlugin.from_sire_version(raw=request.data, main_version=request.sire_version)
            converted_data = sire_plugin.to_sire_1() if sire_version == 2 else sire_plugin.to_sire_2()
            converted_binary = request.binary
            converted_binary.tag = 'sire1' if request.binary.tag == 'sire2' else 'sire2'
            converted_suffix = SIRE_VERSION_TO_SUFFIX.get(1 if sire_version == 2 else 2, None)
            Binary.create_under_parent(
                request.parent, converted_binary, converted_data, converted_suffix)
        
        return san11_platform_pb2.Status(code=0, message='上传成功')

    def delete_binary(self, request, context):
        logger.info(f'In DeleteBinary: binary_id={request.binary_id}')
        binary = Binary.from_binary_id(request.binary_id)
        authenticate = Authenticator.from_context(context)
        if not authenticate.canDeleteBinary(binary):
            context.abort(code=255, details='权限不足')

        binary.delete()
        return san11_platform_pb2.Empty()

    def get_binary(self, request, context):
        logger.info(f'In GetBinary: binary_id={request.binary_id}')
        binary = Binary.from_binary_id(request.binary_id)
        return binary.to_pb()

    def list_binaries(self, request, context):
        logger.info(f'In ListBinaries: package_id: {request.package_id}')
        return san11_platform_pb2.ListBinariesResponse(binaries=[
            binary.to_pb() for binary in Binary.from_package_id(request.package_id)
        ])

    def download_binary(self, request, context):
        logger.info(f'In DownloadBinary: binary_id={request.binary_id}')
        binary = Binary.from_binary_id(request.binary_id)
        binary.download()
        logger.debug(f'{binary} is downloaded')

        # website statistic
        Statistic.load_today().increment_download()
        # Package statistic
        Package.from_id(Url(request.parent).id).increment_download()
        return binary.to_pb()