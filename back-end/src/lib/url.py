

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
        [user, package]
        user:
          - users/xxx
        package:
          - categories/xxx/packages/xxx
        '''
        return self._items[-2]

    @property
    def id(self) -> int:
        return int(self._items[-1])
    
    @property
    def category_id(self) -> int:
        assert self.type in ['categories', 'packages']
        return int(self._items[1])
