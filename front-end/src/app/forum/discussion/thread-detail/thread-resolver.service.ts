import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { getResolvedUrl } from 'src/app/utils/url_util';
import { GetThreadRequest, Thread } from 'src/proto/san11-platform.pb';

@Injectable({
  providedIn: 'root'
})
export class ThreadResolverService {

  constructor(
    private san11pkService: San11PlatformServiceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Thread> | Promise<Thread> | Thread {
    console.log(route.toString());
    return this.san11pkService.getThread(new GetThreadRequest({
      name: getResolvedUrl(route),
    }));
  }
}
