import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { San11PlatformServiceService } from '../../service/san11-platform-service.service'

import { User } from "../../../proto/san11-platform.pb"

@Injectable({
    providedIn: 'root'
})
export class UserResolver implements Resolve<User> {
    constructor(
        private san11Service: San11PlatformServiceService,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User {
        let user: User;
        this.san11Service.getUser('1').toPromise().then(
            userRet => {
                user = userRet;
            }
        );
        return user
    }
}