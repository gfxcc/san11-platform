/* tslint:disable */
/* eslint-disable */
//
// THIS IS A GENERATED FILE
// DO NOT MODIFY IT! YOUR CHANGES WILL BE LOST
import { Inject, Injectable, Optional } from '@angular/core';
import {
  GrpcCallType,
  GrpcClient,
  GrpcClientFactory,
  GrpcEvent,
  GrpcMetadata
} from '@ngx-grpc/common';
import {
  GRPC_CLIENT_FACTORY,
  GrpcHandler,
  takeMessages,
  throwStatusErrors
} from '@ngx-grpc/core';
import { Observable } from 'rxjs';
import * as thisProto from './san11-platform.pb';
import * as googleProtobuf000 from '@ngx-grpc/well-known-types';
import { GRPC_ROUTE_GUIDE_CLIENT_SETTINGS } from './san11-platform.pbconf';
/**
 * Service client implementation for routeguide.RouteGuide
 */
@Injectable({ providedIn: 'any' })
export class RouteGuideClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Unary RPC for /routeguide.RouteGuide/CreatePackage
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Package>>
     */
    createPackage: (
      requestData: thisProto.CreatePackageRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Package>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/CreatePackage',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreatePackageRequest,
        responseClass: thisProto.Package
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/GetPackage
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Package>>
     */
    getPackage: (
      requestData: thisProto.GetPackageRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Package>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/GetPackage',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetPackageRequest,
        responseClass: thisProto.Package
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/ListPackages
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ListPackagesResponse>>
     */
    listPackages: (
      requestData: thisProto.ListPackagesRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ListPackagesResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/ListPackages',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListPackagesRequest,
        responseClass: thisProto.ListPackagesResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/UpdatePackage
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Package>>
     */
    updatePackage: (
      requestData: thisProto.UpdatePackageRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Package>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/UpdatePackage',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdatePackageRequest,
        responseClass: thisProto.Package
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/DeletePackage
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Empty>>
     */
    deletePackage: (
      requestData: thisProto.DeletePackageRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/DeletePackage',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeletePackageRequest,
        responseClass: thisProto.Empty
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/SearchPackages
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.SearchPackagesResponse>>
     */
    searchPackages: (
      requestData: thisProto.SearchPackagesRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.SearchPackagesResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/SearchPackages',
        requestData,
        requestMetadata,
        requestClass: thisProto.SearchPackagesRequest,
        responseClass: thisProto.SearchPackagesResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/CreateBinary
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Binary>>
     */
    createBinary: (
      requestData: thisProto.CreateBinaryRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Binary>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/CreateBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateBinaryRequest,
        responseClass: thisProto.Binary
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/GetBinary
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Binary>>
     */
    getBinary: (
      requestData: thisProto.GetBinaryRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Binary>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/GetBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetBinaryRequest,
        responseClass: thisProto.Binary
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/BatchGetBinary
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.BatchGetBinaryResponse>>
     */
    batchGetBinary: (
      requestData: thisProto.BatchGetBinaryRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.BatchGetBinaryResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/BatchGetBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.BatchGetBinaryRequest,
        responseClass: thisProto.BatchGetBinaryResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/ListBinaries
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ListBinariesResponse>>
     */
    listBinaries: (
      requestData: thisProto.ListBinariesRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ListBinariesResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/ListBinaries',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListBinariesRequest,
        responseClass: thisProto.ListBinariesResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/UpdateBinary
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Binary>>
     */
    updateBinary: (
      requestData: thisProto.UpdateBinaryRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Binary>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/UpdateBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateBinaryRequest,
        responseClass: thisProto.Binary
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/DeleteBinary
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Empty>>
     */
    deleteBinary: (
      requestData: thisProto.DeleteBinaryRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/DeleteBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteBinaryRequest,
        responseClass: thisProto.Empty
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/DownloadBinary
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Binary>>
     */
    downloadBinary: (
      requestData: thisProto.DownloadBinaryRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Binary>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/DownloadBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.DownloadBinaryRequest,
        responseClass: thisProto.Binary
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/CreateImage
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Url>>
     */
    createImage: (
      requestData: thisProto.CreateImageRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Url>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/CreateImage',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateImageRequest,
        responseClass: thisProto.Url
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/CreateComment
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Comment>>
     */
    createComment: (
      requestData: thisProto.CreateCommentRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Comment>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/CreateComment',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateCommentRequest,
        responseClass: thisProto.Comment
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/ListComments
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ListCommentsResponse>>
     */
    listComments: (
      requestData: thisProto.ListCommentsRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ListCommentsResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/ListComments',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListCommentsRequest,
        responseClass: thisProto.ListCommentsResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/UpdateComment
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Comment>>
     */
    updateComment: (
      requestData: thisProto.UpdateCommentRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Comment>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/UpdateComment',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateCommentRequest,
        responseClass: thisProto.Comment
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/DeleteComment
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Empty>>
     */
    deleteComment: (
      requestData: thisProto.DeleteCommentRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/DeleteComment',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteCommentRequest,
        responseClass: thisProto.Empty
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/CreateReply
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Reply>>
     */
    createReply: (
      requestData: thisProto.CreateReplyRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Reply>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/CreateReply',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateReplyRequest,
        responseClass: thisProto.Reply
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/UpdateReply
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Reply>>
     */
    updateReply: (
      requestData: thisProto.UpdateReplyRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Reply>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/UpdateReply',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateReplyRequest,
        responseClass: thisProto.Reply
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/DeleteReply
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Empty>>
     */
    deleteReply: (
      requestData: thisProto.DeleteReplyRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/DeleteReply',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteReplyRequest,
        responseClass: thisProto.Empty
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/CreateArticle
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Article>>
     */
    createArticle: (
      requestData: thisProto.CreateArticleRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Article>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/CreateArticle',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateArticleRequest,
        responseClass: thisProto.Article
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/GetArticle
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Article>>
     */
    getArticle: (
      requestData: thisProto.GetArticleRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Article>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/GetArticle',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetArticleRequest,
        responseClass: thisProto.Article
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/ListArticles
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ListArticlesResponse>>
     */
    listArticles: (
      requestData: thisProto.ListArticlesRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ListArticlesResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/ListArticles',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListArticlesRequest,
        responseClass: thisProto.ListArticlesResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/UpdateArticle
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Article>>
     */
    updateArticle: (
      requestData: thisProto.UpdateArticleRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Article>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/UpdateArticle',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateArticleRequest,
        responseClass: thisProto.Article
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/DeleteArticle
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Article>>
     */
    deleteArticle: (
      requestData: thisProto.DeleteArticleRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Article>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/DeleteArticle',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteArticleRequest,
        responseClass: thisProto.Article
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/SignUp
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.SignUpResponse>>
     */
    signUp: (
      requestData: thisProto.SignUpRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.SignUpResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/SignUp',
        requestData,
        requestMetadata,
        requestClass: thisProto.SignUpRequest,
        responseClass: thisProto.SignUpResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/SignIn
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.SignInResponse>>
     */
    signIn: (
      requestData: thisProto.SignInRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.SignInResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/SignIn',
        requestData,
        requestMetadata,
        requestClass: thisProto.SignInRequest,
        responseClass: thisProto.SignInResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/SignOut
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Status>>
     */
    signOut: (
      requestData: thisProto.SignOutRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Status>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/SignOut',
        requestData,
        requestMetadata,
        requestClass: thisProto.SignOutRequest,
        responseClass: thisProto.Status
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/GetUser
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.User>>
     */
    getUser: (
      requestData: thisProto.GetUserRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.User>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/GetUser',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetUserRequest,
        responseClass: thisProto.User
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/ListUsers
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ListUsersResponse>>
     */
    listUsers: (
      requestData: thisProto.ListUsersRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ListUsersResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/ListUsers',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListUsersRequest,
        responseClass: thisProto.ListUsersResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/SendVerificationCode
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Empty>>
     */
    sendVerificationCode: (
      requestData: thisProto.SendVerificationCodeRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/SendVerificationCode',
        requestData,
        requestMetadata,
        requestClass: thisProto.SendVerificationCodeRequest,
        responseClass: thisProto.Empty
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/VerifyEmail
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.VerifyEmailResponse>>
     */
    verifyEmail: (
      requestData: thisProto.VerifyEmailRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.VerifyEmailResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/VerifyEmail',
        requestData,
        requestMetadata,
        requestClass: thisProto.VerifyEmailRequest,
        responseClass: thisProto.VerifyEmailResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/VerifyNewUser
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Status>>
     */
    verifyNewUser: (
      requestData: thisProto.VerifyNewUserRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Status>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/VerifyNewUser',
        requestData,
        requestMetadata,
        requestClass: thisProto.VerifyNewUserRequest,
        responseClass: thisProto.Status
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/UpdateUser
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.User>>
     */
    updateUser: (
      requestData: thisProto.UpdateUserRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.User>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/UpdateUser',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateUserRequest,
        responseClass: thisProto.User
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/UpdatePassword
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Empty>>
     */
    updatePassword: (
      requestData: thisProto.UpdatePasswordRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/UpdatePassword',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdatePasswordRequest,
        responseClass: thisProto.Empty
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/ListActivities
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ListActivitiesResponse>>
     */
    listActivities: (
      requestData: thisProto.ListActivitiesRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ListActivitiesResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/ListActivities',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListActivitiesRequest,
        responseClass: thisProto.ListActivitiesResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/CreateTag
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Tag>>
     */
    createTag: (
      requestData: thisProto.CreateTagRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Tag>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/CreateTag',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateTagRequest,
        responseClass: thisProto.Tag
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/ListTags
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ListTagsResponse>>
     */
    listTags: (
      requestData: thisProto.ListTagsRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ListTagsResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/ListTags',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListTagsRequest,
        responseClass: thisProto.ListTagsResponse
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/DeleteTag
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Empty>>
     */
    deleteTag: (
      requestData: thisProto.DeleteTagRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/DeleteTag',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteTagRequest,
        responseClass: thisProto.Empty
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/GetStatistic
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Statistic>>
     */
    getStatistic: (
      requestData: thisProto.GetStatisticRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Statistic>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/GetStatistic',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetStatisticRequest,
        responseClass: thisProto.Statistic
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/GetAdminMessage
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.AdminMessage>>
     */
    getAdminMessage: (
      requestData: thisProto.GetAdminMessageRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.AdminMessage>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/GetAdminMessage',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetAdminMessageRequest,
        responseClass: thisProto.AdminMessage
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_ROUTE_GUIDE_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient('routeguide.RouteGuide', settings);
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/CreatePackage
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Package>
   */
  createPackage(
    requestData: thisProto.CreatePackageRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Package> {
    return this.$raw
      .createPackage(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/GetPackage
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Package>
   */
  getPackage(
    requestData: thisProto.GetPackageRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Package> {
    return this.$raw
      .getPackage(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/ListPackages
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ListPackagesResponse>
   */
  listPackages(
    requestData: thisProto.ListPackagesRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ListPackagesResponse> {
    return this.$raw
      .listPackages(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/UpdatePackage
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Package>
   */
  updatePackage(
    requestData: thisProto.UpdatePackageRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Package> {
    return this.$raw
      .updatePackage(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/DeletePackage
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Empty>
   */
  deletePackage(
    requestData: thisProto.DeletePackageRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Empty> {
    return this.$raw
      .deletePackage(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/SearchPackages
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.SearchPackagesResponse>
   */
  searchPackages(
    requestData: thisProto.SearchPackagesRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.SearchPackagesResponse> {
    return this.$raw
      .searchPackages(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/CreateBinary
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Binary>
   */
  createBinary(
    requestData: thisProto.CreateBinaryRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Binary> {
    return this.$raw
      .createBinary(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/GetBinary
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Binary>
   */
  getBinary(
    requestData: thisProto.GetBinaryRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Binary> {
    return this.$raw
      .getBinary(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/BatchGetBinary
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.BatchGetBinaryResponse>
   */
  batchGetBinary(
    requestData: thisProto.BatchGetBinaryRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.BatchGetBinaryResponse> {
    return this.$raw
      .batchGetBinary(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/ListBinaries
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ListBinariesResponse>
   */
  listBinaries(
    requestData: thisProto.ListBinariesRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ListBinariesResponse> {
    return this.$raw
      .listBinaries(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/UpdateBinary
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Binary>
   */
  updateBinary(
    requestData: thisProto.UpdateBinaryRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Binary> {
    return this.$raw
      .updateBinary(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/DeleteBinary
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Empty>
   */
  deleteBinary(
    requestData: thisProto.DeleteBinaryRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Empty> {
    return this.$raw
      .deleteBinary(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/DownloadBinary
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Binary>
   */
  downloadBinary(
    requestData: thisProto.DownloadBinaryRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Binary> {
    return this.$raw
      .downloadBinary(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/CreateImage
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Url>
   */
  createImage(
    requestData: thisProto.CreateImageRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Url> {
    return this.$raw
      .createImage(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/CreateComment
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Comment>
   */
  createComment(
    requestData: thisProto.CreateCommentRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Comment> {
    return this.$raw
      .createComment(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/ListComments
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ListCommentsResponse>
   */
  listComments(
    requestData: thisProto.ListCommentsRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ListCommentsResponse> {
    return this.$raw
      .listComments(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/UpdateComment
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Comment>
   */
  updateComment(
    requestData: thisProto.UpdateCommentRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Comment> {
    return this.$raw
      .updateComment(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/DeleteComment
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Empty>
   */
  deleteComment(
    requestData: thisProto.DeleteCommentRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Empty> {
    return this.$raw
      .deleteComment(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/CreateReply
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Reply>
   */
  createReply(
    requestData: thisProto.CreateReplyRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Reply> {
    return this.$raw
      .createReply(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/UpdateReply
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Reply>
   */
  updateReply(
    requestData: thisProto.UpdateReplyRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Reply> {
    return this.$raw
      .updateReply(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/DeleteReply
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Empty>
   */
  deleteReply(
    requestData: thisProto.DeleteReplyRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Empty> {
    return this.$raw
      .deleteReply(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/CreateArticle
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Article>
   */
  createArticle(
    requestData: thisProto.CreateArticleRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Article> {
    return this.$raw
      .createArticle(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/GetArticle
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Article>
   */
  getArticle(
    requestData: thisProto.GetArticleRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Article> {
    return this.$raw
      .getArticle(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/ListArticles
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ListArticlesResponse>
   */
  listArticles(
    requestData: thisProto.ListArticlesRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ListArticlesResponse> {
    return this.$raw
      .listArticles(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/UpdateArticle
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Article>
   */
  updateArticle(
    requestData: thisProto.UpdateArticleRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Article> {
    return this.$raw
      .updateArticle(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/DeleteArticle
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Article>
   */
  deleteArticle(
    requestData: thisProto.DeleteArticleRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Article> {
    return this.$raw
      .deleteArticle(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/SignUp
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.SignUpResponse>
   */
  signUp(
    requestData: thisProto.SignUpRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.SignUpResponse> {
    return this.$raw
      .signUp(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/SignIn
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.SignInResponse>
   */
  signIn(
    requestData: thisProto.SignInRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.SignInResponse> {
    return this.$raw
      .signIn(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/SignOut
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Status>
   */
  signOut(
    requestData: thisProto.SignOutRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Status> {
    return this.$raw
      .signOut(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/GetUser
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.User>
   */
  getUser(
    requestData: thisProto.GetUserRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.User> {
    return this.$raw
      .getUser(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/ListUsers
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ListUsersResponse>
   */
  listUsers(
    requestData: thisProto.ListUsersRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ListUsersResponse> {
    return this.$raw
      .listUsers(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/SendVerificationCode
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Empty>
   */
  sendVerificationCode(
    requestData: thisProto.SendVerificationCodeRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Empty> {
    return this.$raw
      .sendVerificationCode(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/VerifyEmail
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.VerifyEmailResponse>
   */
  verifyEmail(
    requestData: thisProto.VerifyEmailRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.VerifyEmailResponse> {
    return this.$raw
      .verifyEmail(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/VerifyNewUser
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Status>
   */
  verifyNewUser(
    requestData: thisProto.VerifyNewUserRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Status> {
    return this.$raw
      .verifyNewUser(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/UpdateUser
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.User>
   */
  updateUser(
    requestData: thisProto.UpdateUserRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.User> {
    return this.$raw
      .updateUser(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/UpdatePassword
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Empty>
   */
  updatePassword(
    requestData: thisProto.UpdatePasswordRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Empty> {
    return this.$raw
      .updatePassword(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/ListActivities
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ListActivitiesResponse>
   */
  listActivities(
    requestData: thisProto.ListActivitiesRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ListActivitiesResponse> {
    return this.$raw
      .listActivities(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/CreateTag
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Tag>
   */
  createTag(
    requestData: thisProto.CreateTagRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Tag> {
    return this.$raw
      .createTag(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/ListTags
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ListTagsResponse>
   */
  listTags(
    requestData: thisProto.ListTagsRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ListTagsResponse> {
    return this.$raw
      .listTags(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/DeleteTag
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Empty>
   */
  deleteTag(
    requestData: thisProto.DeleteTagRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Empty> {
    return this.$raw
      .deleteTag(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/GetStatistic
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Statistic>
   */
  getStatistic(
    requestData: thisProto.GetStatisticRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Statistic> {
    return this.$raw
      .getStatistic(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/GetAdminMessage
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.AdminMessage>
   */
  getAdminMessage(
    requestData: thisProto.GetAdminMessageRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.AdminMessage> {
    return this.$raw
      .getAdminMessage(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
