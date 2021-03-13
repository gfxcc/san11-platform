from datetime import timezone, datetime, date


def get_datetime_format() -> str:
    # e.g. '2021-03/12-15:55 UTC'
    return f'%Y-%m/%d-%H:%M %Z'


def get_timezone() -> timezone:
    return timezone.utc


def get_today() -> date:
    return date.today()