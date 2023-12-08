import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from 'src/app/common/notification.service';
import { ProgressService } from 'src/app/progress.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { getUserUri, loadUser, signedIn } from 'src/app/utils/user_util';
import { ListPackagesRequest, ListPackagesResponse, ListSubscriptionsRequest, ListSubscriptionsResponse, Package, Subscription } from 'src/proto/san11-platform.pb';


@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {
  collectedPackages: Package[] = [];

  constructor(
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private router: Router,
    private progressService: ProgressService,
  ) { }

  ngOnInit(): void {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      this.router.navigate(['/']);
      return
    }
    this.loadCollections();
  }

  loadCollections() {
    this.progressService.loading();
    this.san11pkService.listSubscription(new ListSubscriptionsRequest({
      parent: getUserUri(loadUser()),
      filter: 'target="categories/*"',
    }))
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: (resp: ListSubscriptionsResponse) => {
          this.loadCollectedPackages(resp.subscriptions);
        },
        error: error => {
          this.progressService.complete();
          this.notificationService.warn("获取收藏失败: " + error.statusMessage);
        }
      }
      );
  }

  loadCollectedPackages(sub: Subscription[]) {
    if (sub.length == 0) {
      return;
    }
    const package_names = sub.map(c => c.target);
    const filter = package_names.map(c => `name="${c}"`).join(' OR ');

    this.san11pkService.listPackages(new ListPackagesRequest({
      parent: '',
      filter: filter,
    }))
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: (resp: ListPackagesResponse) => {
          this.collectedPackages = resp.packages;
        },
        error: error => {
          this.notificationService.warn(`获取收藏内容失败: ${error.statusMessage}`);
        }
      });
  }

}
