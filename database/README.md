# Dump the database
```
pg_dump -Fc san11-platform-db > /backup/db.dump
```

## Dump to text
```
pg_dump \
  -h localhost \
  -p 5432 \
  -U postgres -W \
  --data-only \
  --column-inserts \
  san11-platform-db > table.sql
```

# Restore the database
```
dropdb san11-platform-db -U postgres
createdb -T template0 san11-platform-db -U postgres
pg_restore -C -d san11-platform-db /backup/db.dump -U postgres
```
