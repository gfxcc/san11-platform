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

