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
     * Unary RPC for /routeguide.RouteGuide/UploadBinary
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Status>>
     */
    uploadBinary: (
      requestData: thisProto.UploadBinaryRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Status>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/UploadBinary',
        requestData,
        requestMetadata,
        requestClass: thisProto.UploadBinaryRequest,
        responseClass: thisProto.Status
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
     * Unary RPC for /routeguide.RouteGuide/UploadImage
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Status>>
     */
    uploadImage: (
      requestData: thisProto.UploadImageRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Status>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/UploadImage',
        requestData,
        requestMetadata,
        requestClass: thisProto.UploadImageRequest,
        responseClass: thisProto.Status
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/GetImage
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Image>>
     */
    getImage: (
      requestData: thisProto.GetimageRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Image>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/GetImage',
        requestData,
        requestMetadata,
        requestClass: thisProto.GetimageRequest,
        responseClass: thisProto.Image
      });
    },
    /**
     * Unary RPC for /routeguide.RouteGuide/ListImages
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.ListImagesResponse>>
     */
    listImages: (
      requestData: thisProto.ListImagesRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.ListImagesResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/routeguide.RouteGuide/ListImages',
        requestData,
        requestMetadata,
        requestClass: thisProto.ListImagesRequest,
        responseClass: thisProto.ListImagesResponse
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
   * Unary RPC for /routeguide.RouteGuide/UploadBinary
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Status>
   */
  uploadBinary(
    requestData: thisProto.UploadBinaryRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Status> {
    return this.$raw
      .uploadBinary(requestData, requestMetadata)
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
   * Unary RPC for /routeguide.RouteGuide/UploadImage
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Status>
   */
  uploadImage(
    requestData: thisProto.UploadImageRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Status> {
    return this.$raw
      .uploadImage(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/GetImage
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Image>
   */
  getImage(
    requestData: thisProto.GetimageRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Image> {
    return this.$raw
      .getImage(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary RPC for /routeguide.RouteGuide/ListImages
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.ListImagesResponse>
   */
  listImages(
    requestData: thisProto.ListImagesRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.ListImagesResponse> {
    return this.$raw
      .listImages(requestData, requestMetadata)
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
}
