from datetime import datetime, date, tzinfo
from pytz import timezone


def get_datetime_format() -> str:
    # e.g. '2021-03/12-15:55 UTC'
    return f'%Y-%m-%d-%H:%M'

def datetime_to_str(dt: datetime) -> str:
    return dt.astimezone(get_timezone()).strftime(get_datetime_format())

def get_timezone() -> tzinfo:
    return timezone('Asia/Shanghai')


def get_today() -> date:
    return datetime.now(get_timezone()).date()


def get_now() -> datetime:
    return datetime.now(get_timezone())
