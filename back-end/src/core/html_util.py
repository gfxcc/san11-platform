import re
from dataclasses import dataclass
from html.parser import HTMLParser
from typing import Iterable, List, Optional, Set

import html2text

from core.common.env import Env, get_env


@dataclass(frozen=True)
class Mention:
    user_id: Optional[int]
    username: Optional[str]
    source: str


def get_text_from_html(html: str) -> str:
    h = html2text.HTML2Text()
    h.ignore_links = True
    return h.handle(html)


def get_mentioned_users(content: str) -> Set[str]:
    '''Get a list of usernames from user mentioned in the content.'''
    return {mention.username for mention in get_mentions(content)
            if mention.username}


def get_mentions(content: str) -> Set[Mention]:
    '''Get structured mentions from rich HTML and legacy plain text.'''
    ret = set(_MentionHTMLParser.parse(content))

    # Legacy reply syntax: `@username:`. Keep it for old rows and typed text.
    pattern = r'@(?P<username>[^@#$%^&*()=+{}\[\]|\\:<>?]+):'
    for at_username in re.findall(pattern, content or ''):
        ret.add(Mention(user_id=None, username=at_username.strip(),
                        source='legacy'))

    return ret


class _MentionHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.mentions: List[Mention] = []
        self._active_user_id: Optional[int] = None
        self._active_username_parts: List[str] = []

    @classmethod
    def parse(cls, content: str) -> List[Mention]:
        parser = cls()
        parser.feed(content or '')
        parser.close()
        return parser.mentions

    def handle_starttag(self, tag: str, attrs):
        if tag.lower() != 'a':
            return

        attr = dict(attrs)
        class_names = set((attr.get('class') or '').split())
        href = attr.get('href') or ''
        user_id = _parse_user_id(attr.get('data-user-id') or href)

        if 'mention' not in class_names and user_id is None:
            return

        self._active_user_id = user_id
        self._active_username_parts = []

    def handle_data(self, data: str):
        if self._active_user_id is not None:
            self._active_username_parts.append(data)

    def handle_endtag(self, tag: str):
        if tag.lower() != 'a' or self._active_user_id is None:
            return

        username = ''.join(self._active_username_parts).strip()
        username = username[1:] if username.startswith('@') else username
        self.mentions.append(Mention(
            user_id=self._active_user_id,
            username=username or None,
            source='structured',
        ))
        self._active_user_id = None
        self._active_username_parts = []


def _parse_user_id(value: Optional[str]) -> Optional[int]:
    if not value:
        return None
    match = re.search(r'(?:^|/)users/(?P<user_id>[0-9]+)(?:$|[/?#])', value)
    if not match and value.isdigit():
        return int(value)
    if not match:
        return None
    return int(match.group('user_id'))
