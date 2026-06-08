import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Package, ResourceState } from '../../../proto/san11-platform.pb';
import { NotificationService } from '../../common/notification.service';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { GlobalConstants } from '../../common/global-constants';
import { ListPackagesRequest } from '../../../proto/san11-platform.pb';

@Component({
  selector: 'app-published-packages',
  templateUrl: './published-packages.component.html',
  styleUrls: ['./published-packages.component.css']
})
export class PublishedPackagesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userId: string;

  displayedColumns: string[] = ['name', 'status', 'maintenance', 'updateTime', 'downloadCount'];
  dataSource: MatTableDataSource<Package>;
  publishedPackages: Package[] = [];
  constructor(
    private notificationService: NotificationService,
    private san11pkService: San11PlatformServiceService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.userId = params.userId;
      this.loadPackageList(this.userId);
    });
  }

  loadPackageList(userId: string) {
    this.publishedPackages = [];
    GlobalConstants.categories.forEach(category => {
      this.san11pkService.listPackages(new ListPackagesRequest({
        parent: `categories/${category.value}`,
        filter: `author_id=${userId}`,
        orderBy: 'update_time DESC',
      })).subscribe({
        next: resp => {
          this.publishedPackages.push(...resp.packages);
          this.dataSource = new MatTableDataSource(this.publishedPackages);
          this.dataSource.paginator = this.paginator;
        },
        error: error => this.notificationService.warn(`获取作品失败: ${error.statusMessage}`),
      });
    });
  }

  onPackageClick(san11Package: Package) {
    this.router.navigate(san11Package.name.split('/'));
  }

  stateLabel(san11Package: Package): string {
    switch (san11Package.state) {
      case ResourceState.NORMAL:
        return '正常展示';
      case ResourceState.UNDER_REVIEW:
        return '待审核';
      case ResourceState.HIDDEN:
        return '已隐藏';
      case ResourceState.DELETED:
        return '已删除';
      default:
        return '未知状态';
    }
  }

  stateTone(san11Package: Package): string {
    switch (san11Package.state) {
      case ResourceState.NORMAL:
        return 'normal';
      case ResourceState.UNDER_REVIEW:
        return 'review';
      case ResourceState.HIDDEN:
        return 'hidden';
      case ResourceState.DELETED:
        return 'danger';
      default:
        return 'default';
    }
  }

  maintenanceItems(san11Package: Package): string[] {
    const items: string[] = [];
    if (!san11Package.imageUrls?.length) {
      items.push('缺截图');
    }
    if (!san11Package.description || san11Package.description.trim().length < 80) {
      items.push('介绍偏短');
    }
    if (!san11Package.tags?.length) {
      items.push('缺标签');
    }
    return items;
  }

  maintenanceText(san11Package: Package): string {
    const items = this.maintenanceItems(san11Package);
    return items.length === 0 ? '资料完整' : items.join('、');
  }
}
