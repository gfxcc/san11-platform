import json

from integrations.db.db_util import connection
from app.protos import san11_platform_pb2 as pb


class SiteSettingsRepository:
    def get(self):
        with connection() as conn, conn.cursor() as cursor:
            cursor.execute('SELECT package_auto_approval_enabled FROM site_settings WHERE singleton')
            return pb.SiteSettings(package_auto_approval_enabled=cursor.fetchone()[0])

    def update(self, settings, actor_id):
        with connection() as conn, conn.cursor() as cursor:
            cursor.execute('''UPDATE site_settings SET package_auto_approval_enabled = %s
                              WHERE singleton RETURNING package_auto_approval_enabled''',
                           (settings.package_auto_approval_enabled,))
            enabled = cursor.fetchone()[0]
            cursor.execute('''INSERT INTO site_settings_audit(actor, action, details)
                              VALUES (%s, 'settings_updated', %s)''',
                           (f'users/{actor_id}', json.dumps({'package_auto_approval_enabled': enabled})))
            return pb.SiteSettings(package_auto_approval_enabled=enabled)
