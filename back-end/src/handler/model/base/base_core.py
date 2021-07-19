import attr


# For Attrib
IS_PROTO_FIELD = '__SAN11PK_PLATFORM__IS_PROTO_FIELD'
PROTO_PATH = '__SAN11PK_PLATFORM__PROTO_PATH'
PROTO_CONVERTER = '__SAN11PK_PLATFORM__PROTO_CONVERTER'
IS_DB_FIELD = '__SAN11PK_PLATFORM__IS_PROTO_FIELD'
DB_PATH = '__SAN11PK_PLATFORM__DB_PATH'
DB_CONVERTER = '__SAN11PK_PLATFORM__DB_CONVERTER'
REPEATED = '__SAN11PK_PLATFORM__REPEATED'


def is_repeated(attribute: attr.Attribute) -> bool:
    return attribute.metadata[REPEATED]