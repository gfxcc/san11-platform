import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { GetPackageRequest, Package } from "../../../proto/san11-platform.pb";
import { San11PlatformServiceService } from "../../service/san11-platform-service.service";


@Injectable({
  providedIn: 'root'
})
export class PackageResolverService implements Resolve<Package> {
  constructor(
    private san11pkService: San11PlatformServiceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Package> | Promise<Package> | Package {
    return this.san11pkService.getPackage(new GetPackageRequest({
      name: `categories/${route.params['categoryId']}/packages/${route.params['packageId']}`,
    }));
  }
}
