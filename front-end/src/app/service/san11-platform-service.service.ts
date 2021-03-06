import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf, Subscription } from 'rxjs';

import { SIRE_PACKAGES, PLAYER_PACKAGES, MOD_MAKER_PACKAGES } from './../mock-packages'

import { GrpcEvent, GrpcMetadata, GrpcStatusEvent } from '@ngx-grpc/common';

import { Article, CreateArticleRequest, CreatePackageRequest, CreateThreadRequest, DeleteArticleRequest, DeletePackageRequest, DeleteThreadRequest, GetArticleRequest, GetThreadRequest, GetUserRequest, ListActivitiesRequest, ListActivitiesResponse, ListArticlesRequest, ListArticlesResponse, ListPackagesResponse, ListThreadsRequest, ListThreadsResponse, Thread, UpdateArticleRequest, UploadBinaryRequest, UploadImageRequest } from '../../proto/san11-platform.pb'
import { CreateBinaryRequest, CreateImageRequest } from '../../proto/san11-platform.pb'
import { GetPackageRequest } from "../../proto/san11-platform.pb";
import { UpdatePackageRequest } from '../../proto/san11-platform.pb'
import { SearchPackagesRequest, SearchPackagesResponse } from "../../proto/san11-platform.pb";
import { AdminMessage, Tag, Url, Statistic, User, Package, Binary, Status, Empty, Comment, Reply } from '../../proto/san11-platform.pb'
import { ListPackagesRequest } from '../../proto/san11-platform.pb';
import { ListUsersRequest, ListUsersResponse } from "../../proto/san11-platform.pb";
import { SignInRequest, SignInResponse } from '../../proto/san11-platform.pb';
import { SignUpRequest, SignUpResponse } from '../../proto/san11-platform.pb';
import { SignOutRequest } from '../../proto/san11-platform.pb'
import { DownloadBinaryRequest } from '../../proto/san11-platform.pb'
import { GetStatisticRequest } from '../../proto/san11-platform.pb'
import { DeleteBinaryRequest } from "../../proto/san11-platform.pb";
import { UpdateUserRequest, UpdatePasswordRequest } from "../../proto/san11-platform.pb";
import { UpdateCommentRequest, CreateCommentRequest, DeleteCommentRequest, ListCommentsRequest, ListCommentsResponse } from "../../proto/san11-platform.pb";
import { UpdateReplyRequest, CreateReplyRequest, DeleteReplyRequest } from "../../proto/san11-platform.pb";
import { CreateTagRequest, ListTagsRequest, ListTagsResponse, DeleteTagRequest } from "../../proto/san11-platform.pb";
import { UpdateBinaryRequest } from "../../proto/san11-platform.pb";
import { SendVerificationCodeRequest } from "../../proto/san11-platform.pb";
import { VerifyEmailRequest, VerifyEmailResponse } from "../../proto/san11-platform.pb";
import { VerifyNewUserRequest, VerifyNewUserResponse } from "../../proto/san11-platform.pb";


import { RouteGuideClient } from '../../proto/san11-platform.pbsc';
import { Cacheable } from 'ts-cacheable';

@Injectable({
  providedIn: 'root'
})

export class San11PlatformServiceService {

  events: any[] = [];
  private sub: Subscription;

  constructor(private severClient: RouteGuideClient) {

  }
  // threads
  getThread(request: GetThreadRequest): Observable<Thread> {
    return this.severClient.getThread(request, this.getMetadata());
  }

  listThreads(request: ListThreadsRequest): Observable<ListThreadsResponse> {
    return this.severClient.listThreads(request, this.getMetadata());
  }

  createThread(request: CreateThreadRequest): Observable<Thread> {
    return this.severClient.createThread(request, this.getMetadata())
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

  createPackage(san11Package: Package): Observable<Package> {
    const request = new CreatePackageRequest({ package: san11Package });
    return this.severClient.createPackage(request, this.getMetadata());
  }

  deletePackage(san11Package: Package): Observable<Empty> {
    const request = new DeletePackageRequest({ package: new Package({ packageId: san11Package.packageId }) });
    return this.severClient.deletePackage(request, this.getMetadata());
  }

  updatePackage(request: UpdatePackageRequest): Observable<Package> {
    return this.severClient.updatePackage(request, this.getMetadata());
  }

  getPackage(packageId: string): Observable<Package> {
    const request = new GetPackageRequest({ packageId: packageId });
    return this.severClient.getPackage(request, this.getMetadata());
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

  listComments(parent: string): Observable<ListCommentsResponse> {
    const request = new ListCommentsRequest({ parent: parent });
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

  signIn(user): Observable<SignInResponse> {
    const request = new SignInRequest({ username: user.username, password: user.password });
    return this.severClient.signIn(request);
  }

  signOut(userId): Observable<Status> {
    const request = new SignOutRequest({
      userId: userId
    });
    return this.severClient.signOut(request);
  }

  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    return this.severClient.signUp(request);
  }

  @Cacheable()
  getUser(request: GetUserRequest): Observable<User> {
    // TODO: add a cache layer
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

  verifyNewUser(request: VerifyNewUserRequest): Observable<Status> {
    return this.severClient.verifyNewUser(request, this.getMetadata());
  }

  // activities
  listActivities(request: ListActivitiesRequest): Observable<ListActivitiesResponse> {
    return this.severClient.listActivities(request, this.getMetadata());
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

  // UTILS

  getMetadata() {
    let sid = localStorage.getItem('sid');
    if (sid === null) {
      sid = '';
    }
    return new GrpcMetadata({ sid: sid });
  }
}
