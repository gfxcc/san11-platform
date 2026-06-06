import unittest
from . import html_util


class HtmlUtilTest(unittest.TestCase):

    def test_get_mentioned_users_mention_element(self):
        content = '<a class="mention" href="users/73">@一笑悬命</a>'

        mentioned_users = html_util.get_mentioned_users(content)

        self.assertSetEqual(mentioned_users, {'一笑悬命'})
    
    def test_get_mentioned_users_vanilla_at(self):
        content = '@一笑悬命:'

        mentioned_users = html_util.get_mentioned_users(content)

        self.assertSetEqual(mentioned_users, {'一笑悬命'})
    
    def test_get_mentioned_users_multiple(self):
        content = '@一笑悬命: @一笑悬命: @一笑悬命:'

        mentioned_users = html_util.get_mentioned_users(content)

        self.assertSetEqual(mentioned_users, {'一笑悬命'})

    def test_get_mentioned_users_no_mention(self):
        content = '一笑悬命'

        mentioned_users = html_util.get_mentioned_users(content)

        self.assertSetEqual(mentioned_users, set())
