import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { User } from "../../../proto/san11-platform.pb";
import { San11PlatformServiceService } from "../../service/san11-platform-service.service";
import { GetUserRequest } from "./../../../proto/san11-platform.pb";



@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<User> {
  constructor(
    private san11Service: San11PlatformServiceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Promise<User> | User {
    return this.san11Service.getUser(new GetUserRequest({
      name: `users/${route.params['userId']}`,
    }));
  }

}
