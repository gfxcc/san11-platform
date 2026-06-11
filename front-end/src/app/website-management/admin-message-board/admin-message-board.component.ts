import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/common/notification.service';
import { ProgressService } from 'src/app/progress.service';
import { activityToEvent } from 'src/app/utils/activity_util';
import { notificationToEvent } from 'src/app/utils/notification_util';
import { Action, Activity, ListActivitiesRequest, ListActivitiesResponse, ListNotificationsRequest, ListNotificationsResponse, ListPackagesRequest, Notification, Package, ResourceState } from 'src/proto/san11-platform.pb';
import { GlobalConstants } from 'src/app/common/global-constants';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';

interface AdminMetricSummary {
  totalUsers: number;
  newUsers7d: number;
  newUsers30d: number;
  monthlyActiveUsers: number;
  totalPackages: number;
  publicPackages: number;
  pendingReviews: number;
  hiddenPackages: number;
  downloads30d: number;
  socialActions30d: number;
  contentChanges30d: number;
}

interface AdminUserSummary {
  name?: string;
  userId: number;
  username: string;
  type?: string;
  imageUrl?: string;
  createTime?: string;
  subscriberCount?: number;
  activityCount?: number;
  lastActiveAt?: string;
}

interface AdminPackageSummary {
  name: string;
  packageName: string;
  authorId: number;
  state: string;
  downloadCount: number;
  likeCount: number;
  dislikeCount: number;
  createTime: string;
  updateTime: string;
}

interface AdminOperationsSummary {
  generatedAt?: string;
  windowDays: number;
  metrics: AdminMetricSummary;
  resourceStates: { [key: string]: number };
  recentUsers: AdminUserSummary[];
  activeUsers: AdminUserSummary[];
  topPackages: AdminPackageSummary[];
}

type UiStyle = 'clean' | 'flat' | 'crystal';

const EMPTY_METRICS: AdminMetricSummary = {
  totalUsers: 0,
  newUsers7d: 0,
  newUsers30d: 0,
  monthlyActiveUsers: 0,
  totalPackages: 0,
  publicPackages: 0,
  pendingReviews: 0,
  hiddenPackages: 0,
  downloads30d: 0,
  socialActions30d: 0,
  contentChanges30d: 0,
};

const EMPTY_ADMIN_SUMMARY: AdminOperationsSummary = {
  windowDays: 30,
  metrics: EMPTY_METRICS,
  resourceStates: {},
  recentUsers: [],
  activeUsers: [],
  topPackages: [],
};

@Component({
  selector: 'app-admin-message-board',
  templateUrl: './admin-message-board.component.html',
  styleUrls: ['./admin-message-board.component.css']
})
export class AdminMessageBoardComponent implements OnInit {
  userId: string;

