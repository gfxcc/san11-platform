from __future__ import annotations
from pathlib import Path
import logging
import os, os.path
import errno
import uuid

from .protos import san11_platform_pb2
from .db_util import run_sql_with_param_and_fetch_one, run_sql_with_param
from .resource import get_images_path, get_resource_path, get_image_url, create_resource


logger = logging.getLogger(os.path.basename(__file__))


class Image:
    def __init__(self, url) -> None:
        self.url = url
    
    def __str__(self) -> str:
        return self.url
    
    def delete(self):
        os.remove(get_resource_path(self.url))
        logger.info(f'{self} is deleted')

    @classmethod
    def create(cls, url: str, data: bytes) -> Image:
        create_resource(url, data)
        return cls(url)
    
    @classmethod
    def create_without_filename(cls, parent: str, data: bytes) -> Image:
        def get_file_count(path: str) -> int:
            try:
                return len(os.listdir(path))
            except Exception:
                return 0
        file_count = uuid.uuid1()
        filename = f'{file_count}.jpeg'
        return cls.create(get_image_url(parent, filename), data)

    @classmethod
    def from_url(cls, url: str):
        return cls(url)
        
        
