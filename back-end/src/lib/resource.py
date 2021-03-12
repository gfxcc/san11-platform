
import os, os.path
import errno


RESOURCE_PATH = '/data'


def get_images_path(parent: str) -> str:
    return f'{RESOURCE_PATH}/{parent}/images'


def get_binaries_path(parent: str) -> str:
    return f'{RESOURCE_PATH}/{parent}/binaries'


def get_image_url(parent: str, filename: str) -> str:
    return f'{parent}/images/{filename}'


def get_binary_url(parent: str, filename: str) -> str:
    return f'{parent}/binaries/{filename}'


def get_resource_path(url: str) -> str:
    return f'{RESOURCE_PATH}/{url}'


def get_parent_type(parent: str) -> str:
    '''
    parent:
      - categories/xxx/packages/xxx
      - users/xxx
    '''
    # TODO: add more validation
    parts = parent.split('/')
    return parts[0]

def create_resource(url: str, data: bytes):
    path = get_resource_path(url)
    if not os.path.exists(os.path.dirname(path)):
        try:
            os.makedirs(os.path.dirname(path))
        except OSError as exc: # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise
    with open(path, 'wb') as fd:
        fd.write(data)