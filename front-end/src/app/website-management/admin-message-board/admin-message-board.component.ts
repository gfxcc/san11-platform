import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from 'src/app/common/notification.service';
import { ProgressService } from 'src/app/progress.service';
import { activityToEvent } from 'src/app/utils/activity_util';
import { notificationToEvent } from 'src/app/utils/notification_util';
import { Action, Activity, ListActivitiesRequest, ListActivitiesResponse, ListNotificationsRequest, ListNotificationsResponse, Notification } from 'src/proto/san11-platform.pb';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';


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
    });
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
            console.debug(activity);
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
    this.router.navigateByUrl(event.link);
  }
}
