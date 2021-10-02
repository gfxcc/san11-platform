from __future__ import annotations

import logging
import os
import os.path

from ..util import gcs

logger = logging.getLogger(os.path.basename(__file__))


class Image:
    def __init__(self, url) -> None:
        self.url = url

    def __str__(self) -> str:
        return self.url

    def delete(self):
        gcs.delete_resource(self.url)
        logger.info(f'{self} is deleted')

    @classmethod
    def from_url(cls, url: str):
        return cls(url)
