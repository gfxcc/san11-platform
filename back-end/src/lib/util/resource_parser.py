from os import stat
import re
import logging

from ..resource import ResourceMixin
from ..package import Package
from ..binary import Binary
from ..tag import Tag
from ..comment import Comment, Reply
from ..user import User


def parse_resource_name(name: str) -> ResourceMixin:
    COLLECTION_TO_CLASS = {
        'packages': 'Package',
        'binaries': 'Binary',
        'tags': 'Tag',
        'comments': 'Comment',
        'replies': 'Reply',
        'users': 'User'
    }
    NAME_PATTERN = r'(.+/)?(?P<collection>[a-zA-Z0-9]+)/(?P<resource_id>[0-9]+)'
    match = re.fullmatch(NAME_PATTERN, name)
    assert match, f'Invalid resource name: {name}. Expected pattern: {NAME_PATTERN}'
    collection, resource_id = match['collection'], match['resource_id']

    resource_class = COLLECTION_TO_CLASS[collection]
    statement = f'{resource_class}.from_id(int({resource_id}))'
    resource = eval(statement)
    return resource
