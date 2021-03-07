from __future__ import annotations
import os
import logging
import json
from typing import List, Any

from .protos import san11_platform_pb2
from .db_util import run_sql_with_param_and_fetch_one, run_sql_with_param, \
    run_sql_with_param_and_fetch_all
from .image import Image
from .category import PrimaryCategory, SecondaryCategory, Category
from .binary import Binary


logger = logging.getLogger(os.path.basename(__file__))


class Package:
    def __init__(self, package_id: int, name: str, description: str,
                 primary_category: str, secondary_category: str,
                 status: str, author_id: int, binary_ids: List[int],
                 image_ids: List[int]) -> None:
        self.package_id = package_id
        self.name = name
        self.description = description
        self.primary_category = primary_category
        self.secondary_category = secondary_category
        self.status = status
        self.author_id = author_id
        self.binary_ids = binary_ids
        self.image_ids = image_ids

    @property
    def primary_category(self):
        return self._primary_category

    @primary_category.setter
    def primary_category(self, primary_category: Any[int, str]):
        if isinstance(primary_category, int):
            self._primary_category = PrimaryCategory.id_to_name(
                primary_category)
        elif isinstance(primary_category, str):
            self._primary_category = primary_category
        else:
            raise ValueError('Invalid primary_category')

    @property
    def secondary_category(self):
        return self._secondary_category

    @secondary_category.setter
    def secondary_category(self, secondary_category: Any[int, str]):
        if isinstance(secondary_category, int):
            self._secondary_category = SecondaryCategory.id_to_name(
                secondary_category)
        elif isinstance(secondary_category, str):
            self._secondary_category = secondary_category
        else:
            raise ValueError('Invalid secondary_category')

    def __str__(self):
        d = {
            'package_id': self.package_id,
            'name': self.name,
            'description': self.description,
            'primary_category': self.primary_category,
            'secondary_category': self.secondary_category,
            'status': self.status,
            'author_id': self.author_id,
            'binary_ids': self.binary_ids,
            'image_ids': self.image_ids
        }
        return json.dumps(d, indent=2)
    
    def append_binary(self, binary: Binary) -> None:
        self.binary_ids.append(binary.binary_id)
        sql = 'UPDATE packages SET binary_ids=%(binary_ids)s WHERE package_id=%(package_id)s'
        run_sql_with_param(
            sql, {'binary_ids': self.binary_ids, 'package_id': self.package_id})

    def append_image(self, image: Image) -> None:
        self.image_ids.append(image.image_id)
        sql = 'UPDATE packages SET image_ids=%(image_ids)s WHERE package_id=%(package_id)s'
        run_sql_with_param(
            sql, {'image_ids': self.image_ids, 'package_id': self.package_id})

    def to_pb(self) -> san11_platform_pb2.Package:
        return san11_platform_pb2.Package(
            package_id=self.package_id,
            name=self.name,
            description=self.description,
            primary_category=self.primary_category,
            secondary_category=self.secondary_category,
            status=self.status,
            author_id=self.author_id,
            binary_ids=self.binary_ids,
            image_ids=self.image_ids
        )

    def update(self):
        sql = 'UPDATE packages SET'\
            ' name=%(name)s'\
            ',description=%(description)s'\
            ',status=%(status)s'\
            ',binary_ids=%(binary_ids)s'\
            ',image_ids=%(image_ids)s'\
            ' WHERE package_id=%(package_id)s'

        run_sql_with_param(sql, {
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'binary_ids': self.binary_ids,
            'image_ids': self.image_ids,

            'package_id': self.package_id
        })

    def delete(self):
        for image_id in self.image_ids:
            try:
                Image.from_image_id(image_id).delete()
            except Exception:
                logger.error(f'Failed to delete image: image_id={image_id}')

        # for binary_id in self.binary_ids:
        #     Bin

        sql = 'DELETE FROM packages WHERE package_id=%(package_id)s'
        run_sql_with_param(sql, {'package_id': self.package_id})

    @classmethod
    def create(cls, name: str, description: str,
               primary_category: str, secondary_category: str,
               status: str, author_id: int, binary_ids: List[int],
               image_ids: List[int]) -> Package:
        sql = 'INSERT INTO packages VALUES (DEFAULT, %(name)s, %(description)s,'\
            ' %(primary_category_id)s, %(secondary_category_id)s, %(status)s,'\
            ' %(author_id)s, %(binary_ids)s, %(image_ids)s) RETURNING package_id'

        resp = run_sql_with_param_and_fetch_one(sql, {
            'name': name,
            'description': description,
            'primary_category_id': PrimaryCategory.name_to_id(primary_category),
            'secondary_category_id': SecondaryCategory.name_to_id(secondary_category),
            'status': status,
            'author_id': author_id,
            'binary_ids': binary_ids,
            'image_ids': image_ids
        })

        return cls(resp[0], name, description, primary_category, secondary_category,
                   status, author_id, binary_ids, image_ids)

    @classmethod
    def from_package_id(cls, package_id: int) -> Package:
        sql = 'SELECT * FROM packages WHERE package_id=%(package_id)s'
        resp = run_sql_with_param_and_fetch_one(
            sql, {'package_id': package_id})
        return cls(*resp)

    @classmethod
    def list_packages(cls, primary_category: str, secondary_category: str) -> List[Package]:
        sql = 'SELECT * FROM packages WHERE primary_category_id=%(primary_category_id)s AND'\
              ' secondary_category_id=%(secondary_category_id)s'
        resp = run_sql_with_param_and_fetch_all(sql, {
            'primary_category_id': PrimaryCategory.name_to_id(primary_category),
            'secondary_category_id': SecondaryCategory.name_to_id(secondary_category)
        })
        return [Package(*item) for item in resp]
