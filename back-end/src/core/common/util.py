import secrets
import string


def gen_random_str(l: int = 8) -> str:
    '''Generate a random string'''
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for i in range(l))
