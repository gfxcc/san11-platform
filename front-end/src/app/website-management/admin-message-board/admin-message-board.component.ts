import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from 'src/app/common/notification.service';
import { ProgressService } from 'src/app/progress.service';
import { activityToEvent } from 'src/app/utils/activity_util';
import { notificationToEvent } from 'src/app/utils/notification_util';
import { Action, Activity, ListActivitiesRequest, ListActivitiesResponse, ListNotificationsRequest, ListNotificationsResponse, ListPackagesRequest, Notification, Package, ResourceState } from 'src/proto/san11-platform.pb';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { GlobalConstants } from 'src/app/common/global-constants';


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

  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private progressService: ProgressService,
  ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.userId = params.userId;
      this.load_activities();
      this.loadNotifications();
      this.loadPendingReviews();
    });
  }

  loadPendingReviews(): void {
    this.pendingReviews = [];
    GlobalConstants.categories.forEach(category => {
      this.san11pkService.listPackages(new ListPackagesRequest({
        parent: `categories/${category.value}`,
      })).subscribe(resp => {
        this.pendingReviews.push(...resp.packages.filter(item => item.state === ResourceState.UNDER_REVIEW));
      });
    });
  }

  openPackage(san11Package: Package): void {
    this.router.navigate(san11Package.name.split('/'));
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
