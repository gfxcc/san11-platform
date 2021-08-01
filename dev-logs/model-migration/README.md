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


# Comment, Reply
1. Rename current table to `comments_legacy`, `replies_legacy`.
```
ALTER TABLE comments
    RENAME TO comments_legacy;
ALTER TABLE replies
    RENAME TO replies_legacy;
```

2. Create new table `comments`, `replies`.
```
CREATE TABLE comments (
    parent text NOT NULL,
    resource_id int NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
CREATE TABLE replies (
    parent text NOT NULL,
    resource_id int NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
```