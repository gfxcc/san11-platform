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
  @Input() showCatalogHeader = true;
  listRequest: ListPackagesRequest = undefined;

  orderOptions: OrderOption[] = [
    { value: 'update_time DESC', viewValue: '更新时间' },
    { value: 'create_time DESC', viewValue: '创建时间' },
    { value: 'like_count DESC', viewValue: '点赞量' },
    { value: 'download_count DESC', viewValue: '下载量' },
  ];
  selectedOrder = this.orderOptions[0].value;
  currentQuery = '';
  currentCategoryId = '';
  currentTagId = '';

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
    if (this.packages != undefined) {
      this.showCatalogHeader = false;
    }

    var obsComb = combineLatest(this.route.params, this.route.queryParams, this.route.parent.params,
      (params, qparams, parentParams) => ({ params, qparams, parentParams }));

    if (this.packages == undefined) {
      obsComb.subscribe(ap => {
        const categoryId = ap.params['categoryId'];
        const tagId = ap.qparams['tagId'];
        const query = ap.qparams['query']
        const userId = ap.parentParams.userId;
        this.currentQuery = query || '';
        this.currentCategoryId = categoryId || '';
        this.currentTagId = tagId || '';

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
          this.showCatalogHeader = false;
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

  clearFilter(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tagId: null },
      queryParamsHandling: 'merge',
    });
  }

  get catalogHeading(): string {
    if (this.currentQuery) {
      return `搜索：${this.currentQuery}`;
    }

    const category = GlobalConstants.categories.find(item => item.value === this.currentCategoryId);
    return category ? category.text : 'San11 工具与 MOD';
  }

  get catalogDescription(): string {
    if (this.currentQuery) {
      return '按名称和资源标识匹配结果，继续使用左侧分类和排序缩小范围。';
    }

    if (this.currentTagId) {
      return '当前正在查看标签筛选结果。';
    }

    return '按分类、标签和热度快速找到可用资源。';
  }

  get emptyStateText(): string {
    if (this.currentQuery) {
      return '没有找到匹配的资源';
    }

    if (this.listRequest?.filter) {
      return '当前筛选条件下没有资源';
    }

    return '这里还没有资源';
  }
}
