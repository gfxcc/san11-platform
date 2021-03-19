import os
import logging
import psycopg2
import os
import os.path
import errno
from typing import Any, Iterable, List
from datetime import datetime

from .protos import san11_platform_pb2
from .db_util import run_sql_with_param_and_fetch_one, run_sql_with_param, run_sql_with_param_and_fetch_all
from .version import Version
from .resource import get_resource_path, get_binary_url, create_resource
from .url import Url
from .time_util import get_datetime_format, get_timezone


logger = logging.getLogger(os.path.basename(__file__))


class Binary:
    def __init__(self, binary_id: int, package_id: int, url: str, download_count: int,
                 version: Version, description: str,
                 create_timestamp: datetime, tag: str):
        self.binary_id = binary_id
        self.package_id = package_id
        self.url = url
        self.download_count = download_count
        self.version = version
        self.description = description
        self.create_timestamp = create_timestamp
        self.tag = tag

    def __str__(self):
        return f'{{binary_id: {self.binary_id}, url: {self.url}}}'

    @property
    def version(self) -> Version:
        return self._version

    @version.setter
    def version(self, version):
        if isinstance(version, str):
            self._version = Version.from_str(version)
        elif isinstance(version, Version):
            self._version = version
        else:
            raise ValueError(f'Invalid version: {version}')

    def download(self) -> bytes:
        '''
        Return the data and increment the download_count by 1
        '''
        self._increment_download_count()
        logger.debug(f'{self} is downloaded')
        return self.to_pb()

    def delete(self) -> None:
        sql = 'DELETE FROM binaries WHERE binary_id=%(binary_id)s'
        run_sql_with_param(sql, {'binary_id': self.binary_id})
        self._remove_file()
        logger.debug(f'{self} is deleted')

    def _remove_file(self) -> None:
        os.remove(get_resource_path(self.url))

    def to_pb(self) -> san11_platform_pb2.Binary:
        return san11_platform_pb2.Binary(
            binary_id=self.binary_id,
            url=self.url,
            download_count=self.download_count,
            version=self.version.to_pb(),
            description=self.description,
            create_timestamp=self.create_timestamp.strftime(
                get_datetime_format()),
            tag=self.tag
        )

    @classmethod
    def from_pb(cls, obj):
        return cls(binary_id=obj.binary_id,
                   package_id=obj.package_id,
                   url=obj.url,
                   download_count=obj.download_count or 0,
                   version=Version.from_pb(obj.version),
                   description=obj.description,
                   create_timestamp=obj.create_timestamp,
                   tag=obj.tag)

    @classmethod
    def from_binary_id(cls, binary_id):
        sql = 'SELECT package_id, url, download_count, version, description, create_timestamp, tag FROM binaries WHERE binary_id=%(binary_id)s'
        resp = run_sql_with_param_and_fetch_one(sql, {'binary_id': binary_id})
        if resp is None:
            raise LookupError(f'Invalid binary_id:{binary_id}')
        return cls(binary_id, *resp)

    @classmethod
    def createc_under_parent(cls, parent: str, pb_obj: san11_platform_pb2.Binary, data: bytes):
        def get_binary_filename(parent: Url, version: Version):
            category_to_extension = {
                1: 'scp',  # SIRE plugin
                2: 'rar',  # Player tools
                3: 'rar'  # Mods
            }
            logger.debug(f'get_binary_filename({parent}, {version})')
            assert parent.type == 'packages'
            filename = f'{version}.{category_to_extension[parent.category_id]}'
            return filename

        obj = cls.from_pb(pb_obj)
        obj.url = get_binary_url(
            parent, get_binary_filename(Url(parent), obj.version))

        sql = 'INSERT INTO binaries (package_id, url, download_count, version, description, create_timestamp, tag) VALUES '\
            '(%(package_id)s, %(url)s, %(download_count)s, %(version)s, %(description)s, %(create_timestamp)s, %(tag)s) returning binary_id'
        binary_id = run_sql_with_param_and_fetch_one(sql, {
            'package_id': Url(parent).package_id,
            'url': obj.url,
            'download_count': obj.download_count,
            'version': str(obj.version),
            'description': pb_obj.description,
            'create_timestamp': datetime.now(get_timezone()),
            'tag': pb_obj.tag
        })[0]
        obj.binary_id = binary_id
        create_resource(obj.url, data)
        return obj

    @classmethod
    def from_package_id(cls, package_id: int) -> List:
        sql = 'SELECT * FROM binaries WHERE package_id=%(package_id)s'
        resp = run_sql_with_param_and_fetch_all(
            sql, {'package_id': package_id})
        return sorted([cls(*item) for item in resp],
                      key=lambda binary: binary.create_timestamp or datetime.now(
                          get_timezone()),
                      reverse=True)

    def _increment_download_count(self):
        sql = 'UPDATE binaries SET download_count=download_count+1 WHERE binary_id=%(binary_id)s'
        run_sql_with_param(sql, {'binary_id': self.binary_id})
