from __future__ import annotations

import logging
import os
from typing import Union

from handler.model.base.base import ModelBase
from handler.model.model_article import ModelArticle
from handler.model.model_binary import ModelBinary
from handler.model.model_comment import ModelComment
from handler.model.model_notification import ModelNotification
from handler.model.model_package import ModelPackage
from handler.model.model_reply import ModelReply
from handler.model.model_tag import ModelTag
from handler.model.model_thread import ModelThread

from ..model.user import User
from .name_util import ResourceName

logger = logging.getLogger(os.path.basename(__file__))


def parse_resource_name(name: str) -> ModelBase:
    COLLECTION_TO_CLASS = {
        'packages': ModelPackage,
        'binaries': ModelBinary,
        'tags': ModelTag,
        'comments': ModelComment,
        'replies': ModelReply,
        'users': User,
        'threads': ModelThread,
        'articles': ModelArticle,
        'notifications': ModelNotification,
    }
    collection = ResourceName.from_str(name).collection

    resource_class = COLLECTION_TO_CLASS[collection]
    return resource_class.from_name(name)


def find_resource(name: Union[str | ResourceName]) -> ModelBase:
    if isinstance(name, str):
        return parse_resource_name(name)
    elif isinstance(name, ResourceName):
        return parse_resource_name(str(name))
    else:
        raise ValueError(f'name must be an instance of str or ResourceName: {name}')
