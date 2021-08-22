import logging
import os
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from retry import retry


from typing import Iterable, List, Tuple, Dict


# class DbConnect:
#     def __init__(self):
#         self.conn = psycopg2.connect(host=os.environ['DB_HOST'], database=os.environ['DB_NAME'],
#                                      user=os.environ['DB_USER'], password=os.environ['DB_PASSWORD'])
#         self.conn.autocommit = True

#     def get_conn(self):
#         return self.conn

#     def reconnect(self):
#         self.conn = psycopg2.connect(
#             host="db", database=os.environ['DB_NAME'], user=os.environ['DB_USER'], password=os.environ['DB_PASSWORD'])
#         self.conn.autocommit = True

# DB_CONN = DbConnect()

MIN_CONNECTION = 10
MAX_CONNECTION = 200

_pgpool: ThreadedConnectionPool = None


def pgpool() -> ThreadedConnectionPool:
    global _pgpool
    if not _pgpool:
        try:
            _pgpool = ThreadedConnectionPool(MIN_CONNECTION, MAX_CONNECTION, host="db", database=os.environ['DB_NAME'], user=os.environ['DB_USER'], password=os.environ['DB_PASSWORD'])
        except psycopg2.OperationalError as exc:
            _pgpool = None
    return _pgpool


def run_sql_with_param(sql: str, param: Dict) -> None:
    conn = pgpool().getconn()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, param)
    finally:
        conn.commit()
        pgpool().putconn(conn)


def run_sql_with_param_and_fetch_all(sql: str, param: Dict, transaction: bool = False) -> List[Tuple]:
    db_conn = pgpool().getconn()
    try:
        if not transaction:
            with db_conn.cursor() as cursor:
                cursor.execute(sql, param)
                resp = cursor.fetchall()
        else:
            with db_conn:
                with db_conn.cursor() as cursor:
                    cursor.execute(sql, param)
                    resp = cursor.fetchall()
        return resp
    finally:
        db_conn.commit()
        pgpool().putconn(db_conn)


def run_sql_with_param_and_fetch_one(sql: str, param: Dict, transaction: bool = False) -> List[Tuple]:
    db_conn = pgpool().getconn()
    try:
        if not transaction:
            with db_conn.cursor() as cursor:
                cursor.execute(sql, param)
                resp = cursor.fetchone()
        else:
            with db_conn:
                with db_conn.cursor() as cursor:
                    cursor.execute(sql, param)
                    resp = cursor.fetchone()
        return resp
    finally:
        db_conn.commit()
        pgpool().putconn(db_conn)


def get_db_fields_str(fields: List[str]) -> str:
    '''
    Return a string which represent a full list of db fields, which can be used
    in sql.
    E.g. `field1, field2, field3`
    '''
    return ','.join(fields)


def get_db_fields_placeholder_str(fields: List[str]) -> str:
    '''
    Return a string which represent a full list of db fields placeholder, which can be used
    in sql.
    E.g. `%(field1)s, %(field2)s, %(field3)s`
    '''
    return ', '.join(f'%({field})s' for field in fields)


def get_db_fields_assignment_str(fields: Iterable[str]) -> str:
    '''
    Return a string which can be used for UPDATE sql.
    E.g. `field1=%(field1)s, field2=%(field2)s, field3=%(field3)s`
    '''
    return ', '.join(f'{field}=%({field})s' for field in fields)


def sanitize_str(input: str) -> str:
    '''
    Remove characters which could be used for SQL injection.
    '''
    remove_set = {'\'', '\"', '%', '\0', '\\', '\t', '\r', '\n', '\b'}
    ret = ''
    for c in input:
        ret += c if c not in remove_set else ''
    return ret
