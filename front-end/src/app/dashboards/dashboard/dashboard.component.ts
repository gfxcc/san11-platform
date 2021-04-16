import { EventEmitter, Output, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Package } from '../../../proto/san11-platform.pb'
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { NotificationService } from "../../common/notification.service";

import { PackageDetailComponent } from "../../package-management/package-detail/package-detail.component";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDetailComponent } from '../../account-management/user-detail/user-detail.component';
import { EventEmiterService } from "../../service/event-emiter.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  categoryId: number = 1;

  packages: Package[] = [];

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private san11PlatformServiceService: San11PlatformServiceService,
    private _eventEmiter: EventEmiterService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: any) => {
        const categoryId = params['categoryId'];
        if (categoryId != undefined) {
          this.categoryId = Number(categoryId);
        }
        this.loadPackages();

        const packageId = params['packageId'];
        if (packageId != undefined) {
          this.loadPackageDetail(packageId);
        }

        const userId = params['userId'];
        if (userId != undefined) {
          this.loadUserDetail(userId);
        }

      }
    );
  }

  loadPackages(): void {
    this._eventEmiter.sendMessage(this.categoryId.toString());
    this.san11PlatformServiceService.listPackages(this.categoryId, 0, "0").subscribe(
      value => this.packages = value.packages,
      error => {
        this.notificationService.warn('载入工具列表失败:' + error.statusMessage);
      }
    );
  }


  loadPackageDetail(packageId: string) {
    this.san11PlatformServiceService.getPackage(packageId).subscribe(
      san11Package => {
        this.dialog.open(PackageDetailComponent, {
          data: {
            package: san11Package
          }
        });

      },
      error => {
        this.notificationService.warn('载入工具 失败:' + error.statusMessage);
      }
    );
  }

  loadUserDetail(userId: string) {
    this.dialog.open(UserDetailComponent, {
      data: {
        userId: userId
      }
    });
  }

}
