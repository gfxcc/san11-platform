import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common/notification.service';
import { ComponentMessage, EventEmiterService } from 'src/app/service/event-emiter.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { isAdmin } from 'src/app/utils/user_util';
import { ListNotificationsRequest, ListNotificationsResponse, User } from '../../../proto/san11-platform.pb';
import { getFullUrl } from '../../utils/resrouce_util';

interface ProfileTab {
  label: string;
  link: string[];
  icon?: string;
  isInbox?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('imageInput') imageInputElement: ElementRef

  user: User;
  selectedIndex = 0;
  inboxUnreadCount = 0;
  privateTabsVisible = false;

  tabs: ProfileTab[] = [
    {
      label: '作品',
      link: ['publishedPackages'],
    },
    {
      label: '文章',
      link: ['articles'],
    },
    {
      label: '时间线',
      link: ['timeline'],
    },
  ];

  privateTabs: ProfileTab[] = [
    {
      label: '收件箱',
      link: ['inbox'],
      icon: 'lock',
      isInbox: true,
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private eventEmiter: EventEmiterService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => {
        if (data.user) {
          this.user = data.user;
          // this.selectedTabChange({ index: 0 });
          this.syncPrivateTabs();
        }
      }
    );

    this.eventEmiter.dataStr.subscribe((data: ComponentMessage) => {
      if (data.userId === this.user?.userId && data.inboxUnreadCount !== undefined) {
        this.inboxUnreadCount = data.inboxUnreadCount;
      }
    });

    const patterns = this.router.url.split('/');
    switch (patterns[patterns.length - 1]) {
      case 'publishedPackages':
        this.selectedIndex = 0;
        break;
      case 'articles':
        this.selectedIndex = 1;
        break;
      case 'timeline':
        this.selectedIndex = 2;
        break;
      case 'inbox':
        this.selectedIndex = 3;
        break;
      default:
        this.selectedIndex = 0;
    }
  }

  // getter
  get userImageUrl() {
    return getFullUrl(this.user.imageUrl);
  }
  // getter end

  selectedTabChange(event: { index: number }) {
    const link = this.tabs[event.index].link;
    this.router.navigate(link, { relativeTo: this.route, state: { user: this.user } });
  }

  private loadInboxUnreadCount(): void {
    this.san11pkService.listNotifications(new ListNotificationsRequest({
      parent: `users/${this.user.userId}`,
      pageSize: '100',
    })).subscribe({
      next: (resp: ListNotificationsResponse) => {
        this.inboxUnreadCount = resp.notifications.filter(notification => notification.unread).length;
      },
      error: error => {
        this.notificationService.warn(`获取未读通知失败: ${error.statusMessage}`);
      }
    });
  }

  private syncPrivateTabs(): void {
    const canViewPrivateTabs = this.user.userId === localStorage.getItem('userId') || isAdmin();

    if (canViewPrivateTabs && !this.privateTabsVisible) {
      this.tabs = this.tabs.concat(this.privateTabs);
      this.privateTabsVisible = true;
    }

    if (canViewPrivateTabs) {
      this.loadInboxUnreadCount();
      return;
    }

    if (!canViewPrivateTabs && this.privateTabsVisible) {
      this.tabs = this.tabs.filter(tab => !tab.isInbox);
      this.privateTabsVisible = false;
      this.inboxUnreadCount = 0;
    }
  }
}
