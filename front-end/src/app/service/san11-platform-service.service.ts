import { Injectable } from '@angular/core';
import { GrpcMetadata } from '@ngx-grpc/common';
import { Observable, Subscription } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import * as pb from '../../proto/san11-platform.pb';
import { AdminMessage, Article, Binary, Comment, CreateArticleRequest, CreateBinaryRequest, CreateCommentRequest, CreateImageRequest, CreatePackageRequest, CreateReplyRequest, CreateSubscriptionRequest, CreateTagRequest, CreateThreadRequest, CreateUserRequest, CreateUserResponse, DeleteArticleRequest, DeleteBinaryRequest, DeleteCommentRequest, DeletePackageRequest, DeleteReplyRequest, DeleteTagRequest, DeleteThreadRequest, DownloadBinaryRequest, Empty, GetArticleRequest, GetPackageRequest, GetStatisticRequest, GetThreadRequest, GetUserRequest, ListActivitiesRequest, ListActivitiesResponse, ListArticlesRequest, ListArticlesResponse, ListCommentsRequest, ListCommentsResponse, ListNotificationsRequest, ListNotificationsResponse, ListPackagesRequest, ListPackagesResponse, ListTagsRequest, ListTagsResponse, ListThreadsRequest, ListThreadsResponse, ListUsersRequest, ListUsersResponse, Notification, Package, Reply, SearchPackagesRequest, SearchPackagesResponse, SendVerificationCodeRequest, SignInRequest, SignInResponse, SignOutRequest, Statistic, Status, Tag, Thread, UpdateArticleRequest, UpdateBinaryRequest, UpdateCommentRequest, UpdateNotificationRequest, UpdatePackageRequest, UpdatePasswordRequest, UpdateReplyRequest, UpdateThreadRequest, UpdateUserRequest, Url, User, ValidateNewUserRequest, VerifyEmailRequest, VerifyEmailResponse } from '../../proto/san11-platform.pb';
import { RouteGuideClient } from '../../proto/san11-platform.pbsc';






@Injectable({
  providedIn: 'root'
})

export class San11PlatformServiceService {

  events: any[] = [];
  private sub: Subscription;

  constructor(private severClient: RouteGuideClient) {

  }
  // threads
  createThread(request: CreateThreadRequest): Observable<Thread> {
    return this.severClient.createThread(request, this.getMetadata())
  }

  getThread(request: GetThreadRequest): Observable<Thread> {
    return this.severClient.getThread(request, this.getMetadata());
  }

  listThreads(request: ListThreadsRequest): Observable<ListThreadsResponse> {
    return this.severClient.listThreads(request, this.getMetadata());
  }

  updateThread(request: UpdateThreadRequest): Observable<Thread> {
    return this.severClient.updateThread(request, this.getMetadata());
  }

  deleteThread(request: DeleteThreadRequest): Observable<Thread> {
    return this.severClient.deleteThread(request, this.getMetadata())
  }

  // articles

  createArticle(request: CreateArticleRequest): Observable<Article> {
    return this.severClient.createArticle(request, this.getMetadata());
  }

  getArticle(request: GetArticleRequest): Observable<Article> {
    return this.severClient.getArticle(request, this.getMetadata());
  }

  listArticles(request: ListArticlesRequest): Observable<ListArticlesResponse> {
    return this.severClient.listArticles(request, this.getMetadata());
  }

  updateArticle(request: UpdateArticleRequest): Observable<Article> {
    return this.severClient.updateArticle(request, this.getMetadata());
  }

  deleteArticle(request: DeleteArticleRequest): Observable<Article> {
    return this.severClient.deleteArticle(request, this.getMetadata());
  }
  // packages

  createPackage(request: CreatePackageRequest): Observable<Package> {
    return this.severClient.createPackage(request, this.getMetadata());
  }

  getPackage(request: GetPackageRequest): Observable<Package> {
    return this.severClient.getPackage(request, this.getMetadata());
  }

  deletePackage(request: DeletePackageRequest): Observable<Empty> {
    return this.severClient.deletePackage(request, this.getMetadata());
  }

  updatePackage(request: UpdatePackageRequest): Observable<Package> {
    return this.severClient.updatePackage(request, this.getMetadata());
  }

  listPackages(request: ListPackagesRequest): Observable<ListPackagesResponse> {
    return this.severClient.listPackages(request, this.getMetadata());
  }

  searchPackages(query: string, pageSize: number, pageToken: string): Observable<SearchPackagesResponse> {
    const request = new SearchPackagesRequest({ query: query, pageSize: pageSize.toString(), pageToken: pageToken });
    return this.severClient.searchPackages(request, this.getMetadata());
  }

  createBinary(request: CreateBinaryRequest): Observable<Binary> {
    return this.severClient.createBinary(request, this.getMetadata());
  }

  downloadBinary(request: DownloadBinaryRequest): Observable<Binary> {
    return this.severClient.downloadBinary(request, this.getMetadata());
  }

  updateBinary(request: UpdateBinaryRequest): Observable<Binary> {
    return this.severClient.updateBinary(request, this.getMetadata());
  }

