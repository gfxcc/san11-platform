
1. Rename curren table 
    ```
    ALTER TABLE subscriptions
        RENAME TO subscriptions_legacy;
    ```

1. Create new table
    ```
    CREATE TABLE subscriptions (
        parent text NOT NULL,
        resource_id int NOT NULL,

        data json,
    
        PRIMARY KEY (parent, resource_id)
    );
    ```

1. Migrate data
    ```
    ./db-fixer.py
    ```
