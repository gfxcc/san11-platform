from __future__ import annotations

import logging
import os
import re
from dataclasses import dataclass
from enum import Enum, auto
from typing import List, Optional, Tuple, Union

logger = logging.getLogger(os.path.basename(__file__))

_FILTER_ITEM_PATTERN = r'(?P<field_name>\w+) ?(?P<comp_op>=|!=|<|>|<=|>=|:) ?(?P<value>("[\w */]+"|[0-9.]+|true|false))'

# def parse_order_by(cls: type, order_by: str) -> Iterable[Tuple[str, str]]:
#     '''
#     Input:
#         cls: class of resource class.
#     Returns:
#         parsed_order_by: [[field_name, order], [field_name, order]].
#             E.g. [('create_time', 'desc'), ('download_count', '')]
#     '''
#     proto2db = {}
#     for attribute in attr.fields(cls):
#         if not (base_proto._is_proto_field(attribute) and _is_db_field(attribute)):
#             continue
#         proto2db[base_proto._get_proto_path(
#             attribute)] = _get_db_path(attribute)
class OrderOptions(Enum):
    ASCENDING = 1
    DESCENDING = auto()

    def __str__(self) -> str:
        if self == OrderOptions.ASCENDING:
            return ''
        elif self == OrderOptions.DESCENDING:
            return 'DESC'
        else:
            raise ValueError('Unsupported OrderOptions')



@dataclass
class OrderByItem:
    field_name: str
    order: OrderOptions

    @classmethod
    def from_str(cls, order_by: str) -> List[OrderByItem]:
        '''
        Args:
            order_by: E.g. "create_time", "create_time desc, download_count"
        '''
        ret = []
        for segment in order_by.split(','):
            if not segment:
                continue
            segment = segment.strip()
            field_name = segment.split()[0]
            order = OrderOptions.DESCENDING if segment.upper().endswith(' DESC') else OrderOptions.ASCENDING
            ret.append(cls(field_name, order))

        return ret


# def parse_filter(cls: type, filter: str) -> Dict:
#     '''
#     '''
#     proto2db = {}
#     for attribute in attr.fields(cls):
#         if not (base_proto._is_proto_field(attribute) and _is_db_field(attribute)):
#             continue
#         proto2db[base_proto._get_proto_path(
#             attribute)] = _get_db_path(attribute)


class Comp_Op(Enum):
    EQ = 1
    NOT_EQ = auto()
    LESS = auto()
    GREATER = auto()
    LESS_EQUAL = auto()
    GREATER_EQUAL = auto()
    HAS = auto()

    def __str__(self) -> str:
        if self == Comp_Op.EQ:
            return '='
        elif self == Comp_Op.NOT_EQ:
            return '!='
        elif self == Comp_Op.LESS:
            return '<'
        elif self == Comp_Op.GREATER:
            return '>'
        elif self == Comp_Op.LESS_EQUAL:
            return '<='
        elif self == Comp_Op.GREATER_EQUAL:
            return '>='
        elif self == Comp_Op.HAS:
            return ':'
        else:
            raise ValueError('Unsupported Comp_Op')

    @classmethod
    def from_str(cls, s: str) -> Comp_Op:
        if s == '=':
            return Comp_Op.EQ
        elif s == '!=':
            return Comp_Op.NOT_EQ
        elif s == '<':
            return Comp_Op.LESS
        elif s == '>':
            return Comp_Op.GREATER
        elif s == '<=':
            return Comp_Op.LESS_EQUAL
        elif s == '>=':
            return Comp_Op.GREATER_EQUAL
        elif s == ':':
            return Comp_Op.HAS
        else:
            raise ValueError(f'Not supported Comp_Op: {s}')


class Logic_Op(Enum):
    AND = 1
    OR = auto()

    def __str__(self) -> str:
        if self == Logic_Op.AND:
            return 'AND'
        elif self == Logic_Op.OR:
            return 'OR'
        else:
            raise ValueError(f'Unsupported Logic_Op')

    @classmethod
    def from_str(cls, s: str) -> Logic_Op:
        s = s.upper()
        if s == 'AND':
            return Logic_Op.AND
        elif s == 'OR':
            return Logic_Op.OR
        else:
            raise ValueError(f'Unsupported Logic_Op: {s}')


@dataclass(eq=True)
class FilterItem:
    field_name: str
    comp_op: Comp_Op
    value: Union[int, str, bool]

    @classmethod
    def from_str(cls, data: str) -> FilterItem:
        '''
        Args:
            data: 
                E.g. 
                - `create_time > "2021-07-20 10:43:28.313033+08:00"`
                - `author_id = 123`
                - `package_name = "*三国*"`
        '''
        if match := re.fullmatch(_FILTER_ITEM_PATTERN, data):
            field_name, comp_op, value = match['field_name'], Comp_Op.from_str(
                match['comp_op']), match['value']
        else:
            raise ValueError(f'Invalud element in Filter: {data}')

        if value[0] == value[-1] == '"':
            value = value[1:-1]
        elif value == 'true':
            value = True
        elif value == 'false':
            value = False
        else:
            value = int(value)
        
        return cls(
            field_name=field_name,
            comp_op=comp_op,
            value=value,
        )


@dataclass
class FilterExpr:
    logic_op: Optional[Logic_Op]
    value: Union[FilterItem, List[FilterExpr]]

    @classmethod
    def from_str(cls, data: str) -> FilterExpr:
        # if
        try:
            item = FilterItem.from_str(data)
            return FilterExpr(
                logic_op=None,
                value=item,
            )
        except Exception:
            pass

        def find_next_expr(data: str) -> Tuple[Optional[Logic_Op], str, str]:
            if data.startswith('AND'):
                logic_op = Logic_Op.AND
                data = data[3:]
            elif data.startswith('OR'):
                logic_op = Logic_Op.OR
                data = data[2:]
            else:
                logic_op = None

            data = data.strip()
            if data.startswith('('):
                cur, level = 1, 1
                while cur < len(data) and level != 0:
                    if data[cur] == '(':
                        level += 1
                    elif data[cur] == ')':
                        level -= 1
                    cur += 1
                next_expr, rest = data[1:cur-1], data[cur:]
            else:
                m = re.search(r'^' + _FILTER_ITEM_PATTERN, data)
                if m is None:
                    raise ValueError(
                        f'Can not find next filter exper: {data}')
                next_expr, rest = m[0], data[len(m[0]):]
            return logic_op, next_expr.strip(), rest.strip()

        sub_exprs = []
        while data:
            logic_op, sub_expr_str, data = find_next_expr(data)
            sub_expr = FilterExpr.from_str(sub_expr_str)
            sub_expr.logic_op = logic_op
            sub_exprs.append(sub_expr)

        return FilterExpr(
            logic_op=None,
            value=sub_exprs,
        )
