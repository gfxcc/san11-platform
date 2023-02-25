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


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x14san11-platform.proto\x12\nrouteguide\x1a\x1fgoogle/protobuf/timestamp.proto\"L\n\x14\x43reatePackageRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12$\n\x07package\x18\x02 \x01(\x0b\x32\x13.routeguide.Package\"!\n\x11GetPackageRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"h\n\x14UpdatePackageRequest\x12$\n\x07package\x18\x01 \x01(\x0b\x32\x13.routeguide.Package\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"$\n\x14\x44\x65letePackageRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"n\n\x13ListPackagesRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"V\n\x14ListPackagesResponse\x12%\n\x08packages\x18\x01 \x03(\x0b\x32\x13.routeguide.Package\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"M\n\x15SearchPackagesRequest\x12\r\n\x05query\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\"X\n\x16SearchPackagesResponse\x12%\n\x08packages\x18\x01 \x03(\x0b\x32\x13.routeguide.Package\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\" \n\x10GetBinaryRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"\xc0\x01\n\x13UploadBinaryRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\"\n\x06\x62inary\x18\x02 \x01(\x0b\x32\x12.routeguide.Binary\x12\x0e\n\x04\x64\x61ta\x18\x03 \x01(\x0cH\x00\x12\x19\n\x0f\x64ownload_method\x18\x04 \x01(\tH\x00\x12\r\n\x03url\x18\x07 \x01(\tH\x00\x12\x14\n\x0csire_version\x18\x05 \x01(\x03\x12\x19\n\x11sire_auto_convert\x18\x06 \x01(\x08\x42\n\n\x08resource\"I\n\x13\x43reateBinaryRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\"\n\x06\x62inary\x18\x02 \x01(\x0b\x32\x12.routeguide.Binary\"*\n\x15\x42\x61tchGetBinaryRequest\x12\x11\n\tbinary_id\x18\x01 \x03(\x03\">\n\x16\x42\x61tchGetBinaryResponse\x12$\n\x08\x62inaries\x18\x01 \x03(\x0b\x32\x12.routeguide.Binary\"%\n\x15\x44ownloadBinaryRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"#\n\x13\x44\x65leteBinaryRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"e\n\x13UpdateBinaryRequest\x12\"\n\x06\x62inary\x18\x01 \x01(\x0b\x32\x12.routeguide.Binary\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"n\n\x13ListBinariesRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"U\n\x14ListBinariesResponse\x12$\n\x08\x62inaries\x18\x01 \x03(\x0b\x32\x12.routeguide.Binary\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"3\n\x12UploadImageRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\r\n\x05image\x18\x02 \x01(\x0c\"\\\n\x12\x43reateImageRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x0b\n\x03url\x18\x02 \x01(\t\x12)\n\nimage_type\x18\x03 \x01(\x0e\x32\x15.routeguide.ImageType\"I\n\x13\x43reateThreadRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\"\n\x06thread\x18\x02 \x01(\x0b\x32\x12.routeguide.Thread\" \n\x10GetThreadRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"m\n\x12ListThreadsRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"S\n\x13ListThreadsResponse\x12#\n\x07threads\x18\x01 \x03(\x0b\x32\x12.routeguide.Thread\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"e\n\x13UpdateThreadRequest\x12\"\n\x06thread\x18\x01 \x01(\x0b\x32\x12.routeguide.Thread\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"#\n\x13\x44\x65leteThreadRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"L\n\x14\x43reateCommentRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12$\n\x07\x63omment\x18\x02 \x01(\x0b\x32\x13.routeguide.Comment\"$\n\x14\x44\x65leteCommentRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"h\n\x14UpdateCommentRequest\x12$\n\x07\x63omment\x18\x01 \x01(\x0b\x32\x13.routeguide.Comment\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"n\n\x13ListCommentsRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"V\n\x14ListCommentsResponse\x12%\n\x08\x63omments\x18\x01 \x03(\x0b\x32\x13.routeguide.Comment\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"F\n\x12\x43reateReplyRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12 \n\x05reply\x18\x02 \x01(\x0b\x32\x11.routeguide.Reply\"\"\n\x12\x44\x65leteReplyRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"b\n\x12UpdateReplyRequest\x12 \n\x05reply\x18\x01 \x01(\x0b\x32\x11.routeguide.Reply\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"L\n\x14\x43reateArticleRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12$\n\x07\x61rticle\x18\x02 \x01(\x0b\x32\x13.routeguide.Article\"!\n\x11GetArticleRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"n\n\x13ListArticlesRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"V\n\x14ListArticlesResponse\x12%\n\x08\x61rticles\x18\x01 \x03(\x0b\x32\x13.routeguide.Article\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"h\n\x14UpdateArticleRequest\x12$\n\x07\x61rticle\x18\x01 \x01(\x0b\x32\x13.routeguide.Article\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"$\n\x14\x44\x65leteArticleRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"\x1e\n\x0eGetUserRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"1\n\x0fGetUserResponse\x12\x1e\n\x04user\x18\x01 \x01(\x0b\x32\x10.routeguide.User\"3\n\rSignInRequest\x12\x10\n\x08identity\x18\x01 \x01(\t\x12\x10\n\x08password\x18\x02 \x01(\t\"=\n\x0eSignInResponse\x12\x1e\n\x04user\x18\x02 \x01(\x0b\x32\x10.routeguide.User\x12\x0b\n\x03sid\x18\x03 \x01(\t\"\x10\n\x0eSignOutRequest\"p\n\x11\x43reateUserRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x1e\n\x04user\x18\x02 \x01(\x0b\x32\x10.routeguide.User\x12\x10\n\x08password\x18\x03 \x01(\t\x12\x19\n\x11verification_code\x18\x04 \x01(\t\"A\n\x12\x43reateUserResponse\x12\x1e\n\x04user\x18\x01 \x01(\x0b\x32\x10.routeguide.User\x12\x0b\n\x03sid\x18\x02 \x01(\t\"_\n\x11UpdateUserRequest\x12\x1e\n\x04user\x18\x01 \x01(\x0b\x32\x10.routeguide.User\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"R\n\x15UpdatePasswordRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x10\n\x08password\x18\x02 \x01(\t\x12\x19\n\x11verification_code\x18\x03 \x01(\t\"k\n\x10ListUsersRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"M\n\x11ListUsersResponse\x12\x1f\n\x05users\x18\x01 \x03(\x0b\x32\x10.routeguide.User\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\",\n\x1bSendVerificationCodeRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\">\n\x12VerifyEmailRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\x12\x19\n\x11verification_code\x18\x02 \x01(\t\"A\n\x13VerifyEmailResponse\x12\n\n\x02ok\x18\x01 \x01(\x08\x12\x1e\n\x04user\x18\x02 \x01(\x0b\x32\x10.routeguide.User\"8\n\x16ValidateNewUserRequest\x12\x1e\n\x04user\x18\x01 \x01(\x0b\x32\x10.routeguide.User\"p\n\x15ListActivitiesRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"[\n\x16ListActivitiesResponse\x12(\n\nactivities\x18\x01 \x03(\x0b\x32\x14.routeguide.Activity\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"s\n\x18ListNotificationsRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"e\n\x19ListNotificationsResponse\x12\x17\n\x0fnext_page_token\x18\x01 \x01(\t\x12/\n\rnotifications\x18\x02 \x03(\x0b\x32\x18.routeguide.Notification\"w\n\x19UpdateNotificationRequest\x12.\n\x0cnotification\x18\x01 \x01(\x0b\x32\x18.routeguide.Notification\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\"@\n\x10\x43reateTagRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x1c\n\x03tag\x18\x02 \x01(\x0b\x32\x0f.routeguide.Tag\"j\n\x0fListTagsRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"J\n\x10ListTagsResponse\x12\x1d\n\x04tags\x18\x01 \x03(\x0b\x32\x0f.routeguide.Tag\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\" \n\x10\x44\x65leteTagRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"#\n\x13GetStatisticRequest\x12\x0c\n\x04\x64\x61te\x18\x01 \x01(\t\"\x18\n\x16GetAdminMessageRequest\"[\n\x19\x43reateSubscriptionRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12.\n\x0csubscription\x18\x02 \x01(\x0b\x32\x18.routeguide.Subscription\"s\n\x18ListSubscriptionsRequest\x12\x0e\n\x06parent\x18\x01 \x01(\t\x12\x11\n\tpage_size\x18\x02 \x01(\x03\x12\x12\n\npage_token\x18\x03 \x01(\t\x12\x10\n\x08order_by\x18\x04 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x05 \x01(\t\"e\n\x19ListSubscriptionsResponse\x12/\n\rsubscriptions\x18\x01 \x03(\x0b\x32\x18.routeguide.Subscription\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"w\n\x19UpdateSubscriptionRequest\x12.\n\x0csubscription\x18\x01 \x01(\x0b\x32\x18.routeguide.Subscription\x12*\n\x0bupdate_mask\x18\x02 \x01(\x0b\x32\x15.routeguide.FieldMask\")\n\x19\x44\x65leteSubscriptionRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"\x07\n\x05\x45mpty\"\'\n\x06Status\x12\x0c\n\x04\x63ode\x18\x01 \x01(\x03\x12\x0f\n\x07message\x18\x02 \x01(\t\"\x9f\x02\n\x07Package\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x14\n\x0cpackage_name\x18\x02 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x03 \x01(\t\x12\x13\n\x0b\x63reate_time\x18\x04 \x01(\t\x12\x13\n\x0bupdate_time\x18\x06 \x01(\t\x12(\n\x05state\x18\x07 \x01(\x0e\x32\x19.routeguide.ResourceState\x12\x11\n\tauthor_id\x18\x08 \x01(\x03\x12\x12\n\nimage_urls\x18\n \x03(\t\x12\x1d\n\x04tags\x18\x0b \x03(\x0b\x32\x0f.routeguide.Tag\x12\x16\n\x0e\x64ownload_count\x18\x14 \x01(\x03\x12\x12\n\nlike_count\x18\x15 \x01(\x03\x12\x15\n\rdislike_count\x18\x16 \x01(\x03\"\xa4\x02\n\x06\x42inary\x12\x11\n\tbinary_id\x18\x01 \x01(\x03\x12\x12\n\npackage_id\x18\x02 \x01(\x03\x12\x16\n\x0e\x64ownload_count\x18\x04 \x01(\x03\x12$\n\x07version\x18\x05 \x01(\x0b\x32\x13.routeguide.Version\x12\x13\n\x0b\x64\x65scription\x18\x06 \x01(\t\x12\x13\n\x0b\x63reate_time\x18\x07 \x01(\t\x12\x0b\n\x03tag\x18\x08 \x01(\t\x12\x0c\n\x04size\x18\n \x01(\t\x12\x0c\n\x04name\x18\x0b \x01(\t\x12\x13\n\x0bupdate_time\x18\x0c \x01(\t\x12 \n\x04\x66ile\x18\r \x01(\x0b\x32\x10.routeguide.FileH\x00\x12\x19\n\x0f\x64ownload_method\x18\x0e \x01(\tH\x00\x42\n\n\x08resourceJ\x04\x08\t\x10\n\"\x86\x03\n\x04User\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x10\n\x08username\x18\x02 \x01(\t\x12\r\n\x05\x65mail\x18\x03 \x01(\t\x12\'\n\x04type\x18\x04 \x01(\x0e\x32\x19.routeguide.User.UserType\x12\x11\n\timage_url\x18\x05 \x01(\t\x12\x0f\n\x07website\x18\x06 \x01(\t\x12\x0f\n\x07user_id\x18\x07 \x01(\x03\x12\x18\n\x10subscriber_count\x18\x08 \x01(\x03\x12/\n\x0b\x63reate_time\x18\t \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\n \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12*\n\x08settings\x18\x0b \x01(\x0b\x32\x18.routeguide.UserSettings\"I\n\x08UserType\x12\x19\n\x15USER_TYPE_UNSPECIFIED\x10\x00\x12\t\n\x05\x41\x44MIN\x10\x01\x12\n\n\x06TESTER\x10\x02\x12\x0b\n\x07REGULAR\x10\x0b\"6\n\x07Version\x12\r\n\x05major\x18\x01 \x01(\x03\x12\r\n\x05minor\x18\x02 \x01(\x03\x12\r\n\x05patch\x18\x03 \x01(\x03\"8\n\tStatistic\x12\x13\n\x0bvisit_count\x18\x01 \x01(\x03\x12\x16\n\x0e\x64ownload_count\x18\x02 \x01(\x03\"\x12\n\x03Url\x12\x0b\n\x03url\x18\x01 \x01(\t\"\xa1\x03\n\x06Thread\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x0f\n\x07subject\x18\x02 \x01(\t\x12\x0f\n\x07\x63ontent\x18\x03 \x01(\t\x12\x11\n\tauthor_id\x18\x04 \x01(\x03\x12/\n\x0b\x63reate_time\x18\x05 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x06 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12(\n\x05state\x18\x07 \x01(\x0e\x32\x19.routeguide.ResourceState\x12\x0c\n\x04tags\x18\x08 \x03(\t\x12\x0e\n\x06pinned\x18\t \x01(\x08\x12\x39\n\x15latest_commented_time\x18\n \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x1b\n\x13latest_commenter_id\x18\x0b \x01(\x03\x12\x12\n\nview_count\x18\x15 \x01(\x03\x12\x12\n\nlike_count\x18\x16 \x01(\x03\x12\x15\n\rcomment_count\x18\x17 \x01(\x03\x12\x13\n\x0breply_count\x18\x18 \x01(\x03\"\xe9\x01\n\x07\x43omment\x12\x0c\n\x04name\x18\x01 \x01(\t\x12/\n\x0b\x63reate_time\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x04 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x0c\n\x04text\x18\x05 \x01(\t\x12\x11\n\tauthor_id\x18\x06 \x01(\x03\x12\x14\n\x0cupvote_count\x18\x07 \x01(\x03\x12\"\n\x07replies\x18\x08 \x03(\x0b\x32\x11.routeguide.Reply\x12\r\n\x05index\x18\t \x01(\x03J\x04\x08\x02\x10\x03\"\xae\x01\n\x05Reply\x12\x0c\n\x04name\x18\x01 \x01(\t\x12/\n\x0b\x63reate_time\x18\x02 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x0c\n\x04text\x18\x04 \x01(\t\x12\x11\n\tauthor_id\x18\x05 \x01(\x03\x12\x14\n\x0cupvote_count\x18\x06 \x01(\x03\"6\n\x03Tag\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x10\n\x08tag_name\x18\x02 \x01(\t\x12\x0f\n\x07mutable\x18\x03 \x01(\x08\"\x1f\n\x0c\x41\x64minMessage\x12\x0f\n\x07message\x18\x01 \x01(\t\"\x1c\n\x04\x41uth\x12\x14\n\x0coauth2_token\x18\x01 \x01(\t\"\x82\x01\n\x08\x41\x63tivity\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x13\n\x0b\x63reate_time\x18\x02 \x01(\t\x12\"\n\x06\x61\x63tion\x18\x03 \x01(\x0e\x32\x12.routeguide.Action\x12/\n\rresource_view\x18\x04 \x01(\x0b\x32\x18.routeguide.ResourceView\"\xd7\x01\n\x0cNotification\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x11\n\tsender_id\x18\x02 \x01(\x03\x12/\n\x0b\x63reate_time\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x04 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x0e\n\x06unread\x18\x05 \x01(\x08\x12\x0f\n\x07\x63ontent\x18\x06 \x01(\t\x12\x15\n\rimage_preview\x18\x07 \x01(\t\x12\x0c\n\x04link\x18\x08 \x01(\t\"Z\n\x0cResourceView\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x14\n\x0c\x64isplay_name\x18\x02 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x03 \x01(\t\x12\x11\n\timage_url\x18\x04 \x01(\t\"\x8e\x02\n\x07\x41rticle\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x0f\n\x07subject\x18\x02 \x01(\t\x12\x0f\n\x07\x63ontent\x18\x03 \x01(\t\x12\x11\n\tauthor_id\x18\x04 \x01(\x03\x12/\n\x0b\x63reate_time\x18\x05 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x06 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12(\n\x05state\x18\x07 \x01(\x0e\x32\x19.routeguide.ResourceState\x12\x0c\n\x04tags\x18\x08 \x03(\t\x12\x12\n\nview_count\x18\x15 \x01(\x03\x12\x12\n\nlike_count\x18\x16 \x01(\x03\"\x9f\x01\n\x04\x46ile\x12\x10\n\x08\x66ilename\x18\x01 \x01(\t\x12\x0b\n\x03\x65xt\x18\x02 \x01(\t\x12\'\n\x06server\x18\x04 \x01(\x0e\x32\x17.routeguide.File.Server\x12\x0b\n\x03uri\x18\x03 \x01(\t\x12\x0b\n\x03url\x18\x05 \x01(\t\"5\n\x06Server\x12\x16\n\x12SERVER_UNSPECIFIED\x10\x00\x12\x07\n\x03GCS\x10\x01\x12\n\n\x06\x41WS_S3\x10\x02\"\x8e\x01\n\x0cSubscription\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x0e\n\x06target\x18\x02 \x01(\t\x12/\n\x0b\x63reate_time\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x04 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\"\x91\x02\n\x12LegacySubscription\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x15\n\rsubscriber_id\x18\x02 \x01(\x03\x12/\n\x0b\x63reate_time\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12/\n\x0bupdate_time\x18\x04 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12:\n\x04type\x18\x05 \x01(\x0e\x32,.routeguide.LegacySubscription.SubscribeType\"8\n\rSubscribeType\x12\x1e\n\x1aSUBSCRIBE_TYPE_UNSPECIFIED\x10\x00\x12\x07\n\x03\x41LL\x10\x01\"\xf5\x01\n\x0cUserSettings\x12\x42\n\x0cnotification\x18\x01 \x01(\x0b\x32,.routeguide.UserSettings.NotificationSetting\x1a\xa0\x01\n\x13NotificationSetting\x12\x13\n\x0bsend_emails\x18\x01 \x01(\x08\x12\x15\n\rsubscriptions\x18\x0b \x01(\x08\x12\x17\n\x0frecommendations\x18\x0c \x01(\x08\x12\x10\n\x08mentions\x18\r \x01(\x08\x12\x0f\n\x07threads\x18\x0e \x01(\x08\x12\x10\n\x08\x63omments\x18\x0f \x01(\x08\x12\x0f\n\x07replies\x18\x10 \x01(\x08\"\x1a\n\tFieldMask\x12\r\n\x05paths\x18\x01 \x03(\t*|\n\rResourceState\x12\x1e\n\x1aRESOURCE_STATE_UNSPECIFIED\x10\x00\x12\n\n\x06NORMAL\x10\x01\x12\x10\n\x0cUNDER_REVIEW\x10\x02\x12\n\n\x06HIDDEN\x10\x03\x12\x14\n\x10SCHEDULED_DELETE\x10\x04\x12\x0b\n\x07\x44\x45LETED\x10\x05*\xae\x01\n\x06\x41\x63tion\x12\x16\n\x12\x41\x43TION_UNSPECIFIED\x10\x00\x12\n\n\x06\x43REATE\x10\x01\x12\n\n\x06\x44\x45LETE\x10\x02\x12\n\n\x06UPDATE\x10\x03\x12\n\n\x06SELECT\x10\x04\x12\x08\n\x04LIKE\x10\x0b\x12\n\n\x06UPVOTE\x10\x0c\x12\r\n\tSUBSCRIBE\x10\r\x12\x0f\n\x0bUNSUBSCRIBE\x10\x0f\x12\x0b\n\x07\x44ISLIKE\x10\x0e\x12\x0c\n\x08\x44OWNLOAD\x10\x15\x12\x0b\n\x07\x43OLLECT\x10\x16*Y\n\tImageType\x12\x1a\n\x16IMAGE_TYPE_UNSPECIFIED\x10\x00\x12\x0e\n\nSCREENSHOT\x10\x01\x12\x0f\n\x0bUSER_AVATAR\x10\x02\x12\x0f\n\x0b\x44\x45SCRIPTION\x10\x03\x32\xce\x1f\n\nRouteGuide\x12H\n\rCreatePackage\x12 .routeguide.CreatePackageRequest\x1a\x13.routeguide.Package\"\x00\x12\x42\n\nGetPackage\x12\x1d.routeguide.GetPackageRequest\x1a\x13.routeguide.Package\"\x00\x12S\n\x0cListPackages\x12\x1f.routeguide.ListPackagesRequest\x1a .routeguide.ListPackagesResponse\"\x00\x12H\n\rUpdatePackage\x12 .routeguide.UpdatePackageRequest\x1a\x13.routeguide.Package\"\x00\x12H\n\rDeletePackage\x12 .routeguide.DeletePackageRequest\x1a\x13.routeguide.Package\"\x00\x12Y\n\x0eSearchPackages\x12!.routeguide.SearchPackagesRequest\x1a\".routeguide.SearchPackagesResponse\"\x00\x12\x45\n\x0c\x43reateBinary\x12\x1f.routeguide.CreateBinaryRequest\x1a\x12.routeguide.Binary\"\x00\x12?\n\tGetBinary\x12\x1c.routeguide.GetBinaryRequest\x1a\x12.routeguide.Binary\"\x00\x12Y\n\x0e\x42\x61tchGetBinary\x12!.routeguide.BatchGetBinaryRequest\x1a\".routeguide.BatchGetBinaryResponse\"\x00\x12S\n\x0cListBinaries\x12\x1f.routeguide.ListBinariesRequest\x1a .routeguide.ListBinariesResponse\"\x00\x12\x45\n\x0cUpdateBinary\x12\x1f.routeguide.UpdateBinaryRequest\x1a\x12.routeguide.Binary\"\x00\x12\x45\n\x0c\x44\x65leteBinary\x12\x1f.routeguide.DeleteBinaryRequest\x1a\x12.routeguide.Binary\"\x00\x12I\n\x0e\x44ownloadBinary\x12!.routeguide.DownloadBinaryRequest\x1a\x12.routeguide.Binary\"\x00\x12@\n\x0b\x43reateImage\x12\x1e.routeguide.CreateImageRequest\x1a\x0f.routeguide.Url\"\x00\x12\x45\n\x0c\x43reateThread\x12\x1f.routeguide.CreateThreadRequest\x1a\x12.routeguide.Thread\"\x00\x12?\n\tGetThread\x12\x1c.routeguide.GetThreadRequest\x1a\x12.routeguide.Thread\"\x00\x12P\n\x0bListThreads\x12\x1e.routeguide.ListThreadsRequest\x1a\x1f.routeguide.ListThreadsResponse\"\x00\x12\x45\n\x0cUpdateThread\x12\x1f.routeguide.UpdateThreadRequest\x1a\x12.routeguide.Thread\"\x00\x12\x45\n\x0c\x44\x65leteThread\x12\x1f.routeguide.DeleteThreadRequest\x1a\x12.routeguide.Thread\"\x00\x12H\n\rCreateComment\x12 .routeguide.CreateCommentRequest\x1a\x13.routeguide.Comment\"\x00\x12S\n\x0cListComments\x12\x1f.routeguide.ListCommentsRequest\x1a .routeguide.ListCommentsResponse\"\x00\x12H\n\rUpdateComment\x12 .routeguide.UpdateCommentRequest\x1a\x13.routeguide.Comment\"\x00\x12H\n\rDeleteComment\x12 .routeguide.DeleteCommentRequest\x1a\x13.routeguide.Comment\"\x00\x12\x42\n\x0b\x43reateReply\x12\x1e.routeguide.CreateReplyRequest\x1a\x11.routeguide.Reply\"\x00\x12\x42\n\x0bUpdateReply\x12\x1e.routeguide.UpdateReplyRequest\x1a\x11.routeguide.Reply\"\x00\x12\x42\n\x0b\x44\x65leteReply\x12\x1e.routeguide.DeleteReplyRequest\x1a\x11.routeguide.Reply\"\x00\x12H\n\rCreateArticle\x12 .routeguide.CreateArticleRequest\x1a\x13.routeguide.Article\"\x00\x12\x42\n\nGetArticle\x12\x1d.routeguide.GetArticleRequest\x1a\x13.routeguide.Article\"\x00\x12S\n\x0cListArticles\x12\x1f.routeguide.ListArticlesRequest\x1a .routeguide.ListArticlesResponse\"\x00\x12H\n\rUpdateArticle\x12 .routeguide.UpdateArticleRequest\x1a\x13.routeguide.Article\"\x00\x12H\n\rDeleteArticle\x12 .routeguide.DeleteArticleRequest\x1a\x13.routeguide.Article\"\x00\x12\x41\n\x06SignIn\x12\x19.routeguide.SignInRequest\x1a\x1a.routeguide.SignInResponse\"\x00\x12;\n\x07SignOut\x12\x1a.routeguide.SignOutRequest\x1a\x12.routeguide.Status\"\x00\x12M\n\nCreateUser\x12\x1d.routeguide.CreateUserRequest\x1a\x1e.routeguide.CreateUserResponse\"\x00\x12\x39\n\x07GetUser\x12\x1a.routeguide.GetUserRequest\x1a\x10.routeguide.User\"\x00\x12J\n\tListUsers\x12\x1c.routeguide.ListUsersRequest\x1a\x1d.routeguide.ListUsersResponse\"\x00\x12?\n\nUpdateUser\x12\x1d.routeguide.UpdateUserRequest\x1a\x10.routeguide.User\"\x00\x12T\n\x14SendVerificationCode\x12\'.routeguide.SendVerificationCodeRequest\x1a\x11.routeguide.Empty\"\x00\x12P\n\x0bVerifyEmail\x12\x1e.routeguide.VerifyEmailRequest\x1a\x1f.routeguide.VerifyEmailResponse\"\x00\x12K\n\x0fValidateNewUser\x12\".routeguide.ValidateNewUserRequest\x1a\x12.routeguide.Status\"\x00\x12G\n\x0eUpdatePassword\x12!.routeguide.UpdatePasswordRequest\x1a\x10.routeguide.User\"\x00\x12Y\n\x0eListActivities\x12!.routeguide.ListActivitiesRequest\x1a\".routeguide.ListActivitiesResponse\"\x00\x12\x62\n\x11ListNotifications\x12$.routeguide.ListNotificationsRequest\x1a%.routeguide.ListNotificationsResponse\"\x00\x12W\n\x12UpdateNotification\x12%.routeguide.UpdateNotificationRequest\x1a\x18.routeguide.Notification\"\x00\x12<\n\tCreateTag\x12\x1c.routeguide.CreateTagRequest\x1a\x0f.routeguide.Tag\"\x00\x12G\n\x08ListTags\x12\x1b.routeguide.ListTagsRequest\x1a\x1c.routeguide.ListTagsResponse\"\x00\x12<\n\tDeleteTag\x12\x1c.routeguide.DeleteTagRequest\x1a\x0f.routeguide.Tag\"\x00\x12H\n\x0cGetStatistic\x12\x1f.routeguide.GetStatisticRequest\x1a\x15.routeguide.Statistic\"\x00\x12Q\n\x0fGetAdminMessage\x12\".routeguide.GetAdminMessageRequest\x1a\x18.routeguide.AdminMessage\"\x00\x12W\n\x12\x43reateSubscription\x12%.routeguide.CreateSubscriptionRequest\x1a\x18.routeguide.Subscription\"\x00\x12\x63\n\x12ListSubscriptioins\x12$.routeguide.ListSubscriptionsRequest\x1a%.routeguide.ListSubscriptionsResponse\"\x00\x12W\n\x12UpdateSubscription\x12%.routeguide.UpdateSubscriptionRequest\x1a\x18.routeguide.Subscription\"\x00\x12W\n\x12\x44\x65leteSubscription\x12%.routeguide.DeleteSubscriptionRequest\x1a\x18.routeguide.Subscription\"\x00\x62\x06proto3')

_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, globals())
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'san11_platform_pb2', globals())
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _RESOURCESTATE._serialized_start=9227
  _RESOURCESTATE._serialized_end=9351
  _ACTION._serialized_start=9354
  _ACTION._serialized_end=9528
  _IMAGETYPE._serialized_start=9530
  _IMAGETYPE._serialized_end=9619
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
  _CREATEIMAGEREQUEST._serialized_end=1630
  _CREATETHREADREQUEST._serialized_start=1632
  _CREATETHREADREQUEST._serialized_end=1705
  _GETTHREADREQUEST._serialized_start=1707
  _GETTHREADREQUEST._serialized_end=1739
  _LISTTHREADSREQUEST._serialized_start=1741
  _LISTTHREADSREQUEST._serialized_end=1850
  _LISTTHREADSRESPONSE._serialized_start=1852
  _LISTTHREADSRESPONSE._serialized_end=1935
  _UPDATETHREADREQUEST._serialized_start=1937
  _UPDATETHREADREQUEST._serialized_end=2038
  _DELETETHREADREQUEST._serialized_start=2040
  _DELETETHREADREQUEST._serialized_end=2075
  _CREATECOMMENTREQUEST._serialized_start=2077
  _CREATECOMMENTREQUEST._serialized_end=2153
  _DELETECOMMENTREQUEST._serialized_start=2155
  _DELETECOMMENTREQUEST._serialized_end=2191
  _UPDATECOMMENTREQUEST._serialized_start=2193
  _UPDATECOMMENTREQUEST._serialized_end=2297
  _LISTCOMMENTSREQUEST._serialized_start=2299
  _LISTCOMMENTSREQUEST._serialized_end=2409
  _LISTCOMMENTSRESPONSE._serialized_start=2411
  _LISTCOMMENTSRESPONSE._serialized_end=2497
  _CREATEREPLYREQUEST._serialized_start=2499
  _CREATEREPLYREQUEST._serialized_end=2569
  _DELETEREPLYREQUEST._serialized_start=2571
  _DELETEREPLYREQUEST._serialized_end=2605
  _UPDATEREPLYREQUEST._serialized_start=2607
  _UPDATEREPLYREQUEST._serialized_end=2705
  _CREATEARTICLEREQUEST._serialized_start=2707
  _CREATEARTICLEREQUEST._serialized_end=2783
  _GETARTICLEREQUEST._serialized_start=2785
  _GETARTICLEREQUEST._serialized_end=2818
  _LISTARTICLESREQUEST._serialized_start=2820
  _LISTARTICLESREQUEST._serialized_end=2930
  _LISTARTICLESRESPONSE._serialized_start=2932
  _LISTARTICLESRESPONSE._serialized_end=3018
  _UPDATEARTICLEREQUEST._serialized_start=3020
  _UPDATEARTICLEREQUEST._serialized_end=3124
  _DELETEARTICLEREQUEST._serialized_start=3126
  _DELETEARTICLEREQUEST._serialized_end=3162
  _GETUSERREQUEST._serialized_start=3164
  _GETUSERREQUEST._serialized_end=3194
  _GETUSERRESPONSE._serialized_start=3196
  _GETUSERRESPONSE._serialized_end=3245
  _SIGNINREQUEST._serialized_start=3247
  _SIGNINREQUEST._serialized_end=3298
  _SIGNINRESPONSE._serialized_start=3300
  _SIGNINRESPONSE._serialized_end=3361
  _SIGNOUTREQUEST._serialized_start=3363
  _SIGNOUTREQUEST._serialized_end=3379
  _CREATEUSERREQUEST._serialized_start=3381
  _CREATEUSERREQUEST._serialized_end=3493
  _CREATEUSERRESPONSE._serialized_start=3495
  _CREATEUSERRESPONSE._serialized_end=3560
  _UPDATEUSERREQUEST._serialized_start=3562
  _UPDATEUSERREQUEST._serialized_end=3657
  _UPDATEPASSWORDREQUEST._serialized_start=3659
  _UPDATEPASSWORDREQUEST._serialized_end=3741
  _LISTUSERSREQUEST._serialized_start=3743
  _LISTUSERSREQUEST._serialized_end=3850
  _LISTUSERSRESPONSE._serialized_start=3852
  _LISTUSERSRESPONSE._serialized_end=3929
  _SENDVERIFICATIONCODEREQUEST._serialized_start=3931
  _SENDVERIFICATIONCODEREQUEST._serialized_end=3975
  _VERIFYEMAILREQUEST._serialized_start=3977
  _VERIFYEMAILREQUEST._serialized_end=4039
  _VERIFYEMAILRESPONSE._serialized_start=4041
  _VERIFYEMAILRESPONSE._serialized_end=4106
  _VALIDATENEWUSERREQUEST._serialized_start=4108
  _VALIDATENEWUSERREQUEST._serialized_end=4164
  _LISTACTIVITIESREQUEST._serialized_start=4166
  _LISTACTIVITIESREQUEST._serialized_end=4278
  _LISTACTIVITIESRESPONSE._serialized_start=4280
  _LISTACTIVITIESRESPONSE._serialized_end=4371
  _LISTNOTIFICATIONSREQUEST._serialized_start=4373
  _LISTNOTIFICATIONSREQUEST._serialized_end=4488
  _LISTNOTIFICATIONSRESPONSE._serialized_start=4490
  _LISTNOTIFICATIONSRESPONSE._serialized_end=4591
  _UPDATENOTIFICATIONREQUEST._serialized_start=4593
  _UPDATENOTIFICATIONREQUEST._serialized_end=4712
  _CREATETAGREQUEST._serialized_start=4714
  _CREATETAGREQUEST._serialized_end=4778
  _LISTTAGSREQUEST._serialized_start=4780
  _LISTTAGSREQUEST._serialized_end=4886
  _LISTTAGSRESPONSE._serialized_start=4888
  _LISTTAGSRESPONSE._serialized_end=4962
  _DELETETAGREQUEST._serialized_start=4964
  _DELETETAGREQUEST._serialized_end=4996
  _GETSTATISTICREQUEST._serialized_start=4998
  _GETSTATISTICREQUEST._serialized_end=5033
  _GETADMINMESSAGEREQUEST._serialized_start=5035
  _GETADMINMESSAGEREQUEST._serialized_end=5059
  _CREATESUBSCRIPTIONREQUEST._serialized_start=5061
  _CREATESUBSCRIPTIONREQUEST._serialized_end=5152
  _LISTSUBSCRIPTIONSREQUEST._serialized_start=5154
  _LISTSUBSCRIPTIONSREQUEST._serialized_end=5269
  _LISTSUBSCRIPTIONSRESPONSE._serialized_start=5271
  _LISTSUBSCRIPTIONSRESPONSE._serialized_end=5372
  _UPDATESUBSCRIPTIONREQUEST._serialized_start=5374
  _UPDATESUBSCRIPTIONREQUEST._serialized_end=5493
  _DELETESUBSCRIPTIONREQUEST._serialized_start=5495
  _DELETESUBSCRIPTIONREQUEST._serialized_end=5536
  _EMPTY._serialized_start=5538
  _EMPTY._serialized_end=5545
  _STATUS._serialized_start=5547
  _STATUS._serialized_end=5586
  _PACKAGE._serialized_start=5589
  _PACKAGE._serialized_end=5876
  _BINARY._serialized_start=5879
  _BINARY._serialized_end=6171
  _USER._serialized_start=6174
  _USER._serialized_end=6564
  _USER_USERTYPE._serialized_start=6491
  _USER_USERTYPE._serialized_end=6564
  _VERSION._serialized_start=6566
  _VERSION._serialized_end=6620
  _STATISTIC._serialized_start=6622
  _STATISTIC._serialized_end=6678
  _URL._serialized_start=6680
  _URL._serialized_end=6698
  _THREAD._serialized_start=6701
  _THREAD._serialized_end=7118
  _COMMENT._serialized_start=7121
  _COMMENT._serialized_end=7354
  _REPLY._serialized_start=7357
  _REPLY._serialized_end=7531
  _TAG._serialized_start=7533
  _TAG._serialized_end=7587
  _ADMINMESSAGE._serialized_start=7589
  _ADMINMESSAGE._serialized_end=7620
  _AUTH._serialized_start=7622
  _AUTH._serialized_end=7650
  _ACTIVITY._serialized_start=7653
  _ACTIVITY._serialized_end=7783
  _NOTIFICATION._serialized_start=7786
  _NOTIFICATION._serialized_end=8001
  _RESOURCEVIEW._serialized_start=8003
  _RESOURCEVIEW._serialized_end=8093
  _ARTICLE._serialized_start=8096
  _ARTICLE._serialized_end=8366
  _FILE._serialized_start=8369
  _FILE._serialized_end=8528
  _FILE_SERVER._serialized_start=8475
  _FILE_SERVER._serialized_end=8528
  _SUBSCRIPTION._serialized_start=8531
  _SUBSCRIPTION._serialized_end=8673
  _LEGACYSUBSCRIPTION._serialized_start=8676
  _LEGACYSUBSCRIPTION._serialized_end=8949
  _LEGACYSUBSCRIPTION_SUBSCRIBETYPE._serialized_start=8893
  _LEGACYSUBSCRIPTION_SUBSCRIBETYPE._serialized_end=8949
  _USERSETTINGS._serialized_start=8952
  _USERSETTINGS._serialized_end=9197
  _USERSETTINGS_NOTIFICATIONSETTING._serialized_start=9037
  _USERSETTINGS_NOTIFICATIONSETTING._serialized_end=9197
  _FIELDMASK._serialized_start=9199
  _FIELDMASK._serialized_end=9225
  _ROUTEGUIDE._serialized_start=9622
  _ROUTEGUIDE._serialized_end=13668
# @@protoc_insertion_point(module_scope)
