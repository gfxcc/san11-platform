# Upload db-backup to GCS

GCS_BUCKET_NAME=san11-platform-db-backup
BACKUP_DIR=~/san11-platform/database/backup

most_recent_backup=$(ls -t $BACKUP_DIR | head -1)
gsutil cp $BACKUP_DIR/$most_recent_backup gs://$GCS_BUCKET_NAME