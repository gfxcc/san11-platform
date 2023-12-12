import re
from typing import Iterable, List, Set

import html2text

from handler.common.env import Env, get_env


def get_text_from_html(html: str) -> str:
    h = html2text.HTML2Text()
    h.ignore_links = True
    return h.handle(html)


def get_mentioned_users(content: str) -> Set[str]:
    '''Get a list of usernames from user mentioned in the content.'''
    ret = set()
    # A sample of @user element `<a class="mention" href="users/73">@一笑悬命</a>`
    pattern = r'<a [^>]* href="users/(?P<user_id>[0-9]+)">@(?P<username>[^<]+)</a>'
    for at_user_id, at_username in re.findall(pattern, content):
        ret.add(at_username)
    
    # A sample of vanilla @user text `@username:`
    pattern = r'@(?P<username>[^@#$%^&*()=+{}\[\]|\\:<>?]+):'
    for at_username in re.findall(pattern, content):
        ret.add(at_username)

    return ret
