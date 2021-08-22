
# Binaries

ALTER TABLE binaries
    RENAME TO binaries_model_v1;

CREATE TABLE binaries (
    parent text NOT NULL,
    resource_id serial NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);

# Comments

ALTER TABLE comments
    RENAME TO comments_model_v1;

CREATE TABLE comments (
    parent text NOT NULL,
    resource_id serial NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);


# Replies

ALTER TABLE replies
    RENAME TO replies_model_v1;

CREATE TABLE replies (
    parent text NOT NULL,
    resource_id serial NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);


# Create threads
CREATE TABLE threads (
    parent text NOT NULL,
    resource_id serial NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
