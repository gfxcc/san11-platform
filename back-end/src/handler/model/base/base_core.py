import attrs

# For Attrib
IS_PROTO_FIELD = 'PROTO_MODEL_DB__IS_PROTO_FIELD'
PROTO_PATH = 'PROTO_MODEL_DB__PROTO_PATH'
PROTO_CONVERTER = 'PROTO_MODEL_DB__PROTO_CONVERTER'
IS_DB_FIELD = 'PROTO_MODEL_DB__IS_DB_FIELD'
DB_PATH = 'PROTO_MODEL_DB__DB_PATH'
DB_CONVERTER = 'PROTO_MODEL_DB__DB_CONVERTER'
REPEATED = 'PROTO_MODEL_DB__REPEATED'
NESTED_TYPE = 'PROTO_MODEL_DB__NESTED_TYPE'


def is_repeated(attribute: attrs.Attribute) -> bool:
    return attribute.metadata[REPEATED]
