from handler.model.model_comment import ModelComment
import sys, os
import logging
import json


from .protos import san11_platform_pb2
from .auths import Authenticator
from .model.statistic import Statistic
from .model.package import Package
from .db.db_util import run_sql_with_param_and_fetch_all


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
        return san11_platform_pb2.AdminMessage(
            message=json.dumps(message, indent=4, ensure_ascii=False)
        )