import re, attr
from typing import Dict, Iterable, Tuple

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

def parse_order_by(cls: type, order_by: str) -> Iterable[Tuple[str, str]]:
    '''
    Input:
        cls: class of resource class.
        order_by: E.g. "create_time", "create_time desc, download_count"
    Returns:
        parsed_order_by: [[field_name, order], [field_name, order]].
            E.g. [('create_time', 'desc'), ('download_count', '')]
    '''
    proto2db = {}
    for attribute in attr.fields(cls):
        proto2db[_get_proto_path(attribute)] = _get_db_path(attribute)

    ret = []
    for segment in order_by.split(','):
        segment = segment.strip().lower()
        field_name = segment.split()[0]
        order = 'DESC' if segment.endswith(' desc') else ''
        ret.append((field_name, order))
    
    return ret
