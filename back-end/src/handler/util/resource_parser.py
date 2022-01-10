from __future__ import annotations

import logging
import os
import re
from typing import Tuple, Union

import attr
from handler.common.exception import InvalidArgument
from handler.model.base.base import ModelBase
from handler.model.model_article import ModelArticle
from handler.model.model_binary import ModelBinary
from handler.model.model_comment import ModelComment
from handler.model.model_notification import ModelNotification
from handler.model.model_reply import ModelReply
from handler.model.model_thread import ModelThread

from ..model.package import Package
from ..model.tag import Tag
from ..model.user import User

logger = logging.getLogger(os.path.basename(__file__))


def parse_name(name: str) -> Tuple[str, str, int]:
    '''
    Consider use `class ResourceName` rather than directly call this function.
    '''
    NAME_PATTERN = r'((?P<parent>.+)/)?(?P<collection>[a-zA-Z0-9]+)/(?P<resource_id>[0-9]+)'
    match = re.fullmatch(NAME_PATTERN, name)
    if not match:
        raise InvalidArgument(f'{name} is not a valid resource name')
    return match['parent'] or '', match['collection'], int(match['resource_id'])


def parse_resource_name(name: str) -> ModelBase:
    COLLECTION_TO_CLASS = {
        'packages': Package,
        'binaries': ModelBinary,
        'tags': Tag,
        'comments': ModelComment,
        'replies': ModelReply,
        'users': User,
        'threads': ModelThread,
        'articles': ModelArticle,
        'notifications': ModelNotification,
    }
    _, collection, resource_id = parse_name(name)

    resource_class = COLLECTION_TO_CLASS[collection]
    statement = f'{resource_class}.from_name(\'{name}\')'
    resource = resource_class.from_name(name)
    return resource


@attr.s(auto_attribs=True)
class ResourceName:
    parent : Union[ResourceName | str]
    collection : str
    resource_id : int

    def __str__(self) -> str:
        cur = f'{self.collection}/{self.resource_id}'
        if not self.parent:
            return cur
        return f'{self.parent}/{cur}'

    @classmethod
    def from_str(cls, s: str) -> ResourceName:
        parent_str, collection, resource_id = parse_name(s)
        try:
            parent = ResourceName.from_str(parent_str)
        except InvalidArgument:
            parent = parent_str
        return cls(parent=parent, collection=collection, resource_id=resource_id)
    

def find_resource(name: Union[str | ResourceName]) -> ModelBase:
    if isinstance(name, str):
        return parse_resource_name(name)
    elif isinstance(name, ResourceName):
        return parse_resource_name(str(name))
    else:
        raise ValueError(f'name must be an instance of str or ResourceName: {name}')
