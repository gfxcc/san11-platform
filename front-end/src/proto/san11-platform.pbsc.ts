/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
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
import * as googleApi000 from './google/api/http.pb';
import * as googleProtobuf001 from '@ngx-grpc/well-known-types';
import * as googleProtobuf002 from '@ngx-grpc/well-known-types';
import * as googleApi003 from './google/api/annotations.pb';
import { GRPC_SAN11_PLATFORM_CLIENT_SETTINGS } from './san11-platform.pbconf';
/**
 * Service client implementation for san11_platform.San11Platform
 */
@Injectable({ providedIn: 'any' })
export class San11PlatformClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Unary call: /san11_platform.San11Platform/CreatePackage
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
        path: '/san11_platform.San11Platform/CreatePackage',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreatePackageRequest,
        responseClass: thisProto.Package
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/GetPackage
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
        path: '/san11_platform.San11Platform/GetPackage',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetPackageRequest,
        responseClass: thisProto.Package
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ListPackages
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
        path: '/san11_platform.San11Platform/ListPackages',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListPackagesRequest,
        responseClass: thisProto.ListPackagesResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/UpdatePackage
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
        path: '/san11_platform.San11Platform/UpdatePackage',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdatePackageRequest,
        responseClass: thisProto.Package
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/DeletePackage
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Package>>
     */
    deletePackage: (
      requestData: thisProto.DeletePackageRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Package>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/DeletePackage',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeletePackageRequest,
        responseClass: thisProto.Package
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/SearchPackages
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
        path: '/san11_platform.San11Platform/SearchPackages',
        requestData,
        requestMetadata,
        requestClass: thisProto.SearchPackagesRequest,
        responseClass: thisProto.SearchPackagesResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/CreateBinary
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
        path: '/san11_platform.San11Platform/CreateBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateBinaryRequest,
        responseClass: thisProto.Binary
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/GetBinary
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
        path: '/san11_platform.San11Platform/GetBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetBinaryRequest,
        responseClass: thisProto.Binary
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/BatchGetBinary
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
        path: '/san11_platform.San11Platform/BatchGetBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.BatchGetBinaryRequest,
        responseClass: thisProto.BatchGetBinaryResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ListBinaries
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
        path: '/san11_platform.San11Platform/ListBinaries',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListBinariesRequest,
        responseClass: thisProto.ListBinariesResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/UpdateBinary
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
        path: '/san11_platform.San11Platform/UpdateBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateBinaryRequest,
        responseClass: thisProto.Binary
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/DeleteBinary
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Binary>>
     */
    deleteBinary: (
      requestData: thisProto.DeleteBinaryRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Binary>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/DeleteBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteBinaryRequest,
        responseClass: thisProto.Binary
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/DownloadBinary
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
        path: '/san11_platform.San11Platform/DownloadBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.DownloadBinaryRequest,
        responseClass: thisProto.Binary
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/CreateImage
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
        path: '/san11_platform.San11Platform/CreateImage',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateImageRequest,
        responseClass: thisProto.Url
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/CreateThread
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Thread>>
     */
    createThread: (
      requestData: thisProto.CreateThreadRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Thread>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/CreateThread',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateThreadRequest,
        responseClass: thisProto.Thread
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/GetThread
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Thread>>
     */
    getThread: (
      requestData: thisProto.GetThreadRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Thread>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/GetThread',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetThreadRequest,
        responseClass: thisProto.Thread
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ListThreads
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ListThreadsResponse>>
     */
    listThreads: (
      requestData: thisProto.ListThreadsRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ListThreadsResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/ListThreads',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListThreadsRequest,
        responseClass: thisProto.ListThreadsResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/UpdateThread
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Thread>>
     */
    updateThread: (
      requestData: thisProto.UpdateThreadRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Thread>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/UpdateThread',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateThreadRequest,
        responseClass: thisProto.Thread
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/DeleteThread
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Thread>>
     */
    deleteThread: (
      requestData: thisProto.DeleteThreadRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Thread>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/DeleteThread',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteThreadRequest,
        responseClass: thisProto.Thread
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/CreateComment
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
        path: '/san11_platform.San11Platform/CreateComment',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateCommentRequest,
        responseClass: thisProto.Comment
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ListComments
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
        path: '/san11_platform.San11Platform/ListComments',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListCommentsRequest,
        responseClass: thisProto.ListCommentsResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/UpdateComment
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
        path: '/san11_platform.San11Platform/UpdateComment',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateCommentRequest,
        responseClass: thisProto.Comment
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/DeleteComment
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Comment>>
     */
    deleteComment: (
      requestData: thisProto.DeleteCommentRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Comment>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/DeleteComment',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteCommentRequest,
        responseClass: thisProto.Comment
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/CreateReply
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
        path: '/san11_platform.San11Platform/CreateReply',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateReplyRequest,
        responseClass: thisProto.Reply
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/UpdateReply
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
        path: '/san11_platform.San11Platform/UpdateReply',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateReplyRequest,
        responseClass: thisProto.Reply
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/DeleteReply
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Reply>>
     */
    deleteReply: (
      requestData: thisProto.DeleteReplyRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Reply>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/DeleteReply',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteReplyRequest,
        responseClass: thisProto.Reply
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/CreateArticle
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
        path: '/san11_platform.San11Platform/CreateArticle',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateArticleRequest,
        responseClass: thisProto.Article
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/GetArticle
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
        path: '/san11_platform.San11Platform/GetArticle',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetArticleRequest,
        responseClass: thisProto.Article
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ListArticles
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
        path: '/san11_platform.San11Platform/ListArticles',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListArticlesRequest,
        responseClass: thisProto.ListArticlesResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/UpdateArticle
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
        path: '/san11_platform.San11Platform/UpdateArticle',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateArticleRequest,
        responseClass: thisProto.Article
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/DeleteArticle
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
        path: '/san11_platform.San11Platform/DeleteArticle',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteArticleRequest,
        responseClass: thisProto.Article
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/SignIn
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
        path: '/san11_platform.San11Platform/SignIn',
        requestData,
        requestMetadata,
        requestClass: thisProto.SignInRequest,
        responseClass: thisProto.SignInResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/SignOut
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
        path: '/san11_platform.San11Platform/SignOut',
        requestData,
        requestMetadata,
        requestClass: thisProto.SignOutRequest,
        responseClass: thisProto.Status
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/CreateUser
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.CreateUserResponse>>
     */
    createUser: (
      requestData: thisProto.CreateUserRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.CreateUserResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/CreateUser',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateUserRequest,
        responseClass: thisProto.CreateUserResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/GetUser
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
        path: '/san11_platform.San11Platform/GetUser',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetUserRequest,
        responseClass: thisProto.User
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ListUsers
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
        path: '/san11_platform.San11Platform/ListUsers',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListUsersRequest,
        responseClass: thisProto.ListUsersResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/UpdateUser
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
        path: '/san11_platform.San11Platform/UpdateUser',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateUserRequest,
        responseClass: thisProto.User
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/SendVerificationCode
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
        path: '/san11_platform.San11Platform/SendVerificationCode',
        requestData,
        requestMetadata,
        requestClass: thisProto.SendVerificationCodeRequest,
        responseClass: thisProto.Empty
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/VerifyEmail
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
        path: '/san11_platform.San11Platform/VerifyEmail',
        requestData,
        requestMetadata,
        requestClass: thisProto.VerifyEmailRequest,
        responseClass: thisProto.VerifyEmailResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ValidateNewUser
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Status>>
     */
    validateNewUser: (
      requestData: thisProto.ValidateNewUserRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Status>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/ValidateNewUser',
        requestData,
        requestMetadata,
        requestClass: thisProto.ValidateNewUserRequest,
        responseClass: thisProto.Status
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/UpdatePassword
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.User>>
     */
    updatePassword: (
      requestData: thisProto.UpdatePasswordRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.User>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/UpdatePassword',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdatePasswordRequest,
        responseClass: thisProto.User
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ListActivities
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
        path: '/san11_platform.San11Platform/ListActivities',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListActivitiesRequest,
        responseClass: thisProto.ListActivitiesResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ToggleAction
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ToggleActionResponse>>
     */
    toggleAction: (
      requestData: thisProto.ToggleActionRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ToggleActionResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/ToggleAction',
        requestData,
        requestMetadata,
        requestClass: thisProto.ToggleActionRequest,
        responseClass: thisProto.ToggleActionResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ListNotifications
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ListNotificationsResponse>>
     */
    listNotifications: (
      requestData: thisProto.ListNotificationsRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ListNotificationsResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/ListNotifications',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListNotificationsRequest,
        responseClass: thisProto.ListNotificationsResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/UpdateNotification
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Notification>>
     */
    updateNotification: (
      requestData: thisProto.UpdateNotificationRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Notification>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/UpdateNotification',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateNotificationRequest,
        responseClass: thisProto.Notification
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/CreateTag
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
        path: '/san11_platform.San11Platform/CreateTag',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateTagRequest,
        responseClass: thisProto.Tag
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ListTags
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
        path: '/san11_platform.San11Platform/ListTags',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListTagsRequest,
        responseClass: thisProto.ListTagsResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/DeleteTag
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Tag>>
     */
    deleteTag: (
      requestData: thisProto.DeleteTagRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Tag>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/DeleteTag',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteTagRequest,
        responseClass: thisProto.Tag
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/GetStatistic
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
        path: '/san11_platform.San11Platform/GetStatistic',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetStatisticRequest,
        responseClass: thisProto.Statistic
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/GetAdminMessage
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
        path: '/san11_platform.San11Platform/GetAdminMessage',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetAdminMessageRequest,
        responseClass: thisProto.AdminMessage
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/CreateSubscription
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Subscription>>
     */
    createSubscription: (
      requestData: thisProto.CreateSubscriptionRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Subscription>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/CreateSubscription',
        requestData,
        requestMetadata,
        requestClass: thisProto.CreateSubscriptionRequest,
        responseClass: thisProto.Subscription
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/ListSubscriptioins
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ListSubscriptionsResponse>>
     */
    listSubscriptioins: (
      requestData: thisProto.ListSubscriptionsRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ListSubscriptionsResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/ListSubscriptioins',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListSubscriptionsRequest,
        responseClass: thisProto.ListSubscriptionsResponse
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/UpdateSubscription
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Subscription>>
     */
    updateSubscription: (
      requestData: thisProto.UpdateSubscriptionRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Subscription>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/UpdateSubscription',
        requestData,
        requestMetadata,
        requestClass: thisProto.UpdateSubscriptionRequest,
        responseClass: thisProto.Subscription
      });
    },
    /**
     * Unary call: /san11_platform.San11Platform/DeleteSubscription
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Subscription>>
     */
    deleteSubscription: (
      requestData: thisProto.DeleteSubscriptionRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Subscription>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/san11_platform.San11Platform/DeleteSubscription',
        requestData,
        requestMetadata,
        requestClass: thisProto.DeleteSubscriptionRequest,
        responseClass: thisProto.Subscription
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_SAN11_PLATFORM_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient(
      'san11_platform.San11Platform',
      settings
    );
  }

  /**
   * Unary call @/san11_platform.San11Platform/CreatePackage
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
   * Unary call @/san11_platform.San11Platform/GetPackage
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
   * Unary call @/san11_platform.San11Platform/ListPackages
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
   * Unary call @/san11_platform.San11Platform/UpdatePackage
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
   * Unary call @/san11_platform.San11Platform/DeletePackage
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Package>
   */
  deletePackage(
    requestData: thisProto.DeletePackageRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Package> {
    return this.$raw
      .deletePackage(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/SearchPackages
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
   * Unary call @/san11_platform.San11Platform/CreateBinary
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
   * Unary call @/san11_platform.San11Platform/GetBinary
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
   * Unary call @/san11_platform.San11Platform/BatchGetBinary
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
   * Unary call @/san11_platform.San11Platform/ListBinaries
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
   * Unary call @/san11_platform.San11Platform/UpdateBinary
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
   * Unary call @/san11_platform.San11Platform/DeleteBinary
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Binary>
   */
  deleteBinary(
    requestData: thisProto.DeleteBinaryRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Binary> {
    return this.$raw
      .deleteBinary(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/DownloadBinary
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
   * Unary call @/san11_platform.San11Platform/CreateImage
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
   * Unary call @/san11_platform.San11Platform/CreateThread
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Thread>
   */
  createThread(
    requestData: thisProto.CreateThreadRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Thread> {
    return this.$raw
      .createThread(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/GetThread
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Thread>
   */
  getThread(
    requestData: thisProto.GetThreadRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Thread> {
    return this.$raw
      .getThread(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/ListThreads
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ListThreadsResponse>
   */
  listThreads(
    requestData: thisProto.ListThreadsRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ListThreadsResponse> {
    return this.$raw
      .listThreads(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/UpdateThread
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Thread>
   */
  updateThread(
    requestData: thisProto.UpdateThreadRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Thread> {
    return this.$raw
      .updateThread(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/DeleteThread
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Thread>
   */
  deleteThread(
    requestData: thisProto.DeleteThreadRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Thread> {
    return this.$raw
      .deleteThread(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/CreateComment
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
   * Unary call @/san11_platform.San11Platform/ListComments
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
   * Unary call @/san11_platform.San11Platform/UpdateComment
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
   * Unary call @/san11_platform.San11Platform/DeleteComment
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Comment>
   */
  deleteComment(
    requestData: thisProto.DeleteCommentRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Comment> {
    return this.$raw
      .deleteComment(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/CreateReply
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
   * Unary call @/san11_platform.San11Platform/UpdateReply
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
   * Unary call @/san11_platform.San11Platform/DeleteReply
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Reply>
   */
  deleteReply(
    requestData: thisProto.DeleteReplyRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Reply> {
    return this.$raw
      .deleteReply(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/CreateArticle
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
   * Unary call @/san11_platform.San11Platform/GetArticle
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
   * Unary call @/san11_platform.San11Platform/ListArticles
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
   * Unary call @/san11_platform.San11Platform/UpdateArticle
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
   * Unary call @/san11_platform.San11Platform/DeleteArticle
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
   * Unary call @/san11_platform.San11Platform/SignIn
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
   * Unary call @/san11_platform.San11Platform/SignOut
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
   * Unary call @/san11_platform.San11Platform/CreateUser
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.CreateUserResponse>
   */
  createUser(
    requestData: thisProto.CreateUserRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.CreateUserResponse> {
    return this.$raw
      .createUser(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/GetUser
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
   * Unary call @/san11_platform.San11Platform/ListUsers
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
   * Unary call @/san11_platform.San11Platform/UpdateUser
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
   * Unary call @/san11_platform.San11Platform/SendVerificationCode
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
   * Unary call @/san11_platform.San11Platform/VerifyEmail
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
   * Unary call @/san11_platform.San11Platform/ValidateNewUser
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Status>
   */
  validateNewUser(
    requestData: thisProto.ValidateNewUserRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Status> {
    return this.$raw
      .validateNewUser(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/UpdatePassword
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.User>
   */
  updatePassword(
    requestData: thisProto.UpdatePasswordRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.User> {
    return this.$raw
      .updatePassword(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/ListActivities
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
   * Unary call @/san11_platform.San11Platform/ToggleAction
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ToggleActionResponse>
   */
  toggleAction(
    requestData: thisProto.ToggleActionRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ToggleActionResponse> {
    return this.$raw
      .toggleAction(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/ListNotifications
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ListNotificationsResponse>
   */
  listNotifications(
    requestData: thisProto.ListNotificationsRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ListNotificationsResponse> {
    return this.$raw
      .listNotifications(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/UpdateNotification
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Notification>
   */
  updateNotification(
    requestData: thisProto.UpdateNotificationRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Notification> {
    return this.$raw
      .updateNotification(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/CreateTag
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
   * Unary call @/san11_platform.San11Platform/ListTags
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
   * Unary call @/san11_platform.San11Platform/DeleteTag
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Tag>
   */
  deleteTag(
    requestData: thisProto.DeleteTagRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Tag> {
    return this.$raw
      .deleteTag(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/GetStatistic
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
   * Unary call @/san11_platform.San11Platform/GetAdminMessage
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

  /**
   * Unary call @/san11_platform.San11Platform/CreateSubscription
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Subscription>
   */
  createSubscription(
    requestData: thisProto.CreateSubscriptionRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Subscription> {
    return this.$raw
      .createSubscription(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/ListSubscriptioins
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ListSubscriptionsResponse>
   */
  listSubscriptioins(
    requestData: thisProto.ListSubscriptionsRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ListSubscriptionsResponse> {
    return this.$raw
      .listSubscriptioins(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/UpdateSubscription
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Subscription>
   */
  updateSubscription(
    requestData: thisProto.UpdateSubscriptionRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Subscription> {
    return this.$raw
      .updateSubscription(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/san11_platform.San11Platform/DeleteSubscription
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Subscription>
   */
  deleteSubscription(
    requestData: thisProto.DeleteSubscriptionRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Subscription> {
    return this.$raw
      .deleteSubscription(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
