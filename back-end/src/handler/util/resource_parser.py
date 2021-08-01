from handler.model.model_binary import ModelBinary
from os import stat
import os
import re
import logging
from typing import Tuple

from ..model.resource import ResourceMixin
from ..model.package import Package
from ..model.binary import Binary
from ..model.tag import Tag
from ..model.comment import Comment
from ..model.user import User
from ..model.reply import Reply


logger = logging.getLogger(os.path.basename(__file__))


def parse_name(name: str) -> Tuple[str, str, int]:
    NAME_PATTERN = r'((?P<parent>.+)/)?(?P<collection>[a-zA-Z0-9]+)/(?P<resource_id>[0-9]+)'
    match = re.fullmatch(NAME_PATTERN, name)
    assert match, f'{name} is not a valid resource name'
    return match['parent'] or '', match['collection'], int(match['resource_id'])


def parse_resource_name(name: str) -> ResourceMixin:
    COLLECTION_TO_CLASS = {
        'packages': Package,
        'binaries': ModelBinary,
        'tags': Tag,
        'comments': Comment,
        'replies': Reply,
        'users': User,
    }
    _, collection, resource_id = parse_name(name)

    resource_class = COLLECTION_TO_CLASS[collection]
    statement = f'{resource_class}.from_name(\'{name}\')'
    logger.debug(statement)
    resource = resource_class.from_name(name)
    return resource
