import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Package } from '../../../proto/san11-platform.pb'
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { NotificationService } from "../../common/notification.service";

import { PackageDetailComponent } from "../../package-management/package-detail/package-detail.component";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  category_id: number;

  packages: Package[] = [];

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private san11PlatformServiceService: San11PlatformServiceService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: any) => {
        this.category_id = Number(params['categoryId']);
        this.loadPackages();

        console.log(params);
        const packageId = params['packageId'];
        console.log('packageId=' + packageId);

        if (packageId != undefined) {
          this.loadPackageDetail(packageId);
        }

      }
    );
  }

  loadPackages(): void {
    this.san11PlatformServiceService.listPackages(this.category_id, 0, "0").subscribe(
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

}
