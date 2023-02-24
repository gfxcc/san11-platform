import logging
import os
import secrets
import string
from abc import ABC, abstractclassmethod
from dataclasses import dataclass
from typing import Any, Dict, List, Tuple, Union

# TODO: Split common into a separate lib
from .....common.exception import InvalidArgument
from .list_options import ListOptions
from .parser import Comp_Op, FilterExpr, FilterItem, Logic_Op, OrderByItem

logger = logging.getLogger(os.path.basename(__file__))


@dataclass
class FieldTrait:
    name: str
    is_repeated: bool
    type: Any


def _cast_json_field(field_name: str, field_type: Any) -> str:
    if field_type is bool:
        field_part = f"(data->>'{field_name}')::boolean"
    elif field_type is int:
        field_part = f"(data->>'{field_name}')::int"
    else:
        field_part = f"data->>'{field_name}'"
    return field_part


class DbAdaptor(ABC):
    def __init__(self, db_fields_dict: Dict[str, FieldTrait]):
        self._db_fields_dict = db_fields_dict

    def gen_order_by(self, list_options: ListOptions) -> str:
        '''
        Generate a SQL order by statement which can be used by postgres.
        '''
        ...

    def gen_where(self, list_options: ListOptions) -> Tuple[str, Dict]:
        '''
        Generate a SQL where statement which can be used by postgres.
        '''
        ...

    def gen_limit(self, list_options: ListOptions) -> str:
        '''
        Generate a SQL limit statement which can be used by postgres.
        '''

    def get_field_trait(self, field_name: str) -> FieldTrait:
        return self._db_fields_dict.get(field_name, FieldTrait(name=field_name, is_repeated=False, type=str))


class PostgresAdaptor(DbAdaptor):
    FUZZY_MATCH_PATTERN = '*'

    def gen_order_by(self, list_options: ListOptions) -> str:
        if not list_options.order_by:
            return ''
        order_by_items = OrderByItem.from_str(list_options.order_by)
        orders_str = []
        for item in order_by_items:
            s = f"data->>'{item.field_name}'"
            field_trait = self.get_field_trait(item.field_name)
            s = _cast_json_field(item.field_name, field_trait.type)
            if o := str(item.order):
                s += f' {o}'
            orders_str.append(s)
        return 'ORDER BY ' + ', '.join(orders_str)

    def gen_where(self, list_options: ListOptions) -> Tuple[str, Dict]:
        parts = []
        params: Dict[str, Union[int, str, bool]] = {}
        if list_options.parent is not None:
            parts.append('parent = %(parent)s')
            params = {'parent': list_options.parent}

        def gen(expr: FilterExpr) -> str:
            if isinstance(expr.value, FilterItem):
                item = expr.value
                field_name, comp_op_str, value = item.field_name, str(
                    item.comp_op), item.value
                # To disambiguite filed_name in the case where the same field name is used
                # in where statement multiple times.
                # E.g. `name='a' OR name='b'`
                casted_field_name = f'{field_name}_{gen_random_str()}'
                field_trait = self.get_field_trait(item.field_name)
                if field_trait.is_repeated:
                    if item.comp_op != Comp_Op.HAS:
                        raise InvalidArgument(
                            f'{item.field_name} is a repeated fields which only accept `:` operation')
                    # https://www.postgresql.org/docs/9.5/functions-json.html
                    params[casted_field_name] = value
                    return f"(data->'{field_name}')::jsonb ? %({casted_field_name})s"
                else:
                    field_part = _cast_json_field(field_name, field_trait.type)
                    if isinstance(value, str) and self.FUZZY_MATCH_PATTERN in value:
                        value = value.replace('*', '%')
                        comp_op_str = 'LIKE'
                    else:
                        comp_op_str = str(item.comp_op)
                    params[casted_field_name] = value
                    return f"{field_part} {comp_op_str} %({casted_field_name})s"
            statement = ''
            for sub_expr in expr.value:
                if sub_expr.logic_op:
                    statement += f' {sub_expr.logic_op} '
                statement += f'({gen(sub_expr)})'
            return statement
        if list_options.filter:
            parts.append(gen(FilterExpr.from_str(list_options.filter)))

        if not parts:
            return '', {}
        return 'WHERE ' + ' AND '.join(parts), params

    def gen_limit(self, list_options: ListOptions) -> str:
        limit, offset = list_options.page_size, int(
            list_options.watermark) if list_options.watermark else 0
        return f'LIMIT {limit} OFFSET {offset}'


def gen_random_str(l: int = 8) -> str:
    '''Generate a random string'''
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for i in range(l))
