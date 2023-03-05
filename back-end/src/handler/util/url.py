from handler.common.env import get_server_addr


def get_full_url(url):
    '''
    Return the full url of the url.
    '''
    if url.startswith('http'):
        return url
    return f'{get_server_addr()}/{url}'
