import base64
import logging
import os
import re

import bcrypt

logger = logging.getLogger(os.path.basename(__file__))

def is_email(s: str) -> bool:
    return re.fullmatch(r'[^@]+@[^@]+\.[^@]+', s) != None

def normalize_email(email: str) -> str:
    '''
    Normalize email including
        * convert email to lowercase.
    '''
    return email.lower()


def hash_password(password: str) -> str:
    # Store hashed password in its base64 encoding string since json object only
    # support unicode string.
    return base64.b64encode(bcrypt.hashpw(password.encode(), bcrypt.gensalt())).decode()


def verify_password(password: str, hashed: str) -> bool:

    logger.debug(password)
    logger.debug(hashed)

    hashed_bytes = base64.b64decode(hashed.encode())
    return bcrypt.checkpw(password.encode(), hashed_bytes)