  resourceChanges: any[] = [];
  socialActivaties: any[] = [];
  downloads: any[] = [];
  notifications: any[] = [];
  pendingReviews: Package[] = [];
  adminSummary: AdminOperationsSummary = EMPTY_ADMIN_SUMMARY;
  loadingAdminSummary = false;
  uiStyle: UiStyle = 'flat';

  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private progressService: ProgressService,
  ) { }

  ngOnInit(): void {
    this.uiStyle = this.currentUiStyle();
    this.route.parent.params.subscribe(params => {
      this.userId = params.userId;
      this.loadAdminSummary();
      this.load_activities();
      this.loadNotifications();
      this.loadPendingReviews();
    });
  }

  setUiStyle(nextStyle: UiStyle): void {
    const style = this.normalizeUiStyle(nextStyle) ?? 'flat';
    this.uiStyle = style;
    localStorage.setItem('san11-ui-style', style);
    document.body.classList.toggle('ui-style-clean', style === 'clean');
    document.body.classList.toggle('ui-style-classic', style === 'clean');
    document.body.classList.toggle('ui-style-default', style === 'clean');
    document.body.classList.toggle('ui-style-flat', style === 'flat');
    document.body.classList.toggle('ui-style-flat2d', style === 'flat');
    document.body.classList.toggle('ui-style-crystal', style === 'crystal');
    document.body.classList.toggle('ui-style-glass3', style === 'crystal');
  }

  getUiStyleIndex(): number {
    if (this.uiStyle === 'crystal') {
      return 2;
    }
    if (this.uiStyle === 'flat') {
      return 1;
    }
    return 0;
  }

  private currentUiStyle(): UiStyle {
    return this.normalizeUiStyle(localStorage.getItem('san11-ui-style')) ?? 'flat';
  }

  private normalizeUiStyle(value: string | null): UiStyle | null {
    if (value === 'clean' || value === 'classic' || value === 'default') {
      return 'clean';
    }
    if (value === 'flat' || value === 'flat2d') {
      return 'flat';
    }
    if (value === 'crystal' || value === 'glass3') {
      return 'crystal';
    }
    return null;
  }

  loadAdminSummary(): void {
    this.loadingAdminSummary = true;
    this.progressService.loading();
    this.san11pkService.getAdminMessage()
      .pipe(finalize(() => {
        this.loadingAdminSummary = false;
        this.progressService.complete();
      }))
      .subscribe({
        next: (resp) => {
          try {
            const parsed = JSON.parse(resp.message || '{}') as Partial<AdminOperationsSummary>;
            this.adminSummary = {
              ...EMPTY_ADMIN_SUMMARY,
              ...parsed,
              metrics: {
                ...EMPTY_METRICS,
                ...parsed.metrics,
              },
              resourceStates: parsed.resourceStates || {},
              recentUsers: parsed.recentUsers || [],
              activeUsers: parsed.activeUsers || [],
              topPackages: parsed.topPackages || [],
            };
          } catch (error) {
            this.adminSummary = EMPTY_ADMIN_SUMMARY;
            this.notificationService.warn('管理员运营数据格式无法解析');
          }
        },
        error: (error) => {
          this.notificationService.warn(`获取管理员运营数据失败: ${error.statusMessage}`);
        }
      });
  }

  loadPendingReviews(): void {
    this.pendingReviews = [];

    const pendingReviewRequests = GlobalConstants.categories.map(category =>
      this.san11pkService.listPackages(new ListPackagesRequest({
        parent: `categories/${category.value}`,
      }))
    );

    if (!pendingReviewRequests.length) {
      return;
    }

    this.progressService.loading();
    forkJoin(pendingReviewRequests)
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: responses => {
          this.pendingReviews = responses.flatMap(resp =>
            resp.packages.filter(item => item.state === ResourceState.UNDER_REVIEW)
          );
        },
        error: error => {
          this.notificationService.warn(`获取审核队列失败: ${error.statusMessage}`);
        }
      });
  }

  openPackage(san11Package: Package): void {
    this.openPackageByName(san11Package.name);
  }

  openPackageByName(name: string): void {
    if (!name) {
      return;
    }

    this.router.navigate(name.split('/'));
  }

  openUser(user: AdminUserSummary): void {
    if (!user?.userId) {
      return;
    }

    this.router.navigate(['/users', user.userId, 'publishedPackages']);
  }

  get metrics(): AdminMetricSummary {
    return this.adminSummary?.metrics || EMPTY_METRICS;
  }

  get adminTotalActivityCount(): number {
    return this.resourceChanges.length + this.socialActivaties.length + this.notifications.length + this.downloads.length;
  }

  get activeUserRate(): string {
    if (!this.metrics.totalUsers) {
      return '0%';
    }

    const rate = this.metrics.monthlyActiveUsers / this.metrics.totalUsers * 100;
    if (rate > 0 && rate < 1) {
      return '<1%';
    }

    return `${Math.round(rate)}%`;
  }

  get pendingReviewSummary(): string {
    const pendingCount = this.pendingReviews.length || this.metrics.pendingReviews;
    if (pendingCount === 0) {
      return '审核队列为空';
    }

    return `${pendingCount} 个资源等待审核`;
  }

  get metricCards() {
    return [
      {
        label: '注册用户',
        value: this.metrics.totalUsers,
        detail: `7 天新增 ${this.metrics.newUsers7d}，30 天新增 ${this.metrics.newUsers30d}`,
        icon: 'group',
        tone: 'blue',
      },
      {
        label: '月活用户',
        value: this.metrics.monthlyActiveUsers,
        detail: `${this.adminSummary.windowDays || 30} 天活跃率 ${this.activeUserRate}`,
        icon: 'monitoring',
        tone: 'green',
      },
      {
        label: '资源总量',
        value: this.metrics.totalPackages,
        detail: `公开 ${this.metrics.publicPackages}，隐藏 ${this.metrics.hiddenPackages}`,
        icon: 'inventory_2',
        tone: 'violet',
      },
      {
        label: '待审核',
        value: this.pendingReviews.length || this.metrics.pendingReviews,
        detail: this.pendingReviewSummary,
        icon: 'pending_actions',
        tone: 'amber',
        urgent: (this.pendingReviews.length || this.metrics.pendingReviews) > 0,
      },
      {
        label: '30 天下载',
        value: this.metrics.downloads30d,
        detail: '反映近期内容消费情况',
        icon: 'download',
        tone: 'slate',
      },
      {
        label: '30 天互动',
        value: this.metrics.socialActions30d,
        detail: `内容变更 ${this.metrics.contentChanges30d} 条`,
        icon: 'forum',
        tone: 'rose',
      },
    ];
  }

  get resourceStateCards() {
    return [
      { key: 'NORMAL', label: '公开', value: this.adminSummary.resourceStates?.NORMAL || 0, icon: 'public' },
      { key: 'UNDER_REVIEW', label: '审核中', value: this.adminSummary.resourceStates?.UNDER_REVIEW || 0, icon: 'rule' },
      { key: 'HIDDEN', label: '隐藏', value: this.adminSummary.resourceStates?.HIDDEN || 0, icon: 'visibility_off' },
      { key: 'SCHEDULED_DELETE', label: '计划删除', value: this.adminSummary.resourceStates?.SCHEDULED_DELETE || 0, icon: 'event_busy' },
      { key: 'DELETED', label: '已删除', value: this.adminSummary.resourceStates?.DELETED || 0, icon: 'delete' },
    ];
  }

  get todoCards() {
    const pendingCount = this.pendingReviews.length || this.metrics.pendingReviews;
    const scheduledDeleteCount = this.adminSummary.resourceStates?.SCHEDULED_DELETE || 0;
    const hiddenCount = this.metrics.hiddenPackages;

    return [
      {
        label: '审核资源',
        value: pendingCount,
        description: pendingCount ? '需要确认是否允许公开展示。' : '没有等待审核的资源。',
        icon: 'rule',
        priority: pendingCount ? 'high' : 'normal',
      },
      {
        label: '计划删除',
        value: scheduledDeleteCount,
        description: scheduledDeleteCount ? '建议确认是否需要最终清理。' : '没有计划删除项。',
        icon: 'event_busy',
        priority: scheduledDeleteCount ? 'medium' : 'normal',
      },
      {
        label: '隐藏资源',
        value: hiddenCount,
        description: hiddenCount ? '适合定期复核隐藏原因。' : '没有隐藏资源。',
        icon: 'visibility_off',
        priority: hiddenCount ? 'medium' : 'normal',
      },
    ];
  }

  get recentEvents(): any[] {
    return [
      ...this.resourceChanges,
      ...this.socialActivaties,
      ...this.downloads,
      ...this.notifications,
    ].slice(0, 12);
  }

  packageCategoryName(san11Package: Package): string {
    return this.packageCategoryNameFromName(san11Package.name);
  }

  packageCategoryNameFromName(name: string): string {
    const categoryId = name?.split('/')?.[1];
    return GlobalConstants.categories.find(category => category.value === categoryId)?.text || '资源';
  }

  resourceStateLabel(state: string): string {
    const labels: { [key: string]: string } = {
      NORMAL: '公开',
      UNDER_REVIEW: '审核中',
      HIDDEN: '隐藏',
      SCHEDULED_DELETE: '计划删除',
      DELETED: '已删除',
    };
    return labels[state] || state || '未知';
  }

  load_activities() {
    this.progressService.loading();

    this.san11pkService.listActivities(new ListActivitiesRequest({
      parent: '',
      orderBy: 'create_time desc',
      pageSize: '100',
    }))
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: (resp: ListActivitiesResponse) => {
          this.resourceChanges = resp.activities.filter((x) => [Action.CREATE, Action.UPDATE, Action.DELETE].includes(x.action)).map((activity: Activity) => {
            return activityToEvent(activity);
          });
          this.socialActivaties = resp.activities.filter((x) => [Action.LIKE, Action.SUBSCRIBE, Action.UPVOTE, Action.UNSUBSCRIBE, Action.DISLIKE].includes(x.action)).map((activity: Activity) => {
            return activityToEvent(activity);
          });
          this.downloads = resp.activities.filter((x) => x.action === Action.DOWNLOAD).map((activity: Activity) => {
            return activityToEvent(activity);
          });
        },
        error: (error) => {
          this.notificationService.warn(`获取时间线失败: ${error.statusMessage}`)
        }
      });
  }

  loadNotifications() {
    this.progressService.loading();

    this.san11pkService.listNotifications(new ListNotificationsRequest({
      parent: '',
      orderBy: 'create_time desc',
      pageSize: '100',
    }))
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: (resp: ListNotificationsResponse) => {
          this.notifications = resp.notifications.map((notification: Notification) => {
            return notificationToEvent(notification);
          });
        },
        error: (error) => {
          this.notificationService.warn(`获取通知失败: ${error.statusMessage}`)
        }
      });
  }

  onDetailClick(event) {
    if (!event?.link) {
      return;
    }
    this.router.navigateByUrl(event.link);
  }

  eventTitle(event, fallback: string): string {
    return event?.displayName || fallback;
  }

  eventTime(event): string {
    const value = event?.createTime;
    if (!value) {
      return '';
    }

    if (value instanceof Date) {
      return this.formatDate(value);
    }

    if (typeof value === 'string') {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? value : this.formatDate(parsed);
    }

    return String(value);
  }

  formatTime(value?: string): string {
    if (!value) {
      return '';
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : this.formatDate(parsed);
  }

  private formatDate(value: Date): string {
    return value.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
