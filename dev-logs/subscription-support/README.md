# Subscription support

Allow customer to subscribe to resources and receive notifications on varity events
happened on resources being subscribed.

# Subscribable resources

## Users
Notifications should be sent on following events.
* The user create a new resource. (e.g. Package, Binary, Thread, Comment, Reply)

# Implementation

## Proto

```
message Subscription {
    // The `parent` is the resource being subscribed. 
    // For name `users/123/subscriptions/1`, `users/123` is the resource being
    // subscribed. 
    string name = 1;
    // `user_id` of the user who should receive notifications.
    string subscriber_id = 2;
    //
    // [ OUTPUT_ONLY ]
    google.protobuf.Timestamp create_time = 3;
    //
    // [ OUTPUT_ONLY ]
    google.protobuf.Timestamp update_time = 4;
    // 
    SubscribeType type = 5;


    enum SubscribeType {
        SUBSCRIBE_TYPE_UNDEFINE = 0;

        // Receive notification on all events. 
        ALL = 1;
    }
}
```

## API
```
  // Subscription
  rpc CreateSubscriptioin(CreateSubscriptionRequest) returns (Subscription) {}
  rpc ListSubscriptioins(ListSubscriptionsRequest)
      returns (ListSubscriptionsResponse) {}
  rpc UpdateSubscriptioin(UpdateSubscriptionRequest) returns (Subscription) {}
  rpc DeleteSubscriptioin(DeleteSubscriptionRequest) returns (Subscription) {}
```

## DB table
```
CREATE TABLE subscriptions (
    parent text NOT NULL,
    resource_id serial NOT NULL,

    data json,
    
    PRIMARY KEY (parent, resource_id)
);
```