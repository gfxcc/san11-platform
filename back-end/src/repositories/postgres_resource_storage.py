from __future__ import annotations

import json
from typing import Dict, List, Optional, Tuple

from integrations.db.db_util import (auto_adjust_resource_id_next_val,
                                run_sql_with_param,
                                run_sql_with_param_and_fetch_all,
                                run_sql_with_param_and_fetch_one)


class PostgresResourceStorage:
    def get(self, table: str, parent: Optional[str], resource_id: int) -> Optional[Dict]:
        sql = f'SELECT data FROM {table} WHERE parent=%(parent)s AND resource_id=%(resource_id)s'
        row = run_sql_with_param_and_fetch_one(sql, {
            'parent': parent,
            'resource_id': resource_id,
        })
        return row[0] if row else None

    def list(self, table: str, where_statement: str, order_statement: str,
             limit_statement: str, params: Dict) -> List[Tuple]:
        sql = f"SELECT data FROM {table} {where_statement} {order_statement} {limit_statement}"
        return run_sql_with_param_and_fetch_all(sql, params)

    def exists(self, table: str, parent: Optional[str], resource_id: int) -> bool:
        sql = f'SELECT count(*) FROM {table} WHERE parent=%(parent)s AND resource_id=%(resource_id)s'
        row = run_sql_with_param_and_fetch_one(sql, {
            'parent': parent,
            'resource_id': resource_id,
        })
        return row[0] == 1

    def insert(self, table: str, parent: Optional[str], data: Dict,
               resource_id: Optional[int] = None) -> int:
        if resource_id is None:
            sql = f"INSERT INTO {table} (parent, data) VALUES (%(parent)s, %(data)s) RETURNING resource_id"
            row = run_sql_with_param_and_fetch_one(sql, {
                'parent': parent,
                'data': json.dumps(data, default=str),
            })
            return row[0]

        sql = f"INSERT INTO {table} (parent, resource_id, data) VALUES (%(parent)s, %(resource_id)s, %(data)s)"
        run_sql_with_param(sql, {
            'parent': parent,
            'resource_id': resource_id,
            'data': json.dumps(data, default=str),
        })
        auto_adjust_resource_id_next_val(table)
        return resource_id

    def update(self, table: str, parent: Optional[str], resource_id: int,
               data: Dict) -> None:
        sql = f"UPDATE {table} SET data=%(data)s WHERE parent=%(parent)s AND resource_id=%(resource_id)s"
        run_sql_with_param(sql, {
            'parent': parent,
            'resource_id': resource_id,
            'data': json.dumps(data, default=str),
        })

    def delete(self, table: str, parent: Optional[str], resource_id: int) -> None:
        sql = f'DELETE FROM {table} WHERE parent=%(parent)s AND resource_id=%(resource_id)s'
        run_sql_with_param(sql, {
            'parent': parent,
            'resource_id': resource_id,
        })
