from operator import is_
import attr
import datetime
from typing import List

from .package import Package
from .base import ModelBase, Attrib, InitModel
from .base import DatetimeProtoConverter
from ..protos import san11_platform_pb2 as pb
from ..util.time_util import get_now


@InitModel(
    db_table='packages',
    proto_class=pb.Package,
)
@attr.s
class ModelPackage(ModelBase):
    # Resource name. It is `{parent}/packages/{package_id}`
    # E.g. `categories/1/packages/123`
    name = Attrib(
        type=str,
    )
    package_name = Attrib(
        type=str,
    )
    description = Attrib(
        type=str,
    )
    category_id = Attrib(
        type=int,
    )
    state = Attrib(
        type=int,
    )
    author_id = Attrib(
        type=int,
    )
    image_urls = Attrib(
        type=str,
        repeated=True,
    )
    download_count = Attrib(
        type=int,
    )
    tag_ids = Attrib(
        type=int,
        repeated=True,
    )
    create_time = Attrib(
        type=datetime.datetime,
        default=get_now(),
    )
    update_time = Attrib(
        type=datetime.datetime,
        default=get_now(),
    )

    @classmethod
    def from_legacy_package(cls, legacy_package: Package):
        return cls(
            name=legacy_package.name,
            
        )
