from unittest.mock import Mock, PropertyMock


def setup_context():
    return Mock()


def setup_handler_context():
    mock_handler_context = Mock()
    user_id = PropertyMock(return_value=12345)
    type(mock_handler_context.user).user_id = user_id
    return mock_handler_context