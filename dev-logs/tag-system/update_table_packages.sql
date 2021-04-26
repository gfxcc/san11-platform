ALTER TABLE packages 
RENAME COLUMN create_timestamp TO create_time;

ALTER TABLE packages 
DROP COLUMN tags;

ALTER TABLE packages
ADD COLUMN tag_ids INT[];

ALTER TABLE packages
ADD COLUMN update_time TIMESTAMP;