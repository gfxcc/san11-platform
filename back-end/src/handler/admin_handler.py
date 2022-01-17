import json
import logging
import os

from .db.db_util import run_sql_with_param_and_fetch_all
from .protos import san11_platform_pb2

logger = logging.getLogger(os.path.basename(__file__))


class AdminHandler:
    def get_admin_message(self, request, context):
        message = {}
        sql = 'SELECT username, create_timestamp FROM users ORDER BY create_timestamp desc limit 10'
        message['new-users'] = list(map(lambda fields: ', '.join(
            map(str, fields)), run_sql_with_param_and_fetch_all(sql, {})))
        sql = 'SELECT name, create_time FROM packages ORDER BY create_time desc limit 10'
        message['new-packages'] = list(map(lambda fields: ', '.join(
            map(str, fields)), run_sql_with_param_and_fetch_all(sql, {})))
        return san11_platform_pb2.AdminMessage(
            message=json.dumps(message, indent=4, ensure_ascii=False)
        )
