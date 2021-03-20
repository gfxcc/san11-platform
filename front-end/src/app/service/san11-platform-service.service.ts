import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { SIRE_PACKAGES, PLAYER_PACKAGES, MOD_MAKER_PACKAGES } from './../mock-packages'

import { GrpcEvent, GrpcMetadata, GrpcStatusEvent } from '@ngx-grpc/common';

import { CreatePackageRequest, DeletePackageRequest, GetUserRequest, ListPackagesResponse, UploadBinaryRequest, UploadImageRequest } from '../../proto/san11-platform.pb'
import { UpdatePackageRequest } from '../../proto/san11-platform.pb'
import { Statistic, User, Package, Binary, Status, Empty } from '../../proto/san11-platform.pb'
import { ListPackagesRequest } from '../../proto/san11-platform.pb';
import { SignInRequest, SignInResponse } from '../../proto/san11-platform.pb';
import { SignUpRequest, SignUpResponse } from '../../proto/san11-platform.pb';
import { SignOutRequest } from '../../proto/san11-platform.pb'
import { DownloadBinaryRequest } from '../../proto/san11-platform.pb'
import { GetStatisticRequest } from '../../proto/san11-platform.pb'
import { DeleteBinaryRequest } from "../../proto/san11-platform.pb";

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

  listPackages(categoryId: number, page_size: number, page_token: string): Observable<ListPackagesResponse> {
    const request = new ListPackagesRequest({ categoryId: categoryId.toString() });
    return this.severClient.listPackages(request, this.getMetadata());
  }

  createPackage(san11Package: Package) : Observable<Package> {
    const request = new CreatePackageRequest({package: san11Package});
    return this.severClient.createPackage(request, this.getMetadata());
  }

  updatePackage(san11Package: Package) : Observable<Package> {
    const request = new UpdatePackageRequest({package: san11Package});
    return this.severClient.updatePackage(request, this.getMetadata());
  }

  deletePackage(san11Package: Package) : Observable<Empty> {
    const request = new DeletePackageRequest({package: new Package({packageId: san11Package.packageId})});
    return this.severClient.deletePackage(request, this.getMetadata());
  }

  // getPlayerPackages(): Package[] {
  //   return PLAYER_PACKAGES;
  // }

  // getModMakerPackages(): Package[] {
  //   return MOD_MAKER_PACKAGES;
  // }

  uploadBinary(parent: string, binary: Binary, data) : Observable<Status> {
    const requst = new UploadBinaryRequest({ parent: parent, binary: binary, data: data});
    return this.severClient.uploadBinary(requst, this.getMetadata());
  }

  downloadBinary(parent: string, binaryId: string) : Observable<Binary> {
    const request = new DownloadBinaryRequest({parent: parent, binaryId: binaryId});
    return this.severClient.downloadBinary(request, this.getMetadata());
  }

  deleteBinary(binaryId: string) : Observable<Empty> {
    const request = new DeleteBinaryRequest({binaryId: binaryId});
    return this.severClient.deleteBinary(request, this.getMetadata());
  }

  // images

  uploadImage(parent: string, image: Uint8Array) : Observable<Status>{
    const requst = new UploadImageRequest({ parent: parent, image: image});
    return this.severClient.uploadImage(requst, this.getMetadata());
  }

  // @Cacheable()
  // getImage(imageId): Observable<Image> {
  //   // const request = new GetimageRequest({imageId: imageId});
  //   // return this.severClient.getImage(request, this.getMetadata());
  // }


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

  signUp(user): Observable<SignUpResponse> {
    const request = new SignUpRequest({
      user: new User({
        username: user.username,
        email: user.email,
        imageUrl: null
      }),
      password: user.password
    });
    return this.severClient.signUp(request);
  }

  @Cacheable()
  getUser(userId): Observable<User> {
    // TODO: add a cache layer
    const request = new GetUserRequest({userId: userId});
    return this.severClient.getUser(request);
  }

  getStatistic(): Observable<Statistic> {
    const request = new GetStatisticRequest({date: null});
    return this.severClient.getStatistic(request, this.getMetadata());
  }

  // UTILS

  getMetadata() {
    return new GrpcMetadata({sid: localStorage.getItem('sid')});
  }
}
