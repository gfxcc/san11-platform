# Binary

1. Rename current table to `binaries_legacy`.
```
ALTER TABLE binaries
    RENAME TO binaries_legacy;
```

2. Create new table `binaries`.
```
CREATE TABLE binaries (
    parent text NOT NULL,
    resource_id int NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
```

