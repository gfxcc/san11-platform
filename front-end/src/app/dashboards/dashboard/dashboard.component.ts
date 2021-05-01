import { EventEmitter, Output, Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ListPackagesRequest, Package } from '../../../proto/san11-platform.pb'
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
  packages: Package[] = [];

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private san11pkService: San11PlatformServiceService,
    private _eventEmiter: EventEmiterService,
  ) { }

  ngOnInit(): void {
    // this.route.params.subscribe(
    //   (params: any) => {
    //     this.categoryId = Number(params['categoryId']);
    //     this.loadPackages();
    //   }
    // );

    var obsComb = combineLatest(this.route.params, this.route.queryParams,
      (params, qparams) => ({ params, qparams }));

    obsComb.subscribe(ap => {
      const categoryId = ap.params['categoryId'];
      const tagId = ap.qparams['tagId'];
      const query = ap.qparams['query']

      if (query != undefined) {
        this.searchPackages(query);
      } else {
        this.loadPackages(ap.params['categoryId'], ap.qparams['tagId']);
      }
    });
  }

  loadPackages(categoryId: string, tagId: string): void {
    console.log(`tag: ${tagId}`);
    this._eventEmiter.sendMessage({ categoryId: categoryId });

    this.san11pkService.listPackages(new ListPackagesRequest({ categoryId: categoryId, tagId: tagId })).subscribe(
      value => this.packages = value.packages,
      error => {
        this.notificationService.warn('载入工具列表失败:' + error.statusMessage);
      }
    );
  }

  searchPackages(query: string): void {
    this.san11pkService.searchPackages(query, 0, '').subscribe(
      resp => {
        this.packages = resp.packages;
      },
      error => {
        this.notificationService.warn('搜索失败: ' + error.statusMessage);
      }
    );

  }
}
