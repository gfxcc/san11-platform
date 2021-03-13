import os
import logging
from datetime import date

from .protos import san11_platform_pb2
from .db_util import run_sql_with_param_and_fetch_one, run_sql_with_param
from .time_util import get_today


logger = logging.getLogger(os.path.basename(__file__))


class Statistic:
    def __init__(self, date: date, visit_count: int, download_count: int):
        self.date = date
        self.visit_count = visit_count
        self.download_count = download_count
    
    def increment_visit(self, delta: int=1) -> int:
        self.visit_count += 1
        sql = 'UPDATE statistics SET visit_count=%(visit_count)s WHERE date=%(date)s'
        run_sql_with_param(sql, {'visit_count': self.visit_count,
                                 'date': self.date})

    def increment_download(self, delta: int=1) -> int:
        self.download_count += 1
        sql = 'UPDATE statistics SET download_count=%(download_count)s WHERE date=%(date)s'
        run_sql_with_param(sql, {'download_count': self.download_count,
                                 'date': self.date})
    
    def to_pb(self) -> san11_platform_pb2.Statistic:
        return san11_platform_pb2.Statistic(
            visit_count=self.visit_count,
            download_count=self.download_count
        )

    @classmethod
    def from_date(cls, date: date):
        sql = 'SELECT visit_count, download_count FROM statistics WHERE date=%(date)s'
        resp = run_sql_with_param_and_fetch_one(sql, {'date': date})
        if not resp:
            raise KeyError(f'Statistic on {date} is not found')
        return cls(date, resp[0], resp[1])

    @classmethod
    def load_today(cls):
        '''
        Load statistic for today.
        Create an db entry if not existing.
        '''
        try:
            obj = cls.from_date(get_today())
        except KeyError:
            obj = cls._create_today()
        return obj
    
    @classmethod
    def _create_today(cls):
        sql = 'INSERT INTO statistics (date, visit_count, download_count) VALUES (%(date)s, 0, 0)'
        today = get_today()
        run_sql_with_param(sql, {'date': today})
        return cls(today, 0, 0)