
from .protos import san11_platform_pb2

class Version:
    def __init__(self, major: int, minor: int, patch: int) -> None:
        self.major = major
        self.minor = minor
        self.patch = patch
    
    def __str__(self) -> str:
        return f'{self.major}.{self.minor}.{self.minor}'
    
    def to_pb(self) -> san11_platform_pb2.Version:
        return san11_platform_pb2.Version(
            major=self.major,
            minor=self.minor,
            patch=self.patch
        )
    
    @classmethod
    def from_pb(cls, obj: san11_platform_pb2.Version):
        return cls(major=obj.major,
                   minor=obj.minor,
                   patch=obj.patch)
                
    @classmethod
    def from_str(cls, obj: str):
        return cls(*list(map(int, obj.split('.'))))
