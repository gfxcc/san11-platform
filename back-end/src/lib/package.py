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
                 status: str, author_id: int, 
                 image_urls: List[str], tags: List[str],
                 download_count: int) -> None:
        self.package_id = package_id
        self.name = name
        self.description = description
        self.create_timestamp = create_timestamp
        self.category_id = category_id
        self.status = status
        self.author_id = author_id
        self.image_urls = image_urls
        self.tags = tags
        self.download_count = download_count

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
            'image_urls': self.image_urls,
            'download_count': self.download_count,
        }
        return json.dumps(d, indent=2)
    
    def append_image(self, image: Image) -> None:
        self.image_urls.append(image.url)
        sql = 'UPDATE packages SET image_urls=%(image_urls)s WHERE package_id=%(package_id)s'
        run_sql_with_param(
            sql, {'image_urls': self.image_urls, 'package_id': self.package_id})
    
    def increment_download(self, delta: int=1) -> int:
        self.download_count += 1
        sql = 'UPDATE packages SET download_count=%(download_count)s WHERE package_id=%(package_id)s'
        run_sql_with_param(sql, {
            'download_count': self.download_count,
            'package_id': self.package_id
        })
        return self.download_count

    def to_pb(self) -> san11_platform_pb2.Package:
        return san11_platform_pb2.Package(
            package_id=self.package_id,
            name=self.name,
            description=self.description,
            create_timestamp=self.create_timestamp.strftime(get_datetime_format()),
            category_id=self.category_id,
            status=self.status,
            author_id=self.author_id,
            image_urls=self.image_urls,
            download_count=self.download_count
        )

    def update(self):
        sql = 'UPDATE packages SET'\
            ' name=%(name)s'\
            ',description=%(description)s'\
            ',status=%(status)s'\
            ',image_urls=%(image_urls)s'\
            ',tags=%(tags)s'\
            ' WHERE package_id=%(package_id)s'

        run_sql_with_param(sql, {
            'name': self.name,
            'description': self.description,
            'status': self.status,
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
        
        for binary in Binary.from_package_id(self.package_id):
            try:
                binary.delete()
            except Exception as err:
                logger.error(f'Failed to delete binary: binary={binary} err={err}')

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
               status: str, author_id: int, 
               image_urls: List[int], tags: List[str],
               download_count: int) -> Package:
        current_timestamp = datetime.now(get_timezone())
        sql = 'INSERT INTO packages (package_id, name, description, create_timestamp,'\
            ' category_id, status, author_id, image_urls, tags, download_count) VALUES '\
             '((SELECT MAX(package_id) FROM packages)+1, %(name)s, %(description)s,'\
            ' %(create_timestamp)s, %(category_id)s, %(status)s,'\
            ' %(author_id)s, %(image_urls)s, %(tags)s, %(download_count)s) RETURNING package_id'

        resp = run_sql_with_param_and_fetch_one(sql, {
            'name': name,
            'description': description,
            'create_timestamp': current_timestamp,
            'category_id': category_id,
            'status': status,
            'author_id': author_id,
            'image_urls': image_urls,
            'tags': tags,
            'download_count': download_count
        })

        return cls(resp[0], name, description, current_timestamp, category_id,
                   status, author_id, image_urls, tags, download_count)
    
    @classmethod
    def create_from_pb(cls, pb_obj: san11_platform_pb2.Package, author_id: int):
        return cls.create(
            name=pb_obj.name,
            description=pb_obj.description,
            category_id=pb_obj.category_id,
            status='under_review',
            author_id=author_id,
            image_urls=[],
            tags=[],
            download_count=pb_obj.download_count
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
        return sorted([Package(*item) for item in resp], key=lambda package: package.create_timestamp, reverse=True)

