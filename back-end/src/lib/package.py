from __future__ import annotations
import os
import logging
import json
import shutil
from enum import Enum
from typing import List, Any, Iterable, Dict
from datetime import datetime, timezone

from google.protobuf import descriptor

from .protos import san11_platform_pb2
from .db import run_sql_with_param_and_fetch_one, run_sql_with_param, \
    run_sql_with_param_and_fetch_all, get_db_fields_str, get_db_fields_placeholder_str, \
    sanitize_str
from .image import Image
from .category import Category
from .binary import Binary
from .time_util import get_datetime_format, get_timezone, get_now, datetime_to_str, \
                        get_age
from .resource import get_resource_path
from .query import Query
from .url import Url
from .comment.comment import Comment
from .resource import ResourceMixin
from .tag import Tag


logger = logging.getLogger(os.path.basename(__file__))


class Status(Enum):
    UNKNOWN = 0
    NORMAL = 1 # publish accessable
    UNDER_REVIEW = 2 # Only visiable to admin and author
    HIDDEN = 3 # Only visiable to admin and author
    SCHEDULE_DELETE = 4 # Only visiable to admin
    DELETED = 5 # Only visiable to admin


class Package(ResourceMixin):
    DEFAULT_STATUS_FOR_NEW_PACKAGE = Status.UNDER_REVIEW
    def __init__(self, package_id: int, name: str, description: str,
                 create_time: datetime, category_id: int,
                 status: int, author_id: int,
                 image_urls: List[str], download_count: int, 
                 tag_ids: List[int], update_time: datetime) -> None:
        self.package_id = package_id
        self.name = name
        self.description = description
        self.create_time = create_time.replace(tzinfo=timezone.utc) if create_time.tzinfo is None else create_time
        self.category_id = category_id
        self.status = status
        self.author_id = author_id
        self.image_urls = image_urls
        self.download_count = download_count
        self.tag_ids = tag_ids or []
        self.update_time = update_time.replace(tzinfo=timezone.utc) if update_time.tzinfo is None else update_time
    
    @property
    def url(self):
        return f'categories/{self.category_id}/packages/{self.package_id}'

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
        self.author_image_url = ''
        try:
            sql = 'SELECT image_url FROM users WHERE user_id=%(user_id)s'
            resp = run_sql_with_param_and_fetch_one(sql, {
                'user_id': author_id
            })
            self.author_image_url = resp[0]
        except Exception as err:
            logger.error(
                f'Failed to load author_image_url for user_id={author_id}: {err}')
    
    @property
    def status(self) -> Status:
        return self._status
    
    @status.setter
    def status(self, status: int) -> None:
        self._status = Status(status)

    def __str__(self):
        d = {
            'package_id': self.package_id,
            'name': self.name,
            'description': self.description,
            'create_time': datetime_to_str(self.create_time),
            'category': Category.from_category_id(self.category_id).name,
            'status': self.status.name,
            'author_id': self.author_id,
            'image_urls': self.image_urls,
            'download_count': self.download_count,
            'update_time': datetime_to_str(self.update_time),
            'tag_ids': self.tag_ids
        }
        return json.dumps(d, indent=2)

    @classmethod
    def db_table(cls) -> str:
        return 'packages'

    @classmethod
    def db_fields(cls):
        return ['package_id', 'name', 'description', 'create_time',
                'category_id', 'status', 'author_id', 'image_urls',
                'download_count', 'tag_ids', 'update_time']

    @classmethod
    def from_pb(cls, pb_obj: san11_platform_pb2.Package):
        return cls(
            package_id=pb_obj.package_id,
            name=pb_obj.name,
            description=pb_obj.description,
            create_time=pb_obj.create_time or get_now(),
            category_id=pb_obj.category_id,
            status=pb_obj.status or cls.DEFAULT_STATUS_FOR_NEW_PACKAGE,
            author_id=pb_obj.author_id,
            image_urls=pb_obj.image_urls,
            download_count=pb_obj.download_count,
            tag_ids=[tag.tag_id for tag in pb_obj.tags],
            update_time=pb_obj.update_time or get_now()
        )

    @classmethod
    def search(cls, page_size: int, page_token: str, query: str) -> List[Package]:
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM {cls.db_table()} '\
            f"WHERE name LIKE '%%{sanitize_str(query)}%%' ORDER BY create_time DESC"
        logger.debug(sql)
        resp = run_sql_with_param_and_fetch_all(sql, {})
        return [Package(*item) for item in resp]

    def _update_db_params(self, params: Dict) -> Dict:
        params['status'] = self.status.value
        return super()._update_db_params(params)

    def delete(self) -> None:
        for image_url in self.image_urls:
            try:
                Image.from_url(image_url).delete()
            except Exception:
                logger.error(f'Failed to delete image: image_url={image_url}')

        for binary in Binary.list(0, '', package_id=self.package_id):
            try:
                binary.delete()
            except Exception as err:
                logger.error(
                    f'Failed to delete binary: binary={binary} err={err}')

        for comment in Comment.list_comment(self.url):
            try:
                comment.delete()
            except Exception as err:
                logger.error(f'Failed to delete {comment} under {self}: {err}')

        sql = f'DELETE FROM {self.db_table()} WHERE package_id=%(package_id)s'
        run_sql_with_param(sql, {'package_id': self.package_id})

        try:
            # To remove the entire dir
            shutil.rmtree(get_resource_path(self.url))
        except Exception as err:
            logger.error(f'Failed remove {self.url}: {err}')

    def to_pb(self) -> san11_platform_pb2.Package:
        return san11_platform_pb2.Package(
            package_id=self.package_id,
            name=self.name,
            description=self.description,
            create_time=get_age(self.create_time),
            category_id=self.category_id,
            status=self.status.value,
            author_id=self.author_id,
            author_image_url=self.author_image_url,
            image_urls=self.image_urls,
            download_count=self.download_count,
            tags=[Tag.from_id(tag_id).to_pb() for tag_id in self.tag_ids],
            update_time=get_age(self.update_time or self.create_time)
        )

    def append_image(self, image: Image) -> None:
        self.image_urls.append(image.url)
        sql = f'UPDATE {self.db_table()} SET image_urls=%(image_urls)s WHERE {self.db_fields()[0]}=%(id)s'
        run_sql_with_param(
            sql, {'image_urls': self.image_urls, 'id': self.package_id})

    def increment_download(self, delta: int = 1) -> int:
        self.download_count += 1
        sql = f'UPDATE {self.db_table()} SET download_count=%(download_count)s WHERE {self.db_fields()[0]}=%(id)s'
        run_sql_with_param(sql, {
            'download_count': self.download_count,
            'id': self.package_id
        })
        return self.download_count

    def update(self):
        sql = f'UPDATE {self.db_table()} SET'\
            ' name=%(name)s'\
            ',description=%(description)s'\
            ',status=%(status)s'\
            ',image_urls=%(image_urls)s'\
            ',tag_ids=%(tag_ids)s'\
            ',update_time=%(update_time)s'\
            f' WHERE {self.db_fields()[0]}=%(id)s'
        params = {
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'image_urls': self.image_urls,
            'tag_ids': self.tag_ids,
            'update_time': get_now(),
            'id': self.package_id
        }
        params = self._update_db_params(params)
        run_sql_with_param(sql, params)
