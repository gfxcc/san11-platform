import os
import psycopg2
from retry import retry


from typing import List, Tuple, Dict



class DbConnect:
    def __init__(self):
        self.conn = psycopg2.connect(host="db", database=os.environ['DB_NAME'], user=os.environ['DB_USER'], password=os.environ['DB_PASSWORD'])

    def get_conn(self):
        return self.conn    
    
    def reconnect(self):
        self.conn = psycopg2.connect(host="db", database=os.environ['DB_NAME'], user=os.environ['DB_USER'], password=os.environ['DB_PASSWORD'])
    

DB_CONN = DbConnect()


@retry(Exception, tries=2)
def run_sql_with_param(sql: str, param: Dict) -> List[Tuple]:
    try:
        with DB_CONN.get_conn() as db_conn:
            with db_conn.cursor() as cursor:
                cursor.execute(sql, param)
    except psycopg2.InterfaceError:
        DB_CONN.reconnect()
        raise


@retry(Exception, tries=2)
def run_sql_with_param_and_fetch_all(sql: str, param: Dict) -> List[Tuple]:
    try:
        with DB_CONN.get_conn() as db_conn:
            with db_conn.cursor() as cursor:
                cursor.execute(sql, param)
                resp = cursor.fetchall()
        return resp
    except psycopg2.InterfaceError:
        DB_CONN.reconnect()
        raise


@retry(Exception, tries=2)
def run_sql_with_param_and_fetch_one(sql: str, param: Dict) -> List[Tuple]:
    try:
        with DB_CONN.get_conn() as db_conn:
            with db_conn.cursor() as cursor:
                cursor.execute(sql, param)
                resp = cursor.fetchone()
        return resp
    except psycopg2.InterfaceError:
        DB_CONN.reconnect()
        raise


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
    return ','.join(f'%({field})s' for field in fields)


def sanitize_str(input: str) -> str:
    '''
    Remove characters which could be used for SQL injection.
    '''
    remove_set = {'\'', '\"', '%', '\0', '\\', '\t', '\r', '\n', '\b'}
    ret = ''
    for c in input:
        ret += c if c not in remove_set else ''
    return ret
