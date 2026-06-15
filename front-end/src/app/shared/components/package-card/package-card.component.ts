import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { isAdmin } from 'src/app/utils/user_util';
import { DeletePackageRequest, GetUserRequest, Package, ResourceState, User } from '../../../../proto/san11-platform.pb';
import { NotificationService } from "../../../common/notification.service";
import { DownloadService } from "../../../service/download.service";
import { San11PlatformServiceService } from '../../../service/san11-platform-service.service';
import { getDefaultPackageScreenshot } from '../../../utils/package_util';
import { getFullUrl } from "../../../utils/resrouce_util";

@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.css']
})
export class PackageCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() package: Package;

  author: User;
  authorName: string;
  authorImage: string;

  screenshot: string = undefined;
  selectedBinary;

  displayScreenshotLoading: boolean = true;
  displayAuthorImgLoading: boolean = true;
  metricPulse = {
    download: false,
    like: false,
  };
  private metricPulseTimeouts: Partial<Record<'download' | 'like', ReturnType<typeof setTimeout>>> = {};

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private san11PlatformServiceService: San11PlatformServiceService,
    private downloads: DownloadService,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    this.san11PlatformServiceService.getUser(new GetUserRequest({
      name: `users/${this.package.authorId}`,
    })).subscribe(
      user => {
        this.author = user;
        this.authorName = user.username;

        if (this.author.imageUrl != '') {
          this.authorImage = getFullUrl(this.author.imageUrl);
        } else {
          this.authorImage = 'assets/images/zhuge.jpg';
        }
      }
    );
    this.loadImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const packageChange = changes['package'];

    if (!packageChange || packageChange.firstChange) {
      return;
    }

    const previousPackage = packageChange.previousValue as Package;
    const currentPackage = packageChange.currentValue as Package;

    if ((previousPackage?.downloadCount || 0) !== (currentPackage?.downloadCount || 0)) {
      this.startMetricPulse('download');
    }

    if ((previousPackage?.likeCount || 0) !== (currentPackage?.likeCount || 0)) {
      this.startMetricPulse('like');
    }
  }

  ngOnDestroy(): void {
    Object.values(this.metricPulseTimeouts).forEach(timeout => clearTimeout(timeout));
  }

  ngAfterViewInit() {
    // this.renderer.setStyle(this.authorImageElement.nativeElement, 'background-image', "url('" + this.authorImage + "')");
  }

  loadImage() {
    if (this.package.imageUrls.length === 0) {
      const defaultScreenshot = getDefaultPackageScreenshot(this.package);
      this.screenshot = defaultScreenshot ? getFullUrl(defaultScreenshot) : undefined;
    } else {
      this.screenshot = getFullUrl(this.package.imageUrls[0]);
    }
  }

  private startMetricPulse(metric: 'download' | 'like') {
    if (this.metricPulseTimeouts[metric]) {
      clearTimeout(this.metricPulseTimeouts[metric]);
    }

    this.metricPulse[metric] = false;
    requestAnimationFrame(() => {
      this.metricPulse[metric] = true;
      this.metricPulseTimeouts[metric] = setTimeout(() => {
        this.metricPulse[metric] = false;
      }, 360);
    });
  }

  isAdmin() {
    return isAdmin();
  }

  isAuthor() {
    return this.package.authorId === localStorage.getItem('userId');
  }

  onClick() {
    this.router.navigate(this.package.name.split('/'));
  }

  getStatusName() {
    return ResourceState[this.package.state];
  }

  get shouldShowStatusBadge(): boolean {
    return this.isAdmin() && this.package.state !== ResourceState.NORMAL;
  }

  get resourceStatus(): { label: string; icon: string; tone: 'review' | 'hidden' | 'scheduled' | 'deleted' | 'default' } {
    switch (this.package.state) {
      case ResourceState.UNDER_REVIEW:
        return { label: '待审核', icon: 'hourglass_top', tone: 'review' };
      case ResourceState.HIDDEN:
        return { label: '已隐藏', icon: 'visibility_off', tone: 'hidden' };
      case ResourceState.SCHEDULED_DELETE:
        return { label: '待删除', icon: 'event_busy', tone: 'scheduled' };
      case ResourceState.DELETED:
        return { label: '已删除', icon: 'delete_outline', tone: 'deleted' };
      default:
        return { label: '状态异常', icon: 'info', tone: 'default' };
    }
  }

}

export interface DialogData {
  package: Package
}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
  styleUrls: ['./package-card.component.css']
})
export class DeleteDialog {
  package: Package;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private san11PlatformServiceService: San11PlatformServiceService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.package = data.package
  }

  onDeleteConfirm() {
    this.san11PlatformServiceService.deletePackage(new DeletePackageRequest({
      name: this.package.name,
    })).subscribe(
      value => {
        this.notificationService.success('删除成功');
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error => {
        this.notificationService.warn('删除失败:' + error.statusMessage);
      }
    );
  }
}
