import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from 'src/app/common/components/loading/loading.component';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { getUserUri, loadUser } from 'src/app/utils/user_util';
import { ListPackagesRequest, ListPackagesResponse, ListSubscriptionsRequest, ListSubscriptionsResponse, Package, Subscription } from 'src/proto/san11-platform.pb';


@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {
  loading: MatDialogRef<LoadingComponent>;
  collectedPackages: Package[] = [];

  constructor(
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loading = this.dialog.open(LoadingComponent);
    this.loadCollections();
  }

  loadCollections() {
    this.san11pkService.listSubscription(new ListSubscriptionsRequest({
      parent: getUserUri(loadUser()),
      filter: 'target="categories/*"',
    })).subscribe(
      (resp: ListSubscriptionsResponse) => {
        this.loadCollectedPackages(resp.subscriptions);
      }, error => {
        this.notificationService.warn("获取收藏失败: " + error.statusMessage);
      }
    );
  }

  loadCollectedPackages(sub: Subscription[]) {
    if (sub.length == 0) {
      this.loading.close();
      return;
    }
    const package_names = sub.map(c => c.target);
    const filter = package_names.map(c => `name="${c}"`).join(' OR ');

    this.san11pkService.listPackages(new ListPackagesRequest({
      parent: '',
      filter: filter,
    })).subscribe(
      (resp: ListPackagesResponse) => {
        this.collectedPackages = resp.packages;
        this.loading.close();
      },
      error => {
        this.loading.close();
        this.notificationService.warn(`获取收藏内容失败: ${error.statusMessage}`);
      }
    );
  }

}
