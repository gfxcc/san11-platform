import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, finalize } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { ProgressService } from 'src/app/progress.service';
import { ListPackagesRequest, ListPackagesResponse, Package, SearchPackagesResponse } from '../../../../../proto/san11-platform.pb';
import { NotificationService } from "../../../../common/notification.service";
import { EventEmiterService } from "../../../../service/event-emiter.service";
import { San11PlatformServiceService } from '../../../../service/san11-platform-service.service';

export interface OrderOption {
  value: string,
  viewValue: string,
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Input() packages: Package[];
  listRequest: ListPackagesRequest = undefined;

  orderOptions: OrderOption[] = [
    { value: 'update_time DESC', viewValue: '更新时间' },
    { value: 'create_time DESC', viewValue: '创建时间' },
    { value: 'like_count DESC', viewValue: '点赞量' },
    { value: 'download_count DESC', viewValue: '下载量' },
  ];
  selectedOrder = this.orderOptions[0].value;

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private san11pkService: San11PlatformServiceService,
    private _eventEmiter: EventEmiterService,
    private progressService: ProgressService,
  ) { }

  ngOnInit(): void {
    var obsComb = combineLatest(this.route.params, this.route.queryParams, this.route.parent.params,
      (params, qparams, parentParams) => ({ params, qparams, parentParams }));

    if (this.packages == undefined) {
      obsComb.subscribe(ap => {
        const categoryId = ap.params['categoryId'];
        const tagId = ap.qparams['tagId'];
        const query = ap.qparams['query']
        const userId = ap.parentParams.userId;

        if (query != undefined) {
          this.searchPackages(query);
        } else if (categoryId != undefined) {
          this.listRequest = new ListPackagesRequest({
            parent: `categories/${ap.params['categoryId']}`,
            orderBy: this.selectedOrder,
          })
          if (ap.qparams['tagId'] != undefined) {
            this.listRequest.filter = `tags : "${ap.qparams['tagId']}"`;
          }
          this.loadPackages();
        } else if (userId != undefined) {
          // TODO: Reimplement this with SearchPackage.
          this.packages = [];
          GlobalConstants.categories.forEach(c => {
            this.loadPackagesInCate(userId, parseInt(c.value));
          });
        }
      });
    }
  }

  loadPackages(): void {
    // this._eventEmiter.sendMessage({ categoryId: request.categoryId });
    this.progressService.loading();
    this.san11pkService.listPackages(this.listRequest)
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: (resp: ListPackagesResponse) => {
          this.packages = resp.packages
        },
        error: error => {
          this.notificationService.warn(`载入工具列表失败: ${error.statusMessage}`);
        },
      });
  }

  loadPackagesInCate(userId: string, category: number) {
    this.progressService.loading();
    this.san11pkService.listPackages(new ListPackagesRequest({
      parent: `categories/${category.toString()}`,
      filter: `author_id=${userId}`,
      orderBy: this.selectedOrder,
    }))
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: (resp: ListPackagesResponse) => {
          resp.packages.forEach(p => {
            this.packages.push(p)
          });
        },
        error: (error: any) => {
          this.notificationService.warn(`获取工具列表失败: ${error.statusMessage}`);
        }
      });
  }


  searchPackages(query: string): void {
    this.progressService.loading();
    this.san11pkService.searchPackages(query, 0, '')
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: (resp: SearchPackagesResponse) => {
          this.packages = resp.packages;
        },
        error: error => {
          this.notificationService.warn(`搜索失败: ${error.statusMessage}`);
        },
      });
  }

  onOrderChanged(event) {
    this.listRequest.orderBy = this.selectedOrder;
    this.loadPackages()
  }
}
