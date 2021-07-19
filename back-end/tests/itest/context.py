import re
from typing import Tuple
from unittest.mock import Mock, PropertyMock


def setup_context():
    return Mock()


def setup_handler_context():
    mock_handler_context = Mock()
    user_id = PropertyMock(return_value=12345)
    type(mock_handler_context.user).user_id = user_id
    return mock_handler_context


def parse_name(name: str) -> Tuple[str, int]:
    NAME_PATTERN = r'((?P<parent>.+)/)?(?P<collection>[a-zA-Z0-9]+)/(?P<resource_id>[0-9]+)'
    match = re.fullmatch(NAME_PATTERN, name)
    assert match, f'Invalid resource_name: {name}'
    return match['parent'] or '', int(match['resource_id'])