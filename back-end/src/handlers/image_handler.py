import logging
import os
from io import BytesIO

import requests
from PIL import Image

from models.model_package import ModelPackage
from models.model_user import (DEFAULT_USER_AVATAR, PRESET_USER_AVATARS,
                                      ModelUser)
from repositories.resource_repository import repository_for
from integrations.files.file_server import (BucketClass, FileServer, FileServerType,
                                      get_file_server)

from core.common.image import ImageSize
from core.common.url import Url
from core.common.util import gen_random_str
from app.protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class ImageHandler:
    def __init__(self, package_repository=None, user_repository=None):
        self.package_repository = package_repository or repository_for(ModelPackage)
        self.user_repository = user_repository or repository_for(ModelUser)

    def create_image(self, request: pb.CreateImageRequest, context):
        logger.info(f'In create_image: parent={request.parent}')
        parent = Url(request.parent)

        new_uri = get_image_uri(request.parent, request.image_type)

        # TODO: Switch to AWS S3
        file_server = get_file_server(FileServerType.GCS)
        file_server.move_file(BucketClass.TEMP, request.url,
                              BucketClass.REGULAR, new_uri)

        if request.image_type != pb.ImageType.DESCRIPTION:
            if parent.type == 'packages':
                package = self.package_repository.get(request.parent)
                package.image_urls.append(new_uri)
                self.package_repository.update(package)
            elif parent.type == 'users':
                user = self.user_repository.get(f'users/{parent.id}')
                delete_user_avatar(file_server, user)
                resample_img_for_user_avatar(
                    file_server, new_uri)
                user.image_url = new_uri
                self.user_repository.update(user, actor_info=user.user_id)
            else:
                raise Exception(f'Invalid parent: {parent}')
        return pb.Url(url=new_uri)


def get_image_uri(parent: str, image_type: pb.ImageType.ValueType) -> str:
    '''Generate a uri for an image and inject a random string into filename
    to force refresh at client side.'''
    if image_type == pb.ImageType.SCREENSHOT:
        return f'{parent}/images/screenshots/{gen_random_str()}.jpeg'
    elif image_type == pb.ImageType.USER_AVATAR:
        return f'{parent}/images/avatar-{gen_random_str()}.jpeg'
    elif image_type == pb.ImageType.DESCRIPTION:
        return f'{parent}/images/desc/{gen_random_str()}.jpeg'
    else:
        raise Exception(f'Invalid image type: {image_type}')


# Read a img from a url and resample it into a specified size
def resample_image(url: str, width: int, height: int) -> Image.Image:
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))
    img = img.resize((width, height), resample=Image.LANCZOS)
    return img.convert('RGB')


def delete_user_avatar(file_server: FileServer, user: ModelUser):
    if not user.image_url.startswith(PRESET_USER_AVATARS):
        try:
            file_server.delete_by_prefix(
                BucketClass.REGULAR, user.image_url.replace('.jpeg', ''))
        except Exception as err:
            logger.error(f'Failed to delete avatar: {err}')


def resample_img_for_user_avatar(file_server: FileServer, uri: str):
    url = file_server.get_url(BucketClass.REGULAR, uri)
    for size in [ImageSize.SMALL, ImageSize.MEDIUM, ImageSize.LARGE]:
        img = resample_image(url, size.value, size.value)
        output_buffer = BytesIO()
        img.save(output_buffer, format='JPEG')
        file_server.create_file(output_buffer,
                                uri.replace('.jpeg', f'_{size.value}_{size.value}.jpeg'))
