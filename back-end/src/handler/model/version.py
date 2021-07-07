import logging

from ..protos import san11_platform_pb2

class Version:
    def __init__(self, major: int, minor: int, patch: int) -> None:
        self.major = major
        self.minor = minor
        self.patch = patch
    
    def __str__(self) -> str:
        return f'v{self.major}.{self.minor}.{self.patch}'
    
    def to_pb(self) -> san11_platform_pb2.Version:
        return san11_platform_pb2.Version(
            major=self.major,
            minor=self.minor,
            patch=self.patch
        )
    
    @classmethod
    def from_pb(cls, obj: san11_platform_pb2.Version):
        logging.info(obj.major)
        logging.info(obj.minor)
        logging.info(obj.minor)
        
        return cls(major=obj.major,
                   minor=obj.minor,
                   patch=obj.patch)
                
    @classmethod
    def from_str(cls, obj: str):
        return cls(*list(map(int, obj[1:].split('.'))))
