import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { loadUser } from 'src/app/utils/user_util';
import { GetUserRequest, User } from 'src/proto/san11-platform.pb';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User> {

  constructor(
    private san11Service: San11PlatformServiceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Promise<User> | User {
    const userId = route.params['userId'] || route.parent.params.userId || loadUser().userId;
    return this.san11Service.getUser(new GetUserRequest({
      name: `users/${userId}`,
    }));
  }
}
