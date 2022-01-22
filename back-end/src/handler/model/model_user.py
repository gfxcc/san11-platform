import datetime
from typing import Optional

import attr
from handler.model.base.base_db import ListOptions
from handler.model.model_activity import TrackLifecycle
from handler.model.model_comment import ModelComment

from ..protos import san11_platform_pb2 as pb
from .base import Attrib, InitModel, ModelBase


@InitModel(
    db_table='users',
    proto_class=pb.User,
)
@attr.s
class ModelUser(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/users/{user_id}`
    # E.g. `users/12345`
    name = Attrib(
        type=str,
    )
    user_id = Attrib(
        type=int,
    )
    username = Attrib(
        type=str,
    )
    email = Attrib(
        type=str,
    )
    user_type = Attrib(
        type=int, # TODO
    )
    image_url = Attrib(
        type=str,
    )
    website = Attrib(
        type=str,
    )
    
    @classmethod
    def from_v1(cls, legacy_model):
        return cls(
            name='',
            user_id=legacy_model.user_id,
            username=legacy_model.username,
            email=legacy_model.email,
            user_type=1 if legacy_model.user_type == 'admin' else 11,
            image_url=legacy_model.image_url,
            website=legacy_model.website,
        )
