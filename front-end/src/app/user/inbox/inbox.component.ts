import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, DefaultUrlSerializer, Router, UrlTree } from '@angular/router';
import { FieldMask } from '@ngx-grpc/well-known-types';
import { finalize } from 'rxjs';
import { NotificationService } from 'src/app/common/notification.service';
import { ProgressService } from 'src/app/progress.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { notificationToEvent } from 'src/app/utils/notification_util';
import { ListNotificationsRequest, ListNotificationsResponse, Notification, UpdateNotificationRequest } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  userId: string;
  notifications: Notification[] = [];
  selectedFilter: 'all' | 'unread' | 'read' = 'all';

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
      this.load_notifications();
    });
  }

  load_notifications() {
    this.progressService.loading();

    this.san11pkService.listNotifications(new ListNotificationsRequest({
      parent: `users/${this.userId}`,
      orderBy: 'create_time desc',
      pageSize: '100',
    }))
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: (resp: ListNotificationsResponse) => {
          this.notifications = resp.notifications;
        },
        error: error => {
          this.notificationService.warn(`获取通知失败: ${error.statusMessage}`)
        }
      });
  }

  onDetailClick(notification: Notification) {
    if (!notification?.link) {
      return;
    }

    if (notification.unread) {
      this.markRead(notification);
      notification.unread = false;
    }

    const urlTree: UrlTree = new DefaultUrlSerializer().parse(notification.link);
    this.router.navigateByUrl(urlTree);
  }

  get filteredNotifications(): Notification[] {
    if (this.selectedFilter === 'unread') {
      return this.notifications.filter(notification => notification.unread);
    }

    if (this.selectedFilter === 'read') {
      return this.notifications.filter(notification => !notification.unread);
    }

    return this.notifications;
  }

  eventOf(notification: Notification): any {
    return notificationToEvent(notification);
  }

  get unreadCount(): number {
    return this.notifications.filter(notification => notification.unread).length;
  }

  get readCount(): number {
    return this.notifications.length - this.unreadCount;
  }

  setFilter(filter: 'all' | 'unread' | 'read'): void {
    this.selectedFilter = filter;
  }

  markAllRead(): void {
    const unread = this.notifications.filter(notification => notification.unread);
    unread.forEach(notification => this.markRead(notification));
    this.notifications = this.notifications.map(notification => new Notification({
      ...notification,
      unread: false,
    }));
  }

  private markRead(notification: Notification): void {
    this.san11pkService.updateNotification(new UpdateNotificationRequest({
      notification: new Notification({
        name: notification.name,
        unread: false,
      }),
      updateMask: new FieldMask({
        paths: ['unread'],
      }),
    })).subscribe();
  }
}
