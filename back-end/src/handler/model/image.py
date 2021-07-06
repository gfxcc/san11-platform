from __future__ import annotations
import logging
import os, os.path
import uuid

from .resource import get_image_url
from ..util import gcs


logger = logging.getLogger(os.path.basename(__file__))


class Image:
    def __init__(self, url) -> None:
        self.url = url
    
    def __str__(self) -> str:
        return self.url
    
    def delete(self):
        gcs.delete_file(gcs.CANONICAL_BUCKET, self.url)
        logger.info(f'{self} is deleted')

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
        
        
