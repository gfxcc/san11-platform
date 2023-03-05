
class Url:
    def __init__(self, raw_url: str) -> None:
        self.raw = raw_url
        self._items = raw_url.split('/')
        # TODO: mode validataion

    def __str__(self):
        return self.raw

    @property
    def type(self) -> str:
        '''
        [users, packages, website]
        user:
          - users/xxx
        package:
          - categories/xxx/packages/xxx
        website:
          - site: site wide resource. E.g. message board comments
        comments:
          - categories/xxxx/packages/xxxx/comments/xxxx : package comment
          - categories/xxxx/packages/xxxx/comments/xxxx/replies/xxx : package comment's reply
        '''
        if self.raw == 'website':
            return self.raw
        if self._items[-2] == 'replies':
            return 'comments'
        return self._items[-2]

    @property
    def id(self) -> int:
        return int(self._items[-1])

    @property
    def category_id(self) -> int:
        assert self.type in ['categories', 'packages']
        return int(self._items[1])

    @property
    def package_id(self) -> int:
        assert self.type in ['packages', 'binaries']
        return int(self._items[3])
