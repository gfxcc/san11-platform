import logging
import os
import uuid

from handler.model.model_package import ModelPackage
from handler.model.model_user import ModelUser

from .common.image import Image
from .common.url import Url
from .model.resource import get_image_url
from .protos import san11_platform_pb2
from .util import gcs

logger = logging.getLogger(os.path.basename(__file__))


class ImageHandler:
    def create_image(self, request, context):
        logger.info(f'In create_image: parent={request.parent}')
        parent = Url(request.parent)

        url = get_image_url(
            request.parent, f'{uuid.uuid1()}.jpeg', request.in_description)
        gcs.move_file(gcs.TMP_BUCKET, request.url, gcs.CANONICAL_BUCKET, url)
        image = Image(url)

        if not request.in_description:
            if parent.type == 'packages':
                package = ModelPackage.from_name(request.parent)
                package.image_urls.append(image.url)
                package.update()
            elif parent.type == 'users':
                user = ModelUser.from_name(f'users/{parent.id}')
                if user.image_url:
                    try:
                        Image.from_url(user.image_url).delete()
                    except Exception as err:
                        logger.error(f'Failed to delete image: {err}')
                user.image_url = image.url
                user.update(user_id=user.user_id)
            else:
                raise Exception(f'Invalid parent: {parent}')

        return san11_platform_pb2.Url(url=image.url)
