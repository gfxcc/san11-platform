# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: san11-platform.proto
"""Generated protocol buffer code."""
from google.protobuf.internal import builder as _builder
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from google.protobuf import timestamp_pb2 as google_dot_protobuf_dot_timestamp__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x14san11-platform.proto\x12\nrouteguide\x1a\x1fgoogle/protobuf/timestamp.proto\"L\n\x14\x43reatePackageRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12$\n\x07package\x18\x02 \x01(\x0b\x32\x13.routeguide.Package\"!\n\x11GetPackageRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"h\n\x14UpdatePackageRequest\x12$\n\x07package\x18\x01 \x01(\x0b\x32\x13.routeguide.Package\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"$\n\x14\x44\x65letePackageRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"n\n\x13ListPackagesRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"V\n\x14ListPackagesResponse\x12%\n\x08packages\x18\x01 \x03(\x0b\x32\x13.routeguide.Package\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"M\n\x15SearchPackagesRequest\x12\r\n\x05query\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\"X\n\x16SearchPackagesResponse\x12%\n\x08packages\x18\x01 \x03(\x0b\x32\x13.routeguide.Package\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\" \n\x10GetBinaryRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"\xc0\x01\n\x13UploadBinaryRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\"\n\x06\x62inary\x18\x02 \x01(\x0b\x32\x12.routeguide.Binary\x12\x0e\n\x04\x64\x61ta\x18\x03 \x01(\x0cH\x00\x12\x19\n\x0f\x64ownload_method\x18\x04 \x01(\tH\x00\x12\r\n\x03url\x18\x07 \x01(\tH\x00\x12\x14\n\x0csire_version\x18\x05 \x01(\x03\x12\x19\n\x11sire_auto_convert\x18\x06 \x01(\x08\x42\n\n\x08resource\"I\n\x13\x43reateBinaryRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\"\n\x06\x62inary\x18\x02 \x01(\x0b\x32\x12.routeguide.Binary\"*\n\x15\x42\x61tchGetBinaryRequest\x12\x11\n\tbinary_id\x18\x01 \x03(\x03\">\n\x16\x42\x61tchGetBinaryResponse\x12$\n\x08\x62inaries\x18\x01 \x03(\x0b\x32\x12.routeguide.Binary\"%\n\x15\x44ownloadBinaryRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"#\n\x13\x44\x65leteBinaryRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"e\n\x13UpdateBinaryRequest\x12\"\n\x06\x62inary\x18\x01 \x01(\x0b\x32\x12.routeguide.Binary\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"n\n\x13ListBinariesRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"U\n\x14ListBinariesResponse\x12$\n\x08\x62inaries\x18\x01 \x03(\x0b\x32\x12.routeguide.Binary\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"3\n\x12UploadImageRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\r\n\x05image\x18\x02 \x01(\x0c\"I\n\x12\x43reateImageRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x0b\n\x03url\x18\x02 \x01(\t\x12\x16\n\x0ein_description\x18\x03 \x01(\x08\"I\n\x13\x43reateThreadRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\"\n\x06thread\x18\x02 \x01(\x0b\x32\x12.routeguide.Thread\" \n\x10GetThreadRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"m\n\x12ListThreadsRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"S\n\x13ListThreadsResponse\x12#\n\x07threads\x18\x01 \x03(\x0b\x32\x12.routeguide.Thread\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"e\n\x13UpdateThreadRequest\x12\"\n\x06thread\x18\x01 \x01(\x0b\x32\x12.routeguide.Thread\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"#\n\x13\x44\x65leteThreadRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"L\n\x14\x43reateCommentRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12$\n\x07\x63omment\x18\x02 \x01(\x0b\x32\x13.routeguide.Comment\"$\n\x14\x44\x65leteCommentRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"h\n\x14UpdateCommentRequest\x12$\n\x07\x63omment\x18\x01 \x01(\x0b\x32\x13.routeguide.Comment\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"n\n\x13ListCommentsRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"V\n\x14ListCommentsResponse\x12%\n\x08\x63omments\x18\x01 \x03(\x0b\x32\x13.routeguide.Comment\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"F\n\x12\x43reateReplyRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12 \n\x05reply\x18\x02 \x01(\x0b\x32\x11.routeguide.Reply\"\"\n\x12\x44\x65leteReplyRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"b\n\x12UpdateReplyRequest\x12 \n\x05reply\x18\x01 \x01(\x0b\x32\x11.routeguide.Reply\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"L\n\x14\x43reateArticleRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12$\n\x07\x61rticle\x18\x02 \x01(\x0b\x32\x13.routeguide.Article\"!\n\x11GetArticleRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"n\n\x13ListArticlesRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"V\n\x14ListArticlesResponse\x12%\n\x08\x61rticles\x18\x01 \x03(\x0b\x32\x13.routeguide.Article\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"h\n\x14UpdateArticleRequest\x12$\n\x07\x61rticle\x18\x01 \x01(\x0b\x32\x13.routeguide.Article\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"$\n\x14\x44\x65leteArticleRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"\x1e\n\x0eGetUserRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"1\n\x0fGetUserResponse\x12\x1e\n\x04user\x18\x01 \x01(\x0b\x32\x10.routeguide.User\"3\n\rSignInRequest\x12\x10\n\x08identity\x18\x01 \x01(\t\x12\x10\n\x08password\x18\x02 \x01(\t\"=\n\x0eSignInResponse\x12\x1e\n\x04user\x18\x02 \x01(\x0b\x32\x10.routeguide.User\x12\x0b\n\x03sid\x18\x03 \x01(\t\"\x10\n\x0eSignOutRequest\"p\n\x11\x43reateUserRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x1e\n\x04user\x18\x02 \x01(\x0b\x32\x10.routeguide.User\x12\x10\n\x08password\x18\x03 \x01(\t\x12\x19\n\x11verification_code\x18\x04 \x01(\t\"A\n\x12\x43reateUserResponse\x12\x1e\n\x04user\x18\x01 \x01(\x0b\x32\x10.routeguide.User\x12\x0b\n\x03sid\x18\x02 \x01(\t\"_\n\x11UpdateUserRequest\x12\x1e\n\x04user\x18\x01 \x01(\x0b\x32\x10.routeguide.User\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"R\n\x15UpdatePasswordRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x10\n\x08password\x18\x02 \x01(\t\x12\x19\n\x11verification_code\x18\x03 \x01(\t\"k\n\x10ListUsersRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"M\n\x11ListUsersResponse\x12\x1f\n\x05users\x18\x01 \x03(\x0b\x32\x10.routeguide.User\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\",\n\x1bSendVerificationCodeRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\">\n\x12VerifyEmailRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\x12\x19\n\x11verification_code\x18\x02 \x01(\t\"A\n\x13VerifyEmailResponse\x12\n\n\x02ok\x18\x01 \x01(\x08\x12\x1e\n\x04user\x18\x02 \x01(\x0b\x32\x10.routeguide.User\"8\n\x16ValidateNewUserRequest\x12\x1e\n\x04user\x18\x01 \x01(\x0b\x32\x10.routeguide.User\"p\n\x15ListActivitiesRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"[\n\x16ListActivitiesResponse\x12(\n\nactivities\x18\x01 \x03(\x0b\x32\x14.routeguide.Activity\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"s\n\x18ListNotificationsRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"e\n\x19ListNotificationsResponse\x12\x17\n\x0fnext_page_token\x18\x01 \x01(\t\x12/\n\rnotifications\x18\x02 \x03(\x0b\x32\x18.routeguide.Notification\"w\n\x19UpdateNotificationRequest\x12.\n\x0cnotification\x18\x01 \x01(\x0b\x32\x18.routeguide.Notification\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"@\n\x10\x43reateTagRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x1c\n\x03tag\x18\x02 \x01(\x0b\x32\x0f.routeguide.Tag\"j\n\x0fListTagsRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"J\n\x10ListTagsResponse\x12\x1d\n\x04tags\x18\x01 \x03(\x0b\x32\x0f.routeguide.Tag\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\" \n\x10\x44\x65leteTagRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"#\n\x13GetStatisticRequest\x12\x0c\n\x04\x64\x61te\x18\x01 \x01(\t\"\x18\n\x16GetAdminMessageRequest\"[\n\x19\x43reateSubscriptionRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12.\n\x0csubscription\x18\x02 \x01(\x0b\x32\x18.routeguide.Subscription\"s\n\x18ListSubscriptionsRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"e\n\x19ListSubscriptionsResponse\x12/\n\rsubscriptions\x18\x01 \x03(\x0b\x32\x18.routeguide.Subscription\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"w\n\x19UpdateSubscriptionRequest\x12.\n\x0csubscription\x18\x01 \x01(\x0b\x32\x18.routeguide.Subscription\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\")\n\x19\x44\x65leteSubscriptionRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"a\n\x1f\x43reateLegacySubscriptionRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12.\n\x0csubscription\x18\x02 \x01(\x0b\x32\x18.routeguide.Subscription\"y\n\x1eListLegacySubscriptionsRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"q\n\x1fListLegacySubscriptionsResponse\x12\x35\n\rsubscriptions\x18\x01 \x03(\x0b\x32\x1e.routeguide.LegacySubscription\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"}\n\x1fUpdateLegacySubscriptionRequest\x12.\n\x0csubscription\x18\x01 \x01(\x0b\x32\x18.routeguide.Subscription\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"/\n\x1f\x44\x65leteLegacySubscriptionRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"N\n\x18UnLegacySubscribeRequest\x12\x1b\n\x13subscribed_resource\x18\x01 \x01(\t\x12\x15\n\rsubscriber_id\x18\x02 \x01(\x03\"\x07\n\x05\x45mpty\"\'\n\x06Status\x12\x0c\n\x04\x63ode\x18\x01 \x01(\x03\x12\x0f\n\x07message\x18\x02 \x01(\t\"\x9f\x02\n\x07Package\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x14\n\x0cpackage_name\x18\x02 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x03 \x01(\t\x12\x13\n\x0b\x63reate_time\x18\x04 \x01(\t\x12\x13\n\x0bupdate_time\x18\x06 \x01(\t\x12(\n\x05state\x18\x07 \x01(\x0e\x32\x19.routeguide.ResourceState\x12\x11\n\tauthor_id\x18\x08 \x01(\x03\x12\x12\n\nimage_urls\x18\n \x03(\t\x12\x1d\n\x04tags\x18\x0b \x03(\x0b\x32\x0f.routeguide.Tag\x12\x16\n\x0e\x64ownload_count\x18\x14 \x01(\x03\x12\x12\n\nlike_count\x18\x15 \x01(\x03\x12\x15\n\rdislike_count\x18\x16 \x01(\x03\"\xa4\x02\n\x06\x42inary\x12\x11\n\tbinary_id\x18\x01 \x01(\x03\x12\x12\n\npackage_id\x18\x02 \x01(\x03\x12\x16\n\x0e\x64ownload_count\x18\x04 \x01(\x03\x12$\n\x07version\x18\x05 \x01(\x0b\x32\x13.routeguide.Version\x12\x13\n\x0b\x64\x65scription\x18\x06 \x01(\t\x12\x13\n\x0b\x63reate_time\x18\x07 \x01(\t\x12\x0b\n\x03tag\x18\x08 \x01(\t\x12\x0c\n\x04size\x18\n \x01(\t\x12\x0c\n\x04name\x18\x0b \x01(\t\x12\x13\n\x0bupdate_time\x18\x0c \x01(\t\x12 \n\x04\x66ile\x18\r \x01(\x0b\x32\x10.routeguide.FileH\x00\x12\x19\n\x0f\x64ownload_method\x18\x0e \x01(\tH\x00\x42\n\n\x08resourceJ\x04\x08\t\x10\n\"\x86\x03\n\x04User\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x10\n\x08username\x18\x02 \x01(\t\x12\r\n\x05\x65mail\x18\x03 \x01(\t\x12\'\n\x04type\x18\x04 \x01(\x0e\x32\x19.routeguide.User.UserType\x12\x11\n\timage_url\x18\x05 \x01(\t\x12\x0f\n\x07website\x18\x06 \x01(\t\x12\x0f\n\x07user_id\x18\x07 \x01(\x03\x12\x18\n\x10subscriber_count\x18\x08 \x01(\x03\x12/\n\x0b\x63reate_time\x18\t \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\n \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12*\n\x08settings\x18\x0b \x01(\x0b\x32\x18.routeguide.UserSettings\"I\n\x08UserType\x12\x19\n\x15USER_TYPE_UNSPECIFIED\x10\x00\x12\t\n\x05\x41\x44MIN\x10\x01\x12\n\n\x06TESTER\x10\x02\x12\x0b\n\x07REGULAR\x10\x0b\"6\n\x07Version\x12\r\n\x05major\x18\x01 \x01(\x03\x12\r\n\x05minor\x18\x02 \x01(\x03\x12\r\n\x05patch\x18\x03 \x01(\x03\"8\n\tStatistic\x12\x13\n\x0bvisit_count\x18\x01 \x01(\x03\x12\x16\n\x0e\x64ownload_count\x18\x02 \x01(\x03\"\x12\n\x03Url\x12\x0b\n\x03url\x18\x01 \x01(\t\"\xa1\x03\n\x06Thread\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x0f\n\x07subject\x18\x02 \x01(\t\x12\x0f\n\x07\x63ontent\x18\x03 \x01(\t\x12\x11\n\tauthor_id\x18\x04 \x01(\x03\x12/\n\x0b\x63reate_time\x18\x05 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x06 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12(\n\x05state\x18\x07 \x01(\x0e\x32\x19.routeguide.ResourceState\x12\x0c\n\x04tags\x18\x08 \x03(\t\x12\x0e\n\x06pinned\x18\t \x01(\x08\x12\x39\n\x15latest_commented_time\x18\n \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x1b\n\x13latest_commenter_id\x18\x0b \x01(\x03\x12\x12\n\nview_count\x18\x15 \x01(\x03\x12\x12\n\nlike_count\x18\x16 \x01(\x03\x12\x15\n\rcomment_count\x18\x17 \x01(\x03\x12\x13\n\x0breply_count\x18\x18 \x01(\x03\"\xe9\x01\n\x07\x43omment\x12\x0c\n\x04name\x18\x01 \x01(\t\x12/\n\x0b\x63reate_time\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x04 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x0c\n\x04text\x18\x05 \x01(\t\x12\x11\n\tauthor_id\x18\x06 \x01(\x03\x12\x14\n\x0cupvote_count\x18\x07 \x01(\x03\x12\"\n\x07replies\x18\x08 \x03(\x0b\x32\x11.routeguide.Reply\x12\r\n\x05index\x18\t \x01(\x03J\x04\x08\x02\x10\x03\"\xae\x01\n\x05Reply\x12\x0c\n\x04name\x18\x01 \x01(\t\x12/\n\x0b\x63reate_time\x18\x02 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x0c\n\x04text\x18\x04 \x01(\t\x12\x11\n\tauthor_id\x18\x05 \x01(\x03\x12\x14\n\x0cupvote_count\x18\x06 \x01(\x03\"6\n\x03Tag\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x10\n\x08tag_name\x18\x02 \x01(\t\x12\x0f\n\x07mutable\x18\x03 \x01(\x08\"\x1f\n\x0c\x41\x64minMessage\x12\x0f\n\x07message\x18\x01 \x01(\t\"\x1c\n\x04\x41uth\x12\x14\n\x0coauth2_token\x18\x01 \x01(\t\"\x82\x01\n\x08\x41\x63tivity\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x13\n\x0b\x63reate_time\x18\x02 \x01(\t\x12\"\n\x06\x61\x63tion\x18\x03 \x01(\x0e\x32\x12.routeguide.Action\x12/\n\rresource_view\x18\x04 \x01(\x0b\x32\x18.routeguide.ResourceView\"\xd7\x01\n\x0cNotification\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x11\n\tsender_id\x18\x02 \x01(\x03\x12/\n\x0b\x63reate_time\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x04 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x0e\n\x06unread\x18\x05 \x01(\x08\x12\x0f\n\x07\x63ontent\x18\x06 \x01(\t\x12\x15\n\rimage_preview\x18\x07 \x01(\t\x12\x0c\n\x04link\x18\x08 \x01(\t\"Z\n\x0cResourceView\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x14\n\x0c\x64isplay_name\x18\x02 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x03 \x01(\t\x12\x11\n\timage_url\x18\x04 \x01(\t\"\x8e\x02\n\x07\x41rticle\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x0f\n\x07subject\x18\x02 \x01(\t\x12\x0f\n\x07\x63ontent\x18\x03 \x01(\t\x12\x11\n\tauthor_id\x18\x04 \x01(\x03\x12/\n\x0b\x63reate_time\x18\x05 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x06 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12(\n\x05state\x18\x07 \x01(\x0e\x32\x19.routeguide.ResourceState\x12\x0c\n\x04tags\x18\x08 \x03(\t\x12\x12\n\nview_count\x18\x15 \x01(\x03\x12\x12\n\nlike_count\x18\x16 \x01(\x03\"\x9f\x01\n\x04\x46ile\x12\x10\n\x08\x66ilename\x18\x01 \x01(\t\x12\x0b\n\x03\x65xt\x18\x02 \x01(\t\x12\'\n\x06server\x18\x04 \x01(\x0e\x32\x17.routeguide.File.Server\x12\x0b\n\x03uri\x18\x03 \x01(\t\x12\x0b\n\x03url\x18\x05 \x01(\t\"5\n\x06Server\x12\x16\n\x12SERVER_UNSPECIFIED\x10\x00\x12\x07\n\x03GCS\x10\x01\x12\n\n\x06\x41WS_S3\x10\x02\"\xfe\x01\n\x0cSubscription\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x0e\n\x06target\x18\x02 \x01(\t\x12/\n\x0b\x63reate_time\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x04 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x34\n\x04type\x18\x05 \x01(\x0e\x32&.routeguide.Subscription.SubscribeType\"8\n\rSubscribeType\x12\x1e\n\x1aSUBSCRIBE_TYPE_UNSPECIFIED\x10\x00\x12\x07\n\x03\x41LL\x10\x01\"\x91\x02\n\x12LegacySubscription\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x15\n\rsubscriber_id\x18\x02 \x01(\x03\x12/\n\x0b\x63reate_time\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x04 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12:\n\x04type\x18\x05 \x01(\x0e\x32,.routeguide.LegacySubscription.SubscribeType\"8\n\rSubscribeType\x12\x1e\n\x1aSUBSCRIBE_TYPE_UNSPECIFIED\x10\x00\x12\x07\n\x03\x41LL\x10\x01\"\xf5\x01\n\x0cUserSettings\x12\x42\n\x0cnotification\x18\x01 \x01(\x0b\x32,.routeguide.UserSettings.NotificationSetting\x1a\xa0\x01\n\x13NotificationSetting\x12\x13\n\x0bsend_emails\x18\x01 \x01(\x08\x12\x15\n\rsubscriptions\x18\x0b \x01(\x08\x12\x17\n\x0frecommendations\x18\x0c \x01(\x08\x12\x10\n\x08mentions\x18\r \x01(\x08\x12\x0f\n\x07threads\x18\x0e \x01(\x08\x12\x10\n\x08\x63omments\x18\x0f \x01(\x08\x12\x0f\n\x07replies\x18\x10 \x01(\x08\"\x1a\n\tFieldMask\x12\r\n\x05paths\x18\x01 \x03(\t*|\n\rResourceState\x12\x1e\n\x1aRESOURCE_STATE_UNSPECIFIED\x10\x00\x12\n\n\x06NORMAL\x10\x01\x12\x10\n\x0cUNDER_REVIEW\x10\x02\x12\n\n\x06HIDDEN\x10\x03\x12\x14\n\x10SCHEDULED_DELETE\x10\x04\x12\x0b\n\x07\x44\x45LETED\x10\x05*\x9d\x01\n\x06\x41\x63tion\x12\x16\n\x12\x41\x43TION_UNSPECIFIED\x10\x00\x12\n\n\x06\x43REATE\x10\x01\x12\n\n\x06\x44\x45LETE\x10\x02\x12\n\n\x06UPDATE\x10\x03\x12\n\n\x06SELECT\x10\x04\x12\x08\n\x04LIKE\x10\x0b\x12\n\n\x06UPVOTE\x10\x0c\x12\r\n\tSUBSCRIBE\x10\r\x12\x0b\n\x07\x44ISLIKE\x10\x0e\x12\x0c\n\x08\x44OWNLOAD\x10\x15\x12\x0b\n\x07\x43OLLECT\x10\x16\x32\xd7#\n\nRouteGuide\x12H\n\rCreatePackage\x12 .routeguide.CreatePackageRequest\x1a\x13.routeguide.Package\"\x00\x12\x42\n\nGetPackage\x12\x1d.routeguide.GetPackageRequest\x1a\x13.routeguide.Package\"\x00\x12S\n\x0cListPackages\x12\x1f.routeguide.ListPackagesRequest\x1a .routeguide.ListPackagesResponse\"\x00\x12H\n\rUpdatePackage\x12 .routeguide.UpdatePackageRequest\x1a\x13.routeguide.Package\"\x00\x12H\n\rDeletePackage\x12 .routeguide.DeletePackageRequest\x1a\x13.routeguide.Package\"\x00\x12Y\n\x0eSearchPackages\x12!.routeguide.SearchPackagesRequest\x1a\".routeguide.SearchPackagesResponse\"\x00\x12\x45\n\x0c\x43reateBinary\x12\x1f.routeguide.CreateBinaryRequest\x1a\x12.routeguide.Binary\"\x00\x12?\n\tGetBinary\x12\x1c.routeguide.GetBinaryRequest\x1a\x12.routeguide.Binary\"\x00\x12Y\n\x0e\x42\x61tchGetBinary\x12!.routeguide.BatchGetBinaryRequest\x1a\".routeguide.BatchGetBinaryResponse\"\x00\x12S\n\x0cListBinaries\x12\x1f.routeguide.ListBinariesRequest\x1a .routeguide.ListBinariesResponse\"\x00\x12\x45\n\x0cUpdateBinary\x12\x1f.routeguide.UpdateBinaryRequest\x1a\x12.routeguide.Binary\"\x00\x12\x45\n\x0c\x44\x65leteBinary\x12\x1f.routeguide.DeleteBinaryRequest\x1a\x12.routeguide.Binary\"\x00\x12I\n\x0e\x44ownloadBinary\x12!.routeguide.DownloadBinaryRequest\x1a\x12.routeguide.Binary\"\x00\x12@\n\x0b\x43reateImage\x12\x1e.routeguide.CreateImageRequest\x1a\x0f.routeguide.Url\"\x00\x12\x45\n\x0c\x43reateThread\x12\x1f.routeguide.CreateThreadRequest\x1a\x12.routeguide.Thread\"\x00\x12?\n\tGetThread\x12\x1c.routeguide.GetThreadRequest\x1a\x12.routeguide.Thread\"\x00\x12P\n\x0bListThreads\x12\x1e.routeguide.ListThreadsRequest\x1a\x1f.routeguide.ListThreadsResponse\"\x00\x12\x45\n\x0cUpdateThread\x12\x1f.routeguide.UpdateThreadRequest\x1a\x12.routeguide.Thread\"\x00\x12\x45\n\x0c\x44\x65leteThread\x12\x1f.routeguide.DeleteThreadRequest\x1a\x12.routeguide.Thread\"\x00\x12H\n\rCreateComment\x12 .routeguide.CreateCommentRequest\x1a\x13.routeguide.Comment\"\x00\x12S\n\x0cListComments\x12\x1f.routeguide.ListCommentsRequest\x1a .routeguide.ListCommentsResponse\"\x00\x12H\n\rUpdateComment\x12 .routeguide.UpdateCommentRequest\x1a\x13.routeguide.Comment\"\x00\x12H\n\rDeleteComment\x12 .routeguide.DeleteCommentRequest\x1a\x13.routeguide.Comment\"\x00\x12\x42\n\x0b\x43reateReply\x12\x1e.routeguide.CreateReplyRequest\x1a\x11.routeguide.Reply\"\x00\x12\x42\n\x0bUpdateReply\x12\x1e.routeguide.UpdateReplyRequest\x1a\x11.routeguide.Reply\"\x00\x12\x42\n\x0b\x44\x65leteReply\x12\x1e.routeguide.DeleteReplyRequest\x1a\x11.routeguide.Reply\"\x00\x12H\n\rCreateArticle\x12 .routeguide.CreateArticleRequest\x1a\x13.routeguide.Article\"\x00\x12\x42\n\nGetArticle\x12\x1d.routeguide.GetArticleRequest\x1a\x13.routeguide.Article\"\x00\x12S\n\x0cListArticles\x12\x1f.routeguide.ListArticlesRequest\x1a .routeguide.ListArticlesResponse\"\x00\x12H\n\rUpdateArticle\x12 .routeguide.UpdateArticleRequest\x1a\x13.routeguide.Article\"\x00\x12H\n\rDeleteArticle\x12 .routeguide.DeleteArticleRequest\x1a\x13.routeguide.Article\"\x00\x12\x41\n\x06SignIn\x12\x19.routeguide.SignInRequest\x1a\x1a.routeguide.SignInResponse\"\x00\x12;\n\x07SignOut\x12\x1a.routeguide.SignOutRequest\x1a\x12.routeguide.Status\"\x00\x12M\n\nCreateUser\x12\x1d.routeguide.CreateUserRequest\x1a\x1e.routeguide.CreateUserResponse\"\x00\x12\x39\n\x07GetUser\x12\x1a.routeguide.GetUserRequest\x1a\x10.routeguide.User\"\x00\x12J\n\tListUsers\x12\x1c.routeguide.ListUsersRequest\x1a\x1d.routeguide.ListUsersResponse\"\x00\x12?\n\nUpdateUser\x12\x1d.routeguide.UpdateUserRequest\x1a\x10.routeguide.User\"\x00\x12T\n\x14SendVerificationCode\x12\'.routeguide.SendVerificationCodeRequest\x1a\x11.routeguide.Empty\"\x00\x12P\n\x0bVerifyEmail\x12\x1e.routeguide.VerifyEmailRequest\x1a\x1f.routeguide.VerifyEmailResponse\"\x00\x12K\n\x0fValidateNewUser\x12\".routeguide.ValidateNewUserRequest\x1a\x12.routeguide.Status\"\x00\x12G\n\x0eUpdatePassword\x12!.routeguide.UpdatePasswordRequest\x1a\x10.routeguide.User\"\x00\x12Y\n\x0eListActivities\x12!.routeguide.ListActivitiesRequest\x1a\".routeguide.ListActivitiesResponse\"\x00\x12\x62\n\x11ListNotifications\x12$.routeguide.ListNotificationsRequest\x1a%.routeguide.ListNotificationsResponse\"\x00\x12W\n\x12UpdateNotification\x12%.routeguide.UpdateNotificationRequest\x1a\x18.routeguide.Notification\"\x00\x12<\n\tCreateTag\x12\x1c.routeguide.CreateTagRequest\x1a\x0f.routeguide.Tag\"\x00\x12G\n\x08ListTags\x12\x1b.routeguide.ListTagsRequest\x1a\x1c.routeguide.ListTagsResponse\"\x00\x12<\n\tDeleteTag\x12\x1c.routeguide.DeleteTagRequest\x1a\x0f.routeguide.Tag\"\x00\x12H\n\x0cGetStatistic\x12\x1f.routeguide.GetStatisticRequest\x1a\x15.routeguide.Statistic\"\x00\x12Q\n\x0fGetAdminMessage\x12\".routeguide.GetAdminMessageRequest\x1a\x18.routeguide.AdminMessage\"\x00\x12W\n\x12\x43reateSubscription\x12%.routeguide.CreateSubscriptionRequest\x1a\x18.routeguide.Subscription\"\x00\x12\x63\n\x12ListSubscriptioins\x12$.routeguide.ListSubscriptionsRequest\x1a%.routeguide.ListSubscriptionsResponse\"\x00\x12W\n\x12UpdateSubscription\x12%.routeguide.UpdateSubscriptionRequest\x1a\x18.routeguide.Subscription\"\x00\x12W\n\x12\x44\x65leteSubscription\x12%.routeguide.DeleteSubscriptionRequest\x1a\x18.routeguide.Subscription\"\x00\x12i\n\x18\x43reateLegacySubscription\x12+.routeguide.CreateLegacySubscriptionRequest\x1a\x1e.routeguide.LegacySubscription\"\x00\x12u\n\x18ListLegacySubscriptioins\x12*.routeguide.ListLegacySubscriptionsRequest\x1a+.routeguide.ListLegacySubscriptionsResponse\"\x00\x12i\n\x18UpdateLegacySubscription\x12+.routeguide.UpdateLegacySubscriptionRequest\x1a\x1e.routeguide.LegacySubscription\"\x00\x12i\n\x18\x44\x65leteLegacySubscription\x12+.routeguide.DeleteLegacySubscriptionRequest\x1a\x1e.routeguide.LegacySubscription\"\x00\x12O\n\x11UnLegacySubscribe\x12$.routeguide.UnLegacySubscribeRequest\x1a\x12.routeguide.Status\"\x00\x62\x06proto3')

_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, globals())
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'san11_platform_pb2', globals())
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _RESOURCESTATE._serialized_start=9913
  _RESOURCESTATE._serialized_end=10037
  _ACTION._serialized_start=10040
  _ACTION._serialized_end=10197
  _CREATEPACKAGEREQUEST._serialized_start=69
  _CREATEPACKAGEREQUEST._serialized_end=145
  _GETPACKAGEREQUEST._serialized_start=147
  _GETPACKAGEREQUEST._serialized_end=180
  _UPDATEPACKAGEREQUEST._serialized_start=182
  _UPDATEPACKAGEREQUEST._serialized_end=286
  _DELETEPACKAGEREQUEST._serialized_start=288
  _DELETEPACKAGEREQUEST._serialized_end=324
  _LISTPACKAGESREQUEST._serialized_start=326
  _LISTPACKAGESREQUEST._serialized_end=436
  _LISTPACKAGESRESPONSE._serialized_start=438
  _LISTPACKAGESRESPONSE._serialized_end=524
  _SEARCHPACKAGESREQUEST._serialized_start=526
  _SEARCHPACKAGESREQUEST._serialized_end=603
  _SEARCHPACKAGESRESPONSE._serialized_start=605
  _SEARCHPACKAGESRESPONSE._serialized_end=693
  _GETBINARYREQUEST._serialized_start=695
  _GETBINARYREQUEST._serialized_end=727
  _UPLOADBINARYREQUEST._serialized_start=730
  _UPLOADBINARYREQUEST._serialized_end=922
  _CREATEBINARYREQUEST._serialized_start=924
  _CREATEBINARYREQUEST._serialized_end=997
  _BATCHGETBINARYREQUEST._serialized_start=999
  _BATCHGETBINARYREQUEST._serialized_end=1041
  _BATCHGETBINARYRESPONSE._serialized_start=1043
  _BATCHGETBINARYRESPONSE._serialized_end=1105
  _DOWNLOADBINARYREQUEST._serialized_start=1107
  _DOWNLOADBINARYREQUEST._serialized_end=1144
  _DELETEBINARYREQUEST._serialized_start=1146
  _DELETEBINARYREQUEST._serialized_end=1181
  _UPDATEBINARYREQUEST._serialized_start=1183
  _UPDATEBINARYREQUEST._serialized_end=1284
  _LISTBINARIESREQUEST._serialized_start=1286
  _LISTBINARIESREQUEST._serialized_end=1396
  _LISTBINARIESRESPONSE._serialized_start=1398
  _LISTBINARIESRESPONSE._serialized_end=1483
  _UPLOADIMAGEREQUEST._serialized_start=1485
  _UPLOADIMAGEREQUEST._serialized_end=1536
  _CREATEIMAGEREQUEST._serialized_start=1538
  _CREATEIMAGEREQUEST._serialized_end=1611
  _CREATETHREADREQUEST._serialized_start=1613
  _CREATETHREADREQUEST._serialized_end=1686
  _GETTHREADREQUEST._serialized_start=1688
  _GETTHREADREQUEST._serialized_end=1720
  _LISTTHREADSREQUEST._serialized_start=1722
  _LISTTHREADSREQUEST._serialized_end=1831
  _LISTTHREADSRESPONSE._serialized_start=1833
  _LISTTHREADSRESPONSE._serialized_end=1916
  _UPDATETHREADREQUEST._serialized_start=1918
  _UPDATETHREADREQUEST._serialized_end=2019
  _DELETETHREADREQUEST._serialized_start=2021
  _DELETETHREADREQUEST._serialized_end=2056
  _CREATECOMMENTREQUEST._serialized_start=2058
  _CREATECOMMENTREQUEST._serialized_end=2134
  _DELETECOMMENTREQUEST._serialized_start=2136
  _DELETECOMMENTREQUEST._serialized_end=2172
  _UPDATECOMMENTREQUEST._serialized_start=2174
  _UPDATECOMMENTREQUEST._serialized_end=2278
  _LISTCOMMENTSREQUEST._serialized_start=2280
  _LISTCOMMENTSREQUEST._serialized_end=2390
  _LISTCOMMENTSRESPONSE._serialized_start=2392
  _LISTCOMMENTSRESPONSE._serialized_end=2478
  _CREATEREPLYREQUEST._serialized_start=2480
  _CREATEREPLYREQUEST._serialized_end=2550
  _DELETEREPLYREQUEST._serialized_start=2552
  _DELETEREPLYREQUEST._serialized_end=2586
  _UPDATEREPLYREQUEST._serialized_start=2588
  _UPDATEREPLYREQUEST._serialized_end=2686
  _CREATEARTICLEREQUEST._serialized_start=2688
  _CREATEARTICLEREQUEST._serialized_end=2764
  _GETARTICLEREQUEST._serialized_start=2766
  _GETARTICLEREQUEST._serialized_end=2799
  _LISTARTICLESREQUEST._serialized_start=2801
  _LISTARTICLESREQUEST._serialized_end=2911
  _LISTARTICLESRESPONSE._serialized_start=2913
  _LISTARTICLESRESPONSE._serialized_end=2999
  _UPDATEARTICLEREQUEST._serialized_start=3001
  _UPDATEARTICLEREQUEST._serialized_end=3105
  _DELETEARTICLEREQUEST._serialized_start=3107
  _DELETEARTICLEREQUEST._serialized_end=3143
  _GETUSERREQUEST._serialized_start=3145
  _GETUSERREQUEST._serialized_end=3175
  _GETUSERRESPONSE._serialized_start=3177
  _GETUSERRESPONSE._serialized_end=3226
  _SIGNINREQUEST._serialized_start=3228
  _SIGNINREQUEST._serialized_end=3279
  _SIGNINRESPONSE._serialized_start=3281
  _SIGNINRESPONSE._serialized_end=3342
  _SIGNOUTREQUEST._serialized_start=3344
  _SIGNOUTREQUEST._serialized_end=3360
  _CREATEUSERREQUEST._serialized_start=3362
  _CREATEUSERREQUEST._serialized_end=3474
  _CREATEUSERRESPONSE._serialized_start=3476
  _CREATEUSERRESPONSE._serialized_end=3541
  _UPDATEUSERREQUEST._serialized_start=3543
  _UPDATEUSERREQUEST._serialized_end=3638
  _UPDATEPASSWORDREQUEST._serialized_start=3640
  _UPDATEPASSWORDREQUEST._serialized_end=3722
  _LISTUSERSREQUEST._serialized_start=3724
  _LISTUSERSREQUEST._serialized_end=3831
  _LISTUSERSRESPONSE._serialized_start=3833
  _LISTUSERSRESPONSE._serialized_end=3910
  _SENDVERIFICATIONCODEREQUEST._serialized_start=3912
  _SENDVERIFICATIONCODEREQUEST._serialized_end=3956
  _VERIFYEMAILREQUEST._serialized_start=3958
  _VERIFYEMAILREQUEST._serialized_end=4020
  _VERIFYEMAILRESPONSE._serialized_start=4022
  _VERIFYEMAILRESPONSE._serialized_end=4087
  _VALIDATENEWUSERREQUEST._serialized_start=4089
  _VALIDATENEWUSERREQUEST._serialized_end=4145
  _LISTACTIVITIESREQUEST._serialized_start=4147
  _LISTACTIVITIESREQUEST._serialized_end=4259
  _LISTACTIVITIESRESPONSE._serialized_start=4261
  _LISTACTIVITIESRESPONSE._serialized_end=4352
  _LISTNOTIFICATIONSREQUEST._serialized_start=4354
  _LISTNOTIFICATIONSREQUEST._serialized_end=4469
  _LISTNOTIFICATIONSRESPONSE._serialized_start=4471
  _LISTNOTIFICATIONSRESPONSE._serialized_end=4572
  _UPDATENOTIFICATIONREQUEST._serialized_start=4574
  _UPDATENOTIFICATIONREQUEST._serialized_end=4693
  _CREATETAGREQUEST._serialized_start=4695
  _CREATETAGREQUEST._serialized_end=4759
  _LISTTAGSREQUEST._serialized_start=4761
  _LISTTAGSREQUEST._serialized_end=4867
  _LISTTAGSRESPONSE._serialized_start=4869
  _LISTTAGSRESPONSE._serialized_end=4943
  _DELETETAGREQUEST._serialized_start=4945
  _DELETETAGREQUEST._serialized_end=4977
  _GETSTATISTICREQUEST._serialized_start=4979
  _GETSTATISTICREQUEST._serialized_end=5014
  _GETADMINMESSAGEREQUEST._serialized_start=5016
  _GETADMINMESSAGEREQUEST._serialized_end=5040
  _CREATESUBSCRIPTIONREQUEST._serialized_start=5042
  _CREATESUBSCRIPTIONREQUEST._serialized_end=5133
  _LISTSUBSCRIPTIONSREQUEST._serialized_start=5135
  _LISTSUBSCRIPTIONSREQUEST._serialized_end=5250
  _LISTSUBSCRIPTIONSRESPONSE._serialized_start=5252
  _LISTSUBSCRIPTIONSRESPONSE._serialized_end=5353
  _UPDATESUBSCRIPTIONREQUEST._serialized_start=5355
  _UPDATESUBSCRIPTIONREQUEST._serialized_end=5474
  _DELETESUBSCRIPTIONREQUEST._serialized_start=5476
  _DELETESUBSCRIPTIONREQUEST._serialized_end=5517
  _CREATELEGACYSUBSCRIPTIONREQUEST._serialized_start=5519
  _CREATELEGACYSUBSCRIPTIONREQUEST._serialized_end=5616
  _LISTLEGACYSUBSCRIPTIONSREQUEST._serialized_start=5618
  _LISTLEGACYSUBSCRIPTIONSREQUEST._serialized_end=5739
  _LISTLEGACYSUBSCRIPTIONSRESPONSE._serialized_start=5741
  _LISTLEGACYSUBSCRIPTIONSRESPONSE._serialized_end=5854
  _UPDATELEGACYSUBSCRIPTIONREQUEST._serialized_start=5856
  _UPDATELEGACYSUBSCRIPTIONREQUEST._serialized_end=5981
  _DELETELEGACYSUBSCRIPTIONREQUEST._serialized_start=5983
  _DELETELEGACYSUBSCRIPTIONREQUEST._serialized_end=6030
  _UNLEGACYSUBSCRIBEREQUEST._serialized_start=6032
  _UNLEGACYSUBSCRIBEREQUEST._serialized_end=6110
  _EMPTY._serialized_start=6112
  _EMPTY._serialized_end=6119
  _STATUS._serialized_start=6121
  _STATUS._serialized_end=6160
  _PACKAGE._serialized_start=6163
  _PACKAGE._serialized_end=6450
  _BINARY._serialized_start=6453
  _BINARY._serialized_end=6745
  _USER._serialized_start=6748
  _USER._serialized_end=7138
  _USER_USERTYPE._serialized_start=7065
  _USER_USERTYPE._serialized_end=7138
  _VERSION._serialized_start=7140
  _VERSION._serialized_end=7194
  _STATISTIC._serialized_start=7196
  _STATISTIC._serialized_end=7252
  _URL._serialized_start=7254
  _URL._serialized_end=7272
  _THREAD._serialized_start=7275
  _THREAD._serialized_end=7692
  _COMMENT._serialized_start=7695
  _COMMENT._serialized_end=7928
  _REPLY._serialized_start=7931
  _REPLY._serialized_end=8105
  _TAG._serialized_start=8107
  _TAG._serialized_end=8161
  _ADMINMESSAGE._serialized_start=8163
  _ADMINMESSAGE._serialized_end=8194
  _AUTH._serialized_start=8196
  _AUTH._serialized_end=8224
  _ACTIVITY._serialized_start=8227
  _ACTIVITY._serialized_end=8357
  _NOTIFICATION._serialized_start=8360
  _NOTIFICATION._serialized_end=8575
  _RESOURCEVIEW._serialized_start=8577
  _RESOURCEVIEW._serialized_end=8667
  _ARTICLE._serialized_start=8670
  _ARTICLE._serialized_end=8940
  _FILE._serialized_start=8943
  _FILE._serialized_end=9102
  _FILE_SERVER._serialized_start=9049
  _FILE_SERVER._serialized_end=9102
  _SUBSCRIPTION._serialized_start=9105
  _SUBSCRIPTION._serialized_end=9359
  _SUBSCRIPTION_SUBSCRIBETYPE._serialized_start=9303
  _SUBSCRIPTION_SUBSCRIBETYPE._serialized_end=9359
  _LEGACYSUBSCRIPTION._serialized_start=9362
  _LEGACYSUBSCRIPTION._serialized_end=9635
  _LEGACYSUBSCRIPTION_SUBSCRIBETYPE._serialized_start=9303
  _LEGACYSUBSCRIPTION_SUBSCRIBETYPE._serialized_end=9359
  _USERSETTINGS._serialized_start=9638
  _USERSETTINGS._serialized_end=9883
  _USERSETTINGS_NOTIFICATIONSETTING._serialized_start=9723
  _USERSETTINGS_NOTIFICATIONSETTING._serialized_end=9883
  _FIELDMASK._serialized_start=9885
  _FIELDMASK._serialized_end=9911
  _ROUTEGUIDE._serialized_start=10200
  _ROUTEGUIDE._serialized_end=14767
# @@protoc_insertion_point(module_scope)
