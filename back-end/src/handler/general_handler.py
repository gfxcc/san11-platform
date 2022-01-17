import logging
import os

from .model.statistic import Statistic

logger = logging.getLogger(os.path.basename(__file__))


class GeneralHandler:
    def get_statistic(self, request, context):
        logger.info(f'In GetStatistic')
        # TODO hardcoded to today's information for now
        try:
            Statistic.load_today().increment_visit()
        except Exception:
            pass
        return Statistic.load_today().to_pb()
