from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List

from ..common.image import Image
from ..db import (get_db_fields_str, run_sql_with_param,
                  run_sql_with_param_and_fetch_all,
                  run_sql_with_param_and_fetch_one, sanitize_str)
from ..protos import san11_platform_pb2
from ..util.time_util import get_age, get_now
from .activity import TrackLifecycle
from .model_tag import ModelTag
from .resource import ResourceMixin, ResourceView
from .tag import Tag

logger = logging.getLogger(os.path.basename(__file__))


class Status(Enum):
    UNKNOWN = 0
    NORMAL = 1  # Public accessable
    UNDER_REVIEW = 2  # Only visiable to admin and author
    HIDDEN = 3  # Only visiable to admin and author
    SCHEDULE_DELETE = 4  # Only visiable to admin
    DELETED = 5  # Only visiable to admin


class Package(ResourceMixin, TrackLifecycle):
    DEFAULT_STATUS_FOR_NEW_PACKAGE = Status.UNDER_REVIEW

    def __init__(self, package_id: int, package_name: str, description: str,
                 create_time: datetime, category_id: int,
                 status: int, author_id: int,
                 image_urls: List[str], download_count: int,
                 tag_ids: List[int], update_time: datetime) -> None:
        self.package_id = package_id
        self.package_name = package_name
        self.description = description
        self.create_time = create_time.replace(
            tzinfo=timezone.utc) if create_time.tzinfo is None else create_time
        self.category_id = category_id
        self.status = status
        self.author_id = author_id
        self.image_urls = image_urls
        self.download_count = download_count
        self.tag_ids = tag_ids or []
        self.update_time = update_time.replace(
            tzinfo=timezone.utc) if update_time.tzinfo is None else update_time

    @property
    def url(self):
        '''
        [DEPRECATED]
        Please use `name`.
        '''
        return f'categories/{self.category_id}/packages/{self.package_id}'

    @property
    def name(self):
        return f'categories/{self.category_id}/packages/{self.package_id}'

    @property
    def id(self) -> int:
        return self.package_id

    @property
    def view(self) -> ResourceView:
        return ResourceView(
            name=self.name,
            display_name=self.package_name,
            # TODO: improve description
            description='',
            image_url=self.image_urls[0] if self.image_urls else ''
        )

    @property
    def image_urls(self):
        return self._image_urls

    @image_urls.setter
    def image_urls(self, image_urls):
        self._image_urls = image_urls or []

    @property
    def author_id(self) -> int:
        return self._author_id

    @author_id.setter
    def author_id(self, author_id: int) -> None:
        self._author_id = author_id

    @property
    def status(self) -> Status:
        return self._status

    @status.setter
    def status(self, status: int) -> None:
        self._status = Status(status)

    @classmethod
    def db_table(cls) -> str:
        return 'packages'

    @classmethod
    def db_fields(cls):
        return ['package_id', 'name', 'description', 'create_time',
                'category_id', 'status', 'author_id', 'image_urls',
                'download_count', 'tag_ids', 'update_time']

    @classmethod
    def name_pattern(cls) -> str:
        return r'categories/[0-9]+/packages/[0-9]+'

    @classmethod
    def from_pb(cls, pb_obj: san11_platform_pb2.Package):
        return cls(
            package_id=pb_obj.package_id,
            package_name=pb_obj.package_name,
            description=pb_obj.description,
            create_time=pb_obj.create_time or get_now(),
            category_id=pb_obj.category_id,
            status=pb_obj.status or cls.DEFAULT_STATUS_FOR_NEW_PACKAGE,
            author_id=pb_obj.author_id,
            image_urls=list(pb_obj.image_urls),
            download_count=pb_obj.download_count,
            tag_ids=[tag.tag_id for tag in pb_obj.tags],
            update_time=pb_obj.update_time or get_now()
        )

    @classmethod
    def list(cls, page_size: int, page_token: str, **kwargs) -> List[Any]:
        ret = super().list(page_size=page_size, page_token=page_token, **kwargs)
        # discard description as it might be too large, which will slow down the service
        # for item in ret:
        #     item.description = ''
        return ret

    @classmethod
    def search(cls, page_size: int, page_token: str, query: str) -> List[Package]:
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM {cls.db_table()} '\
            f"WHERE name LIKE '%%{sanitize_str(query)}%%' ORDER BY create_time DESC"
        logger.debug(sql)
        resp = run_sql_with_param_and_fetch_all(sql, {})
        return [Package(*item) for item in resp]

    def _update_db_params(self, params: Dict) -> Dict:
        params['status'] = self.status.value
        # TODO: rename db field name to package_name
        params['name'] = self.package_name
        return super()._update_db_params(params)

    def to_pb(self) -> san11_platform_pb2.Package:
        return san11_platform_pb2.Package(
            package_name=self.package_name,
            description=self.description,
            create_time=get_age(self.create_time),
            state=self.status.value,
            author_id=self.author_id,
            image_urls=self.image_urls,
            download_count=self.download_count,
            tags=[ModelTag.from_id(tag_id).to_pb() for tag_id in self.tag_ids],
            update_time=get_age(self.update_time or self.create_time),
            name=self.name,
        )

    def append_image(self, image: Image) -> None:
        self.image_urls.append(image.url)
        sql = f'UPDATE {self.db_table()} SET image_urls=%(image_urls)s WHERE {self.db_fields()[0]}=%({self.db_fields()[0]})s'
        run_sql_with_param(
            sql, {'image_urls': self.image_urls, self.db_fields()[0]: self.package_id})

    def increment_download(self, delta: int = 1) -> int:
        self.download_count += 1
        sql = f'UPDATE {self.db_table()} SET download_count=%(download_count)s WHERE {self.db_fields()[0]}=%(id)s'
        run_sql_with_param(sql, {
            'download_count': self.download_count,
            'id': self.package_id
        })
        return self.download_count
