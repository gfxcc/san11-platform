import pathlib
import re
import unittest

from handler.model.base import base as model_registry
from handler.model.base.base_storage import StorageSerializable

# Import model modules so their @InitModel decorators populate the registry.
from handler.model import model_article  # noqa: F401
from handler.model import model_binary  # noqa: F401
from handler.model import model_comment  # noqa: F401
from handler.model import model_legacy_subscription  # noqa: F401
from handler.model import model_notification  # noqa: F401
from handler.model import model_package  # noqa: F401
from handler.model import model_reply  # noqa: F401
from handler.model import model_tag  # noqa: F401
from handler.model import model_thread  # noqa: F401
from handler.model import model_user  # noqa: F401
from handler.model.plugins import subscribable  # noqa: F401
from handler.model.plugins import tracklifecycle  # noqa: F401


REPO_ROOT = pathlib.Path(__file__).resolve().parents[4]
SCHEMA_PATH = REPO_ROOT / 'database' / 'san11-platform-database.sql'


def _create_table_columns(schema_sql: str) -> dict:
    tables = {}
    pattern = re.compile(
        r'CREATE\s+TABLE\s+public\.(?P<table>[a-z_]+)\s*\((?P<body>.*?)\);',
        re.IGNORECASE | re.DOTALL,
    )
    for match in pattern.finditer(schema_sql):
        body = match.group('body')
        columns = set()
        for raw_line in body.splitlines():
            line = raw_line.strip().rstrip(',')
            if not line or line.upper().startswith(('PRIMARY KEY', 'CONSTRAINT', 'FOREIGN KEY')):
                continue
            columns.add(line.split()[0].strip('"'))
        tables[match.group('table')] = columns
    return tables


class DatabaseSchemaTest(unittest.TestCase):
    def test_fresh_database_schema_matches_registered_json_models(self):
        schema_sql = SCHEMA_PATH.read_text()
        table_columns = _create_table_columns(schema_sql)

        model_tables = sorted({
            model._DB_TABLE
            for model in model_registry.MODELS.values()
            if isinstance(model, type)
            and issubclass(model, StorageSerializable)
            and getattr(model, '_DB_TABLE', None)
        })

        self.assertGreater(len(model_tables), 0)

        missing_tables = [
            table for table in model_tables
            if table not in table_columns
        ]
        self.assertEqual([], missing_tables)

        required_columns = {'parent', 'resource_id', 'data'}
        missing_columns = {
            table: sorted(required_columns - table_columns[table])
            for table in model_tables
            if required_columns - table_columns[table]
        }
        self.assertEqual({}, missing_columns)


if __name__ == '__main__':
    unittest.main()
