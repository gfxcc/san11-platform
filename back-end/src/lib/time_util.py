from datetime import timezone, datetime


def get_datetime_format() -> str:
    # e.g. '2021-03/12-15:55 UTC'
    return f'%Y-%m/%d-%H:%M %Z'


def get_timezone() -> timezone:
    return timezone.utc