import sys, os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging


from lib.protos import san11_platform_pb2
from lib.auths import Authenticator, Session
from lib.statistic import Statistic
from lib.exception import Unauthenticated


logger = logging.getLogger(os.path.basename(__file__))


class GeneralHandler:
    def get_statistic(self, request, context):
        logger.info(f'In GetStatistic')
        # TODO hardcoded to today's information for now
        try:
            user = Authenticator.from_context(context=context).session.user
        except Exception:
            user = None
        if user is None or user.username != 'admin':
            Statistic.load_today().increment_visit()
        return Statistic.load_today().to_pb()