from handler.common.env import IMAGE_SERVER, get_server_addr


def get_full_url(url):
    '''
    Return the full url of the url.
    '''
    if url.startswith('http'):
        return url
    return f'{get_server_addr()}/{url}'


def get_image_url(uri):
    '''
    Return the full url of the image.
    '''
    return f'{IMAGE_SERVER}/{uri}'