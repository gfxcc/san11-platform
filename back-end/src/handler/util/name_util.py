from __future__ import annotations

import logging
import os
import re
from typing import Tuple, Union

import attr
from handler.common.exception import InvalidArgument

logger = logging.getLogger(os.path.basename(__file__))


def _parse_name(name: str) -> Tuple[str, str, int]:
    '''
    Consider use `class ResourceName` rather than directly call this function.
    '''
    NAME_PATTERN = r'((?P<parent>.+)/)?(?P<collection>[a-zA-Z0-9]+)/(?P<resource_id>[0-9]+)'
    match = re.fullmatch(NAME_PATTERN, name)
    if not match:
        raise InvalidArgument(f'{name} is not a valid resource name')
    return match['parent'] or '', match['collection'], int(match['resource_id'])


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
        parent_str, collection, resource_id = _parse_name(s)
        try:
            parent = ResourceName.from_str(parent_str)
        except InvalidArgument:
            parent = parent_str
        return cls(parent=parent, collection=collection, resource_id=resource_id)
