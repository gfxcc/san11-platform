from datetime import datetime, date, tzinfo
from pytz import timezone


def get_datetime_format() -> str:
    # e.g. '2021-03/12-15:55 UTC'
    return f'%Y-%m-%d-%H:%M'

def datetime_to_str(dt: datetime) -> str:
    return dt.astimezone(get_timezone()).strftime(get_datetime_format())

def get_age(dt: datetime) -> str:
    '''
    Return its "age" as a string. Exact datetime will be return if its age is 
      larger than 1 year. 
    E.g. 
      2小时前
      1天前
      2个月前
    '''
    delta = datetime.now(get_timezone()) - dt 
    if delta.days > 365:
        return datetime_to_str(dt)
    elif delta.days >= 30:
        return f'{delta.days//30}月前'
    elif delta.days >= 1:
        return f'{delta.days}天前'
    elif delta.seconds >= 60 * 60:
        return f'{delta.seconds // (60 * 60)}小时前'
    elif delta.seconds >= 60:
        return f'{delta.seconds // 60}分钟前'
    else:
        return f'{delta.seconds//1}秒前'


def get_timezone() -> tzinfo:
    return timezone('Asia/Shanghai')


def get_today() -> date:
    return datetime.now(get_timezone()).date()


def get_now() -> datetime:
    return datetime.now(get_timezone())

