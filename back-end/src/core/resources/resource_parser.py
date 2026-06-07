from __future__ import annotations

import logging
import os
from typing import Union

from core.models.base import ModelBase
from core.models.base.base import COLLECTION_TO_MODEL
from repositories.resource_repository import repository_for

from .name_util import ResourceName

logger = logging.getLogger(os.path.basename(__file__))


def parse_resource_name(name: str) -> ModelBase:
    collection = ResourceName.from_str(name).collection
    resource_class = COLLECTION_TO_MODEL[collection]
    return repository_for(resource_class).get(name)


def find_resource(name: Union[str, ResourceName]) -> ModelBase:
    if isinstance(name, str):
        return parse_resource_name(name)
    elif isinstance(name, ResourceName):
        return parse_resource_name(str(name))
    else:
        raise ValueError(f'name must be an instance of str or ResourceName: {name}')
