import sys, os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging
import json


from lib.protos import san11_platform_pb2
from lib.auths import Authenticator
from lib.statistic import Statistic
from lib.db import run_sql_with_param_and_fetch_all


logger = logging.getLogger(os.path.basename(__file__))


class AdminHandler:
    def get_admin_message(self, request, context):
        message = {}
        authenticate = Authenticator.from_context(context)
        sql = 'SELECT username, create_timestamp FROM users ORDER BY create_timestamp desc limit 20'
        message['new-users'] = list(map(lambda fields: ', '.join(map(str, fields)), run_sql_with_param_and_fetch_all(sql, {})))
        sql = 'SELECT name, create_time FROM packages ORDER BY create_time desc limit 10'
        message['new-packages'] = list(map(lambda fields: ', '.join(map(str, fields)), run_sql_with_param_and_fetch_all(sql, {})))
        return san11_platform_pb2.AdminMessage(
            message=json.dumps(message, indent=4)
        )