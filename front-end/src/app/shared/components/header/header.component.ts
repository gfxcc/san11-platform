import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FieldMask } from '@ngx-grpc/well-known-types';
import { openInNewTab } from 'src/app/utils/url_util';
import { ListNotificationsRequest, ListNotificationsResponse, Notification, SignOutRequest, UpdateNotificationRequest, User } from '../../../../proto/san11-platform.pb';
import { NotificationService } from '../../../common/notification.service';
import { San11PlatformServiceService } from '../../../service/san11-platform-service.service';
import { clearUser, isAdmin, loadUser, signedIn } from '../../../utils/user_util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchInput') searchInput;

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  user: User;
  notifications: Notification[] = [];
  today_visit_count: number = 1;
  today_download_count: number = 2;
  menuItems = ['a', 'b', 'c'];

  searchQuery: string = '';

  constructor(
    public router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) {

  }

  ngOnInit(): void {
    if (signedIn()) {
      this.user = loadUser();
      this.loadNotifications();
    }

    // this.san11pkService.getStatistic().subscribe(
    //   statistic => {
    //     this.today_visit_count = Number(statistic.visitCount);
    //     this.today_download_count = Number(statistic.downloadCount);
    //   }
    // );
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  loadNotifications() {
    this.san11pkService.listNotifications(new ListNotificationsRequest({
      parent: `users/${this.user.userId}`,
      filter: 'unread=true',
    })).subscribe(
      (resp: ListNotificationsResponse) => {
        this.notifications = resp.notifications;
      },
      error => {

      }
    );
  }

  markReaded(notification: Notification) {
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

  openNotification(notification: Notification, index: number) {
    this.markReaded(notification)
    openInNewTab(this.router, notification.link)
    this.notifications.splice(index, 1);
  }

  onClearAll() {
    this.notifications.forEach(notification => {
      this.markReaded(notification);
    });
    this.notifications = [];
  }

  searchChanged() {
    this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
  }

  onUserDetail() {
    const userId = localStorage.getItem('userId');
    this.router.navigate(['users', userId]);
  }

  onSignOut() {
    this.san11pkService.signOut(new SignOutRequest({})).subscribe(
    );

    clearUser();

    this.user = undefined;
    this.router.navigate(['/']);
    this.notificationService.success('已登出')
  }

  onSignInClick() {
    this.router.navigate(['signin']);
  }

  onSignUpClick() {
    this.router.navigate(['register']);
  }
  // utilities wrapper
  isAdmin() {
    return isAdmin();
  }
}
