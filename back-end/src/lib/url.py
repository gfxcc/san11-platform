

class Url:
    def __init__(self, raw_url: str) -> None:
        self.raw = raw_url
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
        parts = self.raw.split('/')
        if parts[0] == 'users':
            return 'user'
        elif parts[0] == 'categories' and parts[2] == 'packages':
            return 'package'
        else:
            raise Exception(f'Invalid url: {self.raw}')

    @property
    def id(self) -> int:
        return int(self.raw.split('/')[-1])