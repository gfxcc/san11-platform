import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { GetThreadRequest, Thread } from 'src/proto/san11-platform.pb';

@Injectable({
  providedIn: 'root'
})
export class ThreadResolverService {

  constructor(
    private san11pkService: San11PlatformServiceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Thread> | Promise<Thread> | Thread {
    const urlPattern = /\/([a-zA-Z0-9/]+)\/threads\/([0-9]+)/;
    const match = state.url.match(urlPattern);
    return this.san11pkService.getThread(new GetThreadRequest({
      name: `${match[1]}/threads/${match[2]}`,
    }));
  }
}
