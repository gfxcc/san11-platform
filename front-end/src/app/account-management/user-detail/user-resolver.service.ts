import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { User } from "../../../proto/san11-platform.pb";
import { San11PlatformServiceService } from "../../service/san11-platform-service.service";
import { Observable, Subscription } from 'rxjs';

import { GetUserRequest } from "./../../../proto/san11-platform.pb";


@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<User> {
  constructor(
    private san11Service: San11PlatformServiceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Promise<User> | User {
    return this.san11Service.getUser(new GetUserRequest({ userId: route.params['userId'] }));
  }

}
