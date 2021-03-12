from __future__ import annotations
import os
import logging
import json
import shutil
from typing import List, Any
from datetime import datetime, timezone

from .protos import san11_platform_pb2
from .db_util import run_sql_with_param_and_fetch_one, run_sql_with_param, \
    run_sql_with_param_and_fetch_all
from .image import Image
from .category import Category
from .binary import Binary
from .time_util import get_datetime_format, get_timezone
from .resource import get_resource_path


logger = logging.getLogger(os.path.basename(__file__))


class Package:
    def __init__(self, package_id: int, name: str, description: str,
                 create_timestamp: datetime, category_id: int,
                 status: str, author_id: int, binary_ids: List[str],
                 image_urls: List[str], tags: List[str]) -> None:
        self.package_id = package_id
        self.name = name
        self.description = description
        self.create_timestamp = create_timestamp
        self.category_id = category_id
        self.status = status
        self.author_id = author_id
        self.binary_ids = binary_ids
        self.image_urls = image_urls
        self.tags = tags

    @property
    def binary_ids(self):
        return self._binary_ids
    
    @binary_ids.setter
    def binary_ids(self, binary_ids):
        self._binary_ids = binary_ids or []

    @property
    def image_urls(self):
        return self._image_urls

    @image_urls.setter
    def image_urls(self, image_urls):
        self._image_urls = image_urls or []
    
    @property
    def url(self):
        return f'categories/{self.category_id}/packages/{self.package_id}'

    def __str__(self):
        d = {
            'package_id': self.package_id,
            'name': self.name,
            'description': self.description,
            'create_timstamp': self.create_timestamp.strftime(get_datetime_format()),
            'category': Category.from_category_id(self.category_id).name,
            'status': self.status,
            'author_id': self.author_id,
            'binary_ids': self.binary_ids,
            'image_urls': self.image_urls
        }
        return json.dumps(d, indent=2)
    
    def append_binary(self, binary: Binary) -> None:
        self.binary_ids.append(binary.binary_id)
        sql = 'UPDATE packages SET binary_ids=%(binary_ids)s WHERE package_id=%(package_id)s'
        run_sql_with_param(
            sql, {'binary_ids': self.binary_ids, 'package_id': self.package_id})

    def append_image(self, image: Image) -> None:
        self.image_urls.append(image.url)
        sql = 'UPDATE packages SET image_urls=%(image_urls)s WHERE package_id=%(package_id)s'
        run_sql_with_param(
            sql, {'image_urls': self.image_urls, 'package_id': self.package_id})

    def to_pb(self) -> san11_platform_pb2.Package:
        return san11_platform_pb2.Package(
            package_id=self.package_id,
            name=self.name,
            description=self.description,
            create_timestamp=self.create_timestamp.strftime(get_datetime_format()),
            category_id=self.category_id,
            status=self.status,
            author_id=self.author_id,
            binary_ids=self.binary_ids,
            image_urls=self.image_urls
        )

    def update(self):
        sql = 'UPDATE packages SET'\
            ' name=%(name)s'\
            ',description=%(description)s'\
            ',status=%(status)s'\
            ',binary_ids=%(binary_ids)s'\
            ',image_urls=%(image_urls)s'\
            ',tags=%(tags)s'\
            ' WHERE package_id=%(package_id)s'

        run_sql_with_param(sql, {
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'binary_ids': self.binary_ids,
            'image_urls': self.image_urls,
            'tags': self.tags,

            'package_id': self.package_id
        })

    def delete(self):
        for image_url in self.image_urls:
            try:
                Image.from_url(image_url).delete()
            except Exception:
                logger.error(f'Failed to delete image: image_url={image_url}')
        
        for binary_id in self.binary_ids:
            try:
                Binary.from_binary_id(binary_id).delete()
            except Exception:
                logger.error(f'Failed to delete binary: binary_id={binary_id}')

        sql = 'DELETE FROM packages WHERE package_id=%(package_id)s'
        run_sql_with_param(sql, {'package_id': self.package_id})

        try:
            # To remove the entire dir
            shutil.rmtree(get_resource_path(self.url))
        except Exception as err:
            logger.error(f'Failed remove {self.url}: {err}')

    @classmethod
    def create(cls, name: str, description: str,
               category_id: int,
               status: str, author_id: int, binary_ids: List[int],
               image_urls: List[int], tags: List[str]) -> Package:
        current_timestamp = datetime.now(get_timezone())
        sql = 'INSERT INTO packages VALUES (DEFAULT, %(name)s, %(description)s,'\
            '%(create_timestamp)s, %(category_id)s, %(status)s,'\
            ' %(author_id)s, %(binary_ids)s, %(image_urls)s, %(tags)s) RETURNING package_id'

        resp = run_sql_with_param_and_fetch_one(sql, {
            'name': name,
            'description': description,
            'create_timestamp': current_timestamp,
            'category_id': category_id,
            'status': status,
            'author_id': author_id,
            'binary_ids': binary_ids,
            'image_urls': image_urls,
            'tags': tags
        })

        return cls(resp[0], name, description, current_timestamp, category_id,
                   status, author_id, binary_ids, image_urls, tags)
    
    @classmethod
    def create_from_pb(cls, pb_obj: san11_platform_pb2.Package, author_id: int):
        return cls.create(
            name=pb_obj.name,
            description=pb_obj.description,
            category_id=pb_obj.category_id,
            status='under_review',
            author_id=author_id,
            binary_ids=[],
            image_urls=[],
            tags=[]
        )

    @classmethod
    def from_package_id(cls, package_id: int) -> Package:
        sql = 'SELECT * FROM packages WHERE package_id=%(package_id)s'
        resp = run_sql_with_param_and_fetch_one(
            sql, {'package_id': package_id})
        return cls(*resp)

    @classmethod
    def list_packages(cls, category_id: int) -> List[Package]:
        sql = 'SELECT * FROM packages WHERE category_id=%(category_id)s'
        resp = run_sql_with_param_and_fetch_all(sql, {
            'category_id': category_id,
        })
        return [Package(*item) for item in resp]