  deleteBinary(request: DeleteBinaryRequest): Observable<Binary> {
    return this.severClient.deleteBinary(request, this.getMetadata());
  }

  // images

  createImage(request: CreateImageRequest): Observable<Url> {
    return this.severClient.createImage(request, this.getMetadata());
  }

  // comments
  createComment(request: CreateCommentRequest): Observable<Comment> {
    return this.severClient.createComment(request, this.getMetadata());
  }

  deleteComment(request: DeleteCommentRequest): Observable<Comment> {
    return this.severClient.deleteComment(request, this.getMetadata());
  }

  updateComment(request: UpdateCommentRequest): Observable<Comment> {
    return this.severClient.updateComment(request, this.getMetadata());
  }

  listComments(request: ListCommentsRequest): Observable<ListCommentsResponse> {
    return this.severClient.listComments(request, this.getMetadata());
  }

  createReply(request: CreateReplyRequest): Observable<Reply> {
    return this.severClient.createReply(request, this.getMetadata());
  }

  deleteReply(request: DeleteReplyRequest): Observable<Reply> {
    return this.severClient.deleteReply(request, this.getMetadata());
  }

  updateReply(request: UpdateReplyRequest): Observable<Reply> {
    return this.severClient.updateReply(request, this.getMetadata());
  }
  // users

  signIn(request: SignInRequest): Observable<SignInResponse> {
    return this.severClient.signIn(request, this.getMetadata());
  }

  signOut(request: SignOutRequest): Observable<Status> {
    return this.severClient.signOut(request, this.getMetadata());
  }

  createUser(request: CreateUserRequest): Observable<CreateUserResponse> {
    return this.severClient.createUser(request, this.getMetadata());
  }

  @Cacheable({ maxCacheCount: 200 })
  getUser(request: GetUserRequest): Observable<User> {
    return this.severClient.getUser(request, this.getMetadata());
  }

  updateUser(request: UpdateUserRequest): Observable<User> {
    return this.severClient.updateUser(request, this.getMetadata());
  }

  updatePassword(request: UpdatePasswordRequest): Observable<Empty> {
    return this.severClient.updatePassword(request, this.getMetadata());
  }

  getStatistic(): Observable<Statistic> {
    const request = new GetStatisticRequest({ date: null });
    return this.severClient.getStatistic(request, this.getMetadata());
  }

  getAdminMessage(): Observable<AdminMessage> {
    const request = new GetStatisticRequest({ date: null });
    return this.severClient.getAdminMessage(request, this.getMetadata());
  }

  listUsers(): Observable<ListUsersResponse> {
    const request = new ListUsersRequest({});
    return this.severClient.listUsers(request, this.getMetadata());
  }

  sendVerificationCode(request: SendVerificationCodeRequest): Observable<Empty> {
    return this.severClient.sendVerificationCode(request, this.getMetadata());
  }

  verifyEmail(request: VerifyEmailRequest): Observable<VerifyEmailResponse> {
    return this.severClient.verifyEmail(request, this.getMetadata());
  }

  validateNewUser(request: ValidateNewUserRequest): Observable<Status> {
    return this.severClient.validateNewUser(request, this.getMetadata());
  }

  // activities
  listActivities(request: ListActivitiesRequest): Observable<ListActivitiesResponse> {
    return this.severClient.listActivities(request, this.getMetadata());
  }

  // notifications
  listNotifications(request: ListNotificationsRequest): Observable<ListNotificationsResponse> {
    return this.severClient.listNotifications(request, this.getMetadata());
  }

  updateNotification(request: UpdateNotificationRequest): Observable<Notification> {
    return this.severClient.updateNotification(request, this.getMetadata());
  }

  // tags
  createTag(request: CreateTagRequest): Observable<Tag> {
    return this.severClient.createTag(request, this.getMetadata());
  }

  deleteTag(request: DeleteTagRequest): Observable<Empty> {
    return this.severClient.deleteTag(request, this.getMetadata());
  }

  listTags(request: ListTagsRequest): Observable<ListTagsResponse> {
    return this.severClient.listTags(request, this.getMetadata());
  }

  // subscriptions
  createSubscription(request: CreateSubscriptionRequest): Observable<pb.Subscription> {
    return this.severClient.createSubscriptioin(request, this.getMetadata());
  }

  listSubscription(request: pb.ListSubscriptionsRequest): Observable<pb.ListSubscriptionsResponse> {
    return this.severClient.listSubscriptioins(request, this.getMetadata());
  }

  updateSubscription(request: pb.UpdateSubscriptionRequest): Observable<pb.Subscription> {
    return this.severClient.updateSubscriptioin(request, this.getMetadata());
  }

  deleteSubscription(request: pb.DeleteSubscriptionRequest): Observable<pb.Subscription> {
    return this.severClient.deleteSubscriptioin(request, this.getMetadata());
  }

  unSubscribe(request: pb.UnSubscribeRequest): Observable<pb.Status> {
    return this.severClient.unSubscribe(request, this.getMetadata());
  }

  // UTILS

  getMetadata() {
    let sid = localStorage.getItem('sid');
    if (sid === null) {
      sid = '';
    }
    return new GrpcMetadata({ sid: sid });
  }
}
