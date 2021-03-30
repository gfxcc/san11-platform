import os
import json
import logging
from typing import Dict, Tuple

from .user import User


logger = logging.getLogger(os.path.basename(__file__))


class Query:
    PARM_TRANSFORMER = {
        'author_name': ('author_id', lambda username: User.from_name(username).user_id)
    }

    def __init__(self, params: Dict):
        self.params = params
        logger.debug(f'Query={self} is created')

    def __str__(self) -> str:
        return str(self.params)

    def to_sql(self) -> str:
        field_value_pairs = [self._get_field_value_pair(
            k, v) for k, v in self.params.items()]
        sql = ' AND '.join([f'{field}={value}' for field, value in field_value_pairs])
        logger.debug(f'{self} --to_sql() -> {sql}')
        return sql

    @classmethod
    def from_str(cls, raw_query: str):
        '''
        raw_query: a json string which contains search parameters
        Supported parameters:
          - author_name
        '''
        logger.debug(f'Query.from_str({raw_query})')
        query = json.loads(raw_query)
        params = {k: query[k] for k in cls.PARM_TRANSFORMER if k in query}
        return cls(params)

    def _get_field_value_pair(self, param: str, value: str) -> Tuple[str, str]:
        handler = self.PARM_TRANSFORMER[param]
        return handler[0], handler[1](value)
