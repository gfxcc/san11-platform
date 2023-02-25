

import json
import logging
import os
from dataclasses import dataclass
from typing import Tuple

import google.auth
from google.oauth2.service_account import Credentials

logger = logging.getLogger(os.path.basename(__file__))


@dataclass
class AwsCredentials:
    access_key_id: str
    secret_access_key: str


def get_aws_credentials() -> AwsCredentials:
    filename = os.environ['AWS_CREDENTIALS_FILE']
    creds = json.load(open(filename))
    return AwsCredentials(
        access_key_id=creds['access_key_id'],
        secret_access_key=creds['secret_access_key'],
    )


def get_gcloud_credentials() -> Credentials:
    filename = os.environ['GCLOUD_CREDENTIALS_FILE']
    credentials, _ = google.auth.load_credentials_from_file(filename)

    logger.debug(f'Loaded credentials: {credentials} {type(credentials)}')
    assert isinstance(credentials, Credentials)
    return credentials
