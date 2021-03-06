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


    // this.route.parent.params.subscribe(params => {
    //   this.userId = params.userId;
    //   this.loadPackageList(this.userId);
    // });

    var obsComb = combineLatest(this.route.params, this.route.queryParams, this.route.parent.params,
      (params, qparams, parentParams) => ({ params, qparams, parentParams }));

    obsComb.subscribe(ap => {
      const categoryId = ap.params['categoryId'];
      const tagId = ap.qparams['tagId'];
      const query = ap.qparams['query']
      const userId = ap.parentParams.userId;

      if (query != undefined) {
        this.searchPackages(query);
      } else if (categoryId != undefined) {
        this.loadPackages(new ListPackagesRequest({
          categoryId: ap.params['categoryId'],
          tagId: ap.qparams['tagId']
        }));
      } else if (userId != undefined) {
        this.loadPackages(new ListPackagesRequest({
          authorId: userId
        }));
      }
    });
  }

  loadPackages(request: ListPackagesRequest): void {
    this._eventEmiter.sendMessage({ categoryId: request.categoryId });

    this.san11pkService.listPackages(request).subscribe(
      resp => {
        this.packages = resp.packages
      },
      error => {
        this.notificationService.warn('????????????????????????:' + error.statusMessage);
      }
    );
  }

  searchPackages(query: string): void {
    this.san11pkService.searchPackages(query, 0, '').subscribe(
      resp => {
        this.packages = resp.packages;
      },
      error => {
        this.notificationService.warn('????????????: ' + error.statusMessage);
      }
    );

  }
}
