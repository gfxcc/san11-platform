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


# Tag

Started    |
-----------|
01/15/2022 |

## DB
1. Rename current table to `tags_legacy`.
```
ALTER TABLE tags
    RENAME TO tags_legacy;
```

2. Create new table `tags`.
```
CREATE TABLE tags (
    parent text NOT NULL,
    resource_id serial NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
```

# Package

Started    |
-----------|
01/15/2022 |

## DB
1. Rename current table to `packages_legacy`.
```
ALTER TABLE packages
    RENAME TO packages_legacy;
```

2. Create new table `packages`.
```
CREATE TABLE packages (
    parent text NOT NULL,
    resource_id serial NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
```

# Activity
Started    |
-----------|
01/17/2022 |

## DB
1. Rename current table to `activities_legacy`.
```
ALTER TABLE activities
    RENAME TO activities_legacy;
```

2. Create new table `activities`.
```
CREATE TABLE activities (
    parent text NOT NULL,
    resource_id serial NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
```

# User

Started    |
-----------|
01/22/2022 |

## DB
1. Rename current table to `users_legacy`.
```
ALTER TABLE users
    RENAME TO users_legacy;
```

2. Create new table `user`.
```
CREATE TABLE users (
    parent text NOT NULL,
    resource_id serial NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
```
