from __future__ import annotations
import os
import logging
import json
import shutil
from typing import List, Any, Iterable
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


class Package(ResourceMixin):
    DEFAULT_STATUS_FOR_NEW_PACKAGE = 'under_review'
    def __init__(self, package_id: int, name: str, description: str,
                 create_time: datetime, category_id: int,
                 status: str, author_id: int,
                 image_urls: List[str], download_count: int, 
                 tag_ids: List[int], update_time: datetime) -> None:
        self.package_id = package_id
        self.name = name
        self.description = description
        self.create_time = create_time.replace(tzinfo=timezone.utc)
        self.category_id = category_id
        self.status = status
        self.author_id = author_id
        self.image_urls = image_urls
        self.download_count = download_count
        self.tag_ids = tag_ids or []
        self.update_time = update_time.replace(tzinfo=timezone.utc)
    
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

    def __str__(self):
        d = {
            'package_id': self.package_id,
            'name': self.name,
            'description': self.description,
            'create_time': datetime_to_str(self.create_time),
            'category': Category.from_category_id(self.category_id).name,
            'status': self.status,
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
    def from_id(cls, id: int) -> Package:
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM packages '\
            'WHERE package_id=%(id)s'
        resp = run_sql_with_param_and_fetch_one(
            sql, {'id': id})
        return cls(*resp)

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
    def list(cls, page_size: int, page_token: str, **kwargs) -> List[Package]:
        SUPPORTED_KEY = ['category_id', 'author_id', 'tag_id']
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM {cls.db_table()}'
        constrains = []
        for key in SUPPORTED_KEY:
            if key in kwargs and kwargs[key]:
                if key == 'tag_id':
                    constrains.append(f"'{kwargs[key]}'=ANY(tag_ids)")
                else:
                    constrains.append(f'{key}={kwargs[key]}')
        if constrains:
            sql = f"{sql} WHERE {' AND '.join(constrains)}"
        sql += ' ORDER BY create_time DESC'
        logger.debug(f'listPackage: {sql}')
        resp = run_sql_with_param_and_fetch_all(sql, {})
        return [cls(*item) for item in resp]

    @classmethod
    def search(cls, page_size: int, page_token: str, query: str) -> List[Package]:
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM {cls.db_table()} '\
            f"WHERE name LIKE '%%{sanitize_str(query)}%%' ORDER BY create_time DESC"
        logger.debug(sql)
        resp = run_sql_with_param_and_fetch_all(sql, {})
        return [Package(*item) for item in resp]

    def create(self) -> None:
        sql = f'INSERT INTO {self.db_table()} ({get_db_fields_str(self.db_fields())}) VALUES '\
            f'( COALESCE((SELECT MAX(package_id) FROM packages)+1, 1), '\
            f'{get_db_fields_placeholder_str(self.db_fields()[1:])}) RETURNING package_id'

        resp = run_sql_with_param_and_fetch_one(sql, {
            'name': self.name,
            'description': self.description,
            'create_time': self.create_time,
            'category_id': self.category_id,
            'status': self.status,
            'author_id': self.author_id,
            'image_urls': self.image_urls,
            'download_count': self.download_count,
            'tag_ids': self.tag_ids,
            'update_time': self.update_time
        })
        self.package_id = resp[0]

    def delete(self) -> None:
        for image_url in self.image_urls:
            try:
                Image.from_url(image_url).delete()
            except Exception:
                logger.error(f'Failed to delete image: image_url={image_url}')

        for binary in Binary.from_package_id(self.package_id):
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
            status=self.status,
            author_id=self.author_id,
            author_image_url=self.author_image_url,
            image_urls=self.image_urls,
            download_count=self.download_count,
            tags=[Tag.from_id(tag_id).to_pb() for tag_id in self.tag_ids],
            update_time=get_age(self.update_time or self.create_time)
        )

    def append_image(self, image: Image) -> None:
        self.image_urls.append(image.url)
        sql = 'UPDATE packages SET image_urls=%(image_urls)s WHERE package_id=%(package_id)s'
        run_sql_with_param(
            sql, {'image_urls': self.image_urls, 'package_id': self.package_id})

    def increment_download(self, delta: int = 1) -> int:
        self.download_count += 1
        sql = 'UPDATE packages SET download_count=%(download_count)s WHERE package_id=%(package_id)s'
        run_sql_with_param(sql, {
            'download_count': self.download_count,
            'package_id': self.package_id
        })
        return self.download_count

    def update(self):
        sql = 'UPDATE packages SET'\
            ' name=%(name)s'\
            ',description=%(description)s'\
            ',status=%(status)s'\
            ',image_urls=%(image_urls)s'\
            ',tag_ids=%(tag_ids)s'\
            ',update_time=%(update_time)s'\
            ' WHERE package_id=%(package_id)s'
        logger.debug(f'updating {self}')

        run_sql_with_param(sql, {
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'image_urls': self.image_urls,
            'tag_ids': self.tag_ids,
            'update_time': get_now(),
            'package_id': self.package_id
        })
