import json

from app.protos import san11_platform_pb2 as pb
from integrations.db.db_util import connection
from models.model_package import ModelPackage


class PackageReviewRepository:
    def due(self):
        with connection() as conn, conn.cursor() as cursor:
            cursor.execute('''SELECT parent, resource_id FROM package_review_schedule
                              WHERE approve_at <= clock_timestamp()
                              ORDER BY approve_at LIMIT 100''')
            return cursor.fetchall()

    def approve(self, parent, resource_id):
        with connection() as conn, conn.cursor() as cursor:
            # The settings lock makes a successful disable wait for any approval
            # already committing. No new approval can start after disable returns.
            cursor.execute('SELECT package_auto_approval_enabled FROM site_settings WHERE singleton FOR SHARE')
            if not cursor.fetchone()[0]:
                return None
            cursor.execute('SELECT data FROM packages WHERE parent = %s AND resource_id = %s FOR UPDATE',
                           (parent, resource_id))
            row = cursor.fetchone()
            if not row or row[0].get('state') != pb.UNDER_REVIEW:
                return None
            name = f'{parent}/packages/{resource_id}'
            cursor.execute('''SELECT 1 FROM package_review_schedule
                              WHERE parent = %s AND resource_id = %s AND approve_at <= clock_timestamp()''',
                           (parent, resource_id))
            if not cursor.fetchone():
                return None
            cursor.execute('SELECT 1 FROM binaries WHERE parent = %s LIMIT 1', (name,))
            if not cursor.fetchone():
                cursor.execute('DELETE FROM package_review_schedule WHERE parent = %s AND resource_id = %s',
                               (parent, resource_id))
                return None
            cursor.execute('''UPDATE packages SET data = (data::jsonb || jsonb_build_object(
                                'state', %s, 'update_time',
                                to_char(clock_timestamp() AT TIME ZONE 'UTC',
                                        'YYYY-MM-DD"T"HH24:MI:SS.US') || '+00:00'))::json
                              WHERE parent = %s AND resource_id = %s RETURNING data''',
                           (pb.NORMAL, parent, resource_id))
            data = cursor.fetchone()[0]
            cursor.execute('''INSERT INTO site_settings_audit(actor, action, details)
                              VALUES ('system', 'package_auto_approved', %s)''',
                           (json.dumps({'package_name': name}),))
        return ModelPackage.from_db(data)
