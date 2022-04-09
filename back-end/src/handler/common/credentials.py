

import json
import os
from dataclasses import dataclass
from typing import Tuple


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
