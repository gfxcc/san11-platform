
# Create thread table
```
CREATE TABLE threads (
    parent text NOT NULL,
    resource_id int NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);


CREATE TABLE threads_serial (
    parent text NOT NULL,
    resource_id serial NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
```