import xml.etree.ElementTree as ET
from xml.dom import minidom
from xml.dom.minidom import Document


SIRE_VERSION_TO_SUFFIX = {
    1: '.sirecm',
    2: '.scp'
}
SIRE_SUFFIX_TO_VERSION = {
    '.sirecm': 1,
    '.scp': 2
}


class SirePlugin:
    SIRE_1_ENCODING = 'GB2312'
    SIRE_2_ENCODING = 'UTF-8'
    def __init__(self, document: Document):
        self.document = document

    @classmethod
    def from_bytes(cls, raw: bytes, encoding: str):
        doc_str = raw.decode(encoding)
        return cls(minidom.parseString(doc_str))
    
    @classmethod
    def from_sire_1(cls, raw: bytes):
        return cls.from_bytes(raw=raw, encoding=cls.SIRE_1_ENCODING)
    
    @classmethod
    def from_sire_2(cls, raw: bytes):
        return cls.from_bytes(raw=raw, encoding=cls.SIRE_2_ENCODING)
    
    @classmethod
    def from_sire_version(cls, raw: bytes, main_version: int):
        if main_version == 1:
            return cls.from_sire_1(raw)
        elif main_version == 2:
            return cls.from_sire_2(raw)
        else:
            raise Exception('main_version has to be 1 or 2')
    
    def to_bytes(self, encoding: str) -> bytes:
        return self.document.toxml(encoding=encoding) 
    
    def to_sire_1(self) -> bytes:
        return self.to_bytes(encoding=self.SIRE_1_ENCODING)
    
    def to_sire_2(self) -> bytes:
        return self.to_bytes(encoding=self.SIRE_2_ENCODING)