import os
from asyncio.subprocess import DEVNULL
from enum import Enum


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

