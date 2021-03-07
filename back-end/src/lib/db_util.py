import os
import psycopg2


from typing import List, Tuple, Dict

db_conn = psycopg2.connect(host="db", database=os.environ['DB_NAME'], user=os.environ['DB_USER'], password=os.environ['DB_PASSWORD'])
    

def run_sql_with_param(sql: str, param: Dict) -> List[Tuple]:
    with db_conn:
        with db_conn.cursor() as cursor:
            cursor.execute(sql, param)


def run_sql_with_param_and_fetch_all(sql: str, param: Dict) -> List[Tuple]:
    with db_conn:
        with db_conn.cursor() as cursor:
            cursor.execute(sql, param)
            resp = cursor.fetchall()
    return resp


def run_sql_with_param_and_fetch_one(sql: str, param: Dict) -> List[Tuple]:
    with db_conn:
        with db_conn.cursor() as cursor:
            cursor.execute(sql, param)
            resp = cursor.fetchone()
    return resp


