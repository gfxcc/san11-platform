import sys, os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging


from lib.protos import san11_platform_pb2
from lib.url import Url
from lib.auths import Authenticator
from lib.image import Image
from lib.package import Package
from lib.user import User


logger = logging.getLogger(os.path.basename(__file__))


class ImageHandler:
    def upload_image(self, request, context):
        logger.info(f'In UploadImage: parent={request.parent}')
        # e.g. packages/1010
        parent = Url(request.parent)
        image = Image.create_without_filename(request.parent, request.image)

        authenticate = Authenticator.from_context(context)
        if not authenticate.canUploadImage(parent=parent):
            context.abort(code=255, details='权限不足')

        if parent.type == 'packages':
            Package.from_id(parent.id).append_image(image)
        elif parent.type == 'users':
            user = User.from_id(parent.id)
            if user.image_url:
                try:
                    Image.from_url(user.image_url).delete()
                except Exception as err:
                    logger.error(f'Failed to delete image: {err}')
            user.set_image(image)
        else:
            raise Exception(f'Invalid parent: {parent}')

        return san11_platform_pb2.Url(url=image.url)