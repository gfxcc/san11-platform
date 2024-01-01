import os
from asyncio.subprocess import DEVNULL
from enum import Enum

IMAGE_SERVER = 'https://storage.googleapis.com/san11-resources'

class Env(Enum):
    ENV_UNSPECIFIED = 0

    DEV = 1
    ALPHA = 2
    BETA = 3
    PROD = 4


def get_env() -> Env:
    if os.environ.get('STAGE') == 'DEV':
        return Env.DEV
    else:
        return Env.PROD


def get_server_addr() -> str:
    if get_env() == Env.DEV:
        return 'http://localhost:4200'
    return 'https://san11pk.org'