import re
from typing import List

import html2text

from handler.common.env import Env, get_env


def get_text_from_html(html: str) -> str:
    h = html2text.HTML2Text()
    h.ignore_links = True
    return h.handle(html)


def get_mentioned_users(content: str) -> List[int]:
    '''Get a list of user_id from user mentioned in the content.'''
    ret = []
    # A sample of @user element `<a class="mention" href="users/73">@一笑悬命</a>`
    pattern = r'<a [^>]* href="users/(?P<user_id>[0-9]+)">@(?P<username>[^<]+)</a>'
    for at_user_id, at_username in re.findall(pattern, content):
        ret.append(int(at_user_id))
    return ret


def get_server_url() -> str:
    if get_env() == Env.DEV:
        return 'http://localhost:4200'
    return 'https://san11pk.org'
