import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { GetUserRequest, User } from '../../../proto/san11-platform.pb';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User> {

  constructor(
    private san11Service: San11PlatformServiceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Promise<User> | User {
    const userId = route.params['userId'] || route.parent.params.userId;
    return this.san11Service.getUser(new GetUserRequest({
      name: `users/${userId}`,
    }));
  }
}
