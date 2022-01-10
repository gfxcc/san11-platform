# Goal
Create a notification system which notify users on different events. It should
supports multiple delivery methods (e.g. email, in-site message) and
allows user to customize how they should be notified.


## Messages to be sent

* Send a message to `[Thread].author_id` when a new `Comment` is added under the `Thread`.
* Send a message to `[Comment].author_id` when a new `Reply` is added under the `Comment`.
* Send a message to `[Package].author_id` when a new `Thread` is added under the `Package`.
* Send a message to `Admin` when a new `Package` is added.
* Send a message to `Admin` when a new `Article` is added.

### Future enhancements
* Send a message to `[Package].subscribers` when a new `Binary` is released under the `Package`.
* Send a message to `Admin` when a `Report` is created.

## Delivery methods
* Email
* In-site message

## User facing config
* [Boolean] Receive notifications via Email.

# Implementation
## Create DB table `notifications`

```
CREATE TABLE notifications (
    parent text NOT NULL,
    resource_id serial NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
```