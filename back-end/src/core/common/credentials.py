

import json
import logging
import os
from dataclasses import dataclass
from typing import Tuple

import google.auth
from google.oauth2.service_account import Credentials

logger = logging.getLogger(os.path.basename(__file__))


class CredentialConfigurationError(RuntimeError):
    pass


@dataclass
class AwsCredentials:
    access_key_id: str
    secret_access_key: str


def get_aws_credentials() -> AwsCredentials:
    filename = _require_credential_file('AWS_CREDENTIALS_FILE', 'AWS S3')
    with open(filename, encoding='utf-8') as credential_file:
        creds = json.load(credential_file)
    return AwsCredentials(
        access_key_id=creds['access_key_id'],
        secret_access_key=creds['secret_access_key'],
    )


def get_gcloud_credentials() -> Credentials:
    filename = _require_credential_file('GCLOUD_CREDENTIALS_FILE', 'Google Cloud')
    credentials, _ = google.auth.load_credentials_from_file(filename)

    logger.debug(f'Loaded credentials: {credentials} {type(credentials)}')
    assert isinstance(credentials, Credentials)
    return credentials


def _require_credential_file(environment_variable: str,
                             integration_name: str) -> str:
    filename = os.environ.get(environment_variable)
    if not filename:
        raise CredentialConfigurationError(
            f'{integration_name} integration is not configured: '
            f'{environment_variable} is required'
        )
    return filename
