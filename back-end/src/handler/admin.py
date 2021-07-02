import sys, os
import logging
import json


from .lib.protos import san11_platform_pb2
from .lib.auths import Authenticator
from .lib.statistic import Statistic
from .lib.package import Package
from .lib.db import run_sql_with_param_and_fetch_all


logger = logging.getLogger(os.path.basename(__file__))


class AdminHandler:
    def get_admin_message(self, request, context):
        message = {}
        authenticate = Authenticator.from_context(context)
        assert authenticate.isAdmin()
        sql = 'SELECT username, create_timestamp FROM users ORDER BY create_timestamp desc limit 10'
        message['new-users'] = list(map(lambda fields: ', '.join(map(str, fields)), run_sql_with_param_and_fetch_all(sql, {})))
        sql = 'SELECT name, create_time FROM packages ORDER BY create_time desc limit 10'
        message['new-packages'] = list(map(lambda fields: ', '.join(map(str, fields)), run_sql_with_param_and_fetch_all(sql, {})))
        sql = 'SELECT parent, text, create_time FROM comments ORDER BY create_time desc limit 5'
        message['new-comments'] = list(map(lambda fields: ', '.join(map(str, fields)), run_sql_with_param_and_fetch_all(sql, {})))
        sql = 'SELECT comment_id, text, create_time FROM replies ORDER BY create_time desc limit 5'
        message['new-replies'] = list(map(lambda fields: ', '.join(map(str, fields)), run_sql_with_param_and_fetch_all(sql, {})))
        return san11_platform_pb2.AdminMessage(
            message=json.dumps(message, indent=4, ensure_ascii=False)
        )