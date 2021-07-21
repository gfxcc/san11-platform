import re, attr
from typing import Dict

from ..model.base.base_proto import _get_proto_path
from ..model.base.base_db import _get_db_path


def parse_filter(cls: type, filter: str) -> Dict:
    '''
    Input:
        cls: class of resource class.
        filter: E.g. "create_time > '2021-07-20 10:43:28.313033+08:00'"
            "author_id = 123 AND state = 1"
    Returns parsed key, value parse as a dictionary.
    '''
    proto2db = {}
    for attribute in attr.fields(cls):
        proto2db[_get_proto_path(attribute)] = _get_db_path(attribute)

    kwargs = {}
    segments = map(str.strip, re.split('AND | OR', filter))
    for segment in segments:
        k, v = map(str.strip, segment.split('='))
        kwargs[proto2db[k]] = v
    return kwargs
