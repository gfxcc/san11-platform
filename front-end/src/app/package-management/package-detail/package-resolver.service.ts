import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Package } from "../../../proto/san11-platform.pb";
import { San11PlatformServiceService } from "../../service/san11-platform-service.service";
import { Observable, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PackageResolverService implements Resolve<Package> {
  constructor(
    private san11pkService: San11PlatformServiceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Package> | Promise<Package> | Package {
    return this.san11pkService.getPackage(route.params['packageId']);
  }
}
