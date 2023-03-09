#!/bin/bash

# Define the PostgreSQL database and user credentials
DB_NAME="san11-platform-db"
DB_USER="postgres"
DB_PASSWORD="example"

# Define the backup file name and location
BACKUP_DIR="/backup"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$DATE.dump"

# Use pg_dump to create the backup file
pg_dump -U $DB_USER -Fc $DB_NAME > $BACKUP_FILE

# Check the exit status of pg_dump
if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_FILE"
else
  echo "Backup failed"
fi

# Cleanup files older than 60 days
find $BACKUP_DIR/* -mtime +60 -exec rm {} \;
