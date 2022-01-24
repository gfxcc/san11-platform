from __future__ import annotations

import logging
import os
from typing import Union

from handler.model.base import _SUB_MODEL_BASE_T
from handler.model.base.base import COLLECTION_TO_MODEL

from .name_util import ResourceName

logger = logging.getLogger(os.path.basename(__file__))


def parse_resource_name(name: str) -> _SUB_MODEL_BASE_T:
    collection = ResourceName.from_str(name).collection
    resource_class = COLLECTION_TO_MODEL[collection]
    return resource_class.from_name(name)


def find_resource(name: Union[str, ResourceName]) -> _SUB_MODEL_BASE_T:
    if isinstance(name, str):
        return parse_resource_name(name)
    elif isinstance(name, ResourceName):
        return parse_resource_name(str(name))
    else:
        raise ValueError(f'name must be an instance of str or ResourceName: {name}')
