"""Small versioned migrations shared by the API and background worker."""
from pathlib import Path

from integrations.db.db_util import connection


def migrate():
    with connection() as conn, conn.cursor() as cursor:
        # Both services may start together. Apply each migration exactly once.
        cursor.execute('SELECT pg_advisory_xact_lock(110024)')
        cursor.execute('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY)')
        for path in sorted(Path(__file__).with_name('migrations').glob('*.sql')):
            cursor.execute('SELECT 1 FROM schema_migrations WHERE name = %s', (path.name,))
            if cursor.fetchone():
                continue
            cursor.execute(path.read_text())
            cursor.execute('INSERT INTO schema_migrations(name) VALUES (%s)', (path.name,))
