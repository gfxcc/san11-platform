from __future__ import annotations

import json
import logging
import os
import re
from dataclasses import dataclass
from enum import Enum, auto
from typing import Dict, List, Optional, Tuple, Union

import attr

from .....common.exception import InvalidArgument
from .pagination_option_pb2 import PaginationOption
from .parser import FilterExpr, OrderByItem

logger = logging.getLogger(os.path.basename(__file__))
DEFAULT_PAGE_SIZE = 10000
DEFAULT_ORDER_BY = 'create_time DESC'


@dataclass
class ListOptions:
    '''
    Args:
        parent: set to `None` to omit this fields.

        order_by: a list of field names starts from the most significant one. 
            `desc` can be passed to reverse the order.
            E.g. 
                - `create_time`
                - `create_time desc, download_count`

        filter: a list of expression in the syntax of `field_name OPERATION value`. 
            Supported `OPERATIONS` including 
                - `=`, `>`, `>=`, `<`, `<=` 
                - `~=`: if the `value` is a substring of given `field`.
            E.g. 
                - `create_time > '2021-07-20 10:43:28.313033+08:00'`.  
                - `author_id = 123 AND state = 1`
                - `package_name ~= "三国"`
    '''

    parent: Optional[str]
    page_size: int = DEFAULT_PAGE_SIZE
    watermark: int = 0
    order_by: str = ''
    filter: str = ''

    @classmethod
    def from_request(cls, request):
        '''
        Args:
            request: must contains fields `parent`, `page_size`, `page_token`, `order_by`, `filter`.
        '''
        parent = request.parent
        page_size = request.page_size or DEFAULT_PAGE_SIZE
        order_by = request.order_by or DEFAULT_ORDER_BY
        filter = request.filter

        def get_watermark(page_token: str) -> int:
            if not page_token:
                return 0
            try:
                prev_option = PaginationOption()
                prev_option.ParseFromString(page_token.encode())
                if prev_option.parent != parent or prev_option.filter != filter or prev_option.order_by != order_by:
                    raise InvalidArgument(f'Invalid page_token')
                return prev_option.watermark
            except Exception:
                j = json.loads(page_token)
                return int(j['watermark'])

        watermark = get_watermark(request.page_token)
        return cls(parent=parent,
                   page_size=page_size,
                   watermark=watermark,
                   order_by=order_by,
                   filter=filter)

    def to_token(self) -> str:
        return str(PaginationOption(
            parent=self.parent or '',
            page_size=self.page_size,
            watermark=self.watermark,
            order_by=self.order_by,
            filter=self.filter,
        ).SerializeToString())
    
    def parse_order_by(self) -> List[OrderByItem]:
        ...
    
    def parse_filter(self) -> FilterExpr:
        ...
