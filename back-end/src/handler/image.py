import sys, os, uuid
import logging


from .lib.protos import san11_platform_pb2
from .lib.url import Url
from .lib.auths import Authenticator
from .lib.image import Image
from .lib.package import Package
from .lib.user import User
from .lib.image import get_image_url
from .lib import gcs


logger = logging.getLogger(os.path.basename(__file__))


class ImageHandler:
    def create_image(self, request, context):
        logger.info(f'In create_image: parent={request.parent}')
        parent = Url(request.parent)

        authenticate = Authenticator.from_context(context)
        if not authenticate.canUploadImage(parent=parent):
            context.abort(code=255, details='权限不足')

        url = get_image_url(request.parent, f'{uuid.uuid1()}.jpeg', request.in_description)
        gcs.move_file(gcs.TMP_BUCKET, request.url, gcs.CANONICAL_BUCKET, url)
        image = Image(url)

        if not request.in_description:
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