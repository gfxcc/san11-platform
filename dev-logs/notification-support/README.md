# Create DB table `notifications`

```
CREATE TABLE notifications (
    parent text NOT NULL,
    resource_id int NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
```