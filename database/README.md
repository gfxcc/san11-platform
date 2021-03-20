# To dump the database

```
pg_dump \
  -h localhost \
  -p 5432 \
  -U postgres -W \
  --data-only \
  --column-inserts \
  san11-platform-db > table.sql
```
