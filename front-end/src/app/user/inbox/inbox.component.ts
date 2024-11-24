import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute, DefaultUrlSerializer, Router, UrlTree } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from 'src/app/common/notification.service';
import { ProgressService } from 'src/app/progress.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { notificationToEvent } from 'src/app/utils/notification_util';
import { ListNotificationsRequest, ListNotificationsResponse } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  userId: string;
  events: any[];

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
          this.events = resp.notifications.map((notification) => {
            return notificationToEvent(notification);
          });
        },
        error: error => {
          this.notificationService.warn(`获取通知失败: ${error.statusMessage}`)
        }
      });
  }

  onDetailClick(event) {
    const urlTree: UrlTree = new DefaultUrlSerializer().parse(event.link);
    this.router.navigateByUrl(urlTree);
  }
}
