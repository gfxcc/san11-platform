import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FieldMask } from '@ngx-grpc/well-known-types';
import { ProgressService } from 'src/app/progress.service';
import { GlobalConstants } from 'src/app/common/global-constants';
import { openInNewTab } from 'src/app/utils/url_util';
import { ListNotificationsRequest, ListNotificationsResponse, Notification, Package, SignOutRequest, UpdateNotificationRequest, User } from '../../../../proto/san11-platform.pb';
import { NotificationService } from '../../../common/notification.service';
import { ComponentMessage, EventEmiterService } from '../../../service/event-emiter.service';
import { San11PlatformServiceService } from '../../../service/san11-platform-service.service';
import { clearUser, isAdmin, loadUser, signedIn } from '../../../utils/user_util';
import { SidenavService } from '../sidebar/sidenav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchInput') searchInput;
  @ViewChild('searchBar') searchBar: ElementRef<HTMLElement>;

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  user: User;
  notifications: Notification[] = [];
  unreadCount = 0;
  today_visit_count: number = 1;
  today_download_count: number = 2;
  menuItems = ['a', 'b', 'c'];

  searchQuery: string = '';
  private searchTimer: ReturnType<typeof setTimeout> | undefined;
  searchSuggestions: Package[] = [];
  searching = false;
  searchPanelOpen = false;
  quickSearchCategories = GlobalConstants.categories.slice(0, 4);

  constructor(
    public router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private sidenav: SidenavService,
    public progressService: ProgressService,
    private eventEmiter: EventEmiterService,
  ) {
  }

  ngOnInit(): void {
    if (signedIn()) {
      this.user = loadUser();
      console.log(this.user);
      this.subscribeToGlobalMessages();
      this.loadNotifications();
    }
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
        this.unreadCount = this.notifications.length;
        this.emitUnreadCount();
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

  onClickIcon() {
    this.sidenav.open();
    this.router.navigate(['/']);
  }

  openNotification(notification: Notification, index: number) {
    this.markReaded(notification)
    openInNewTab(this.router, notification.link)
    this.notifications.splice(index, 1);
    this.unreadCount = this.notifications.length;
    this.emitUnreadCount();
  }

  onClearAll() {
    this.notifications.forEach(notification => {
      this.markReaded(notification);
    });
    this.notifications = [];
    this.unreadCount = 0;
    this.emitUnreadCount();
  }

  openInbox(): void {
    if (!this.user) return;
    this.router.navigate(['users', this.user.userId, 'inbox']);
  }

  private emitUnreadCount(): void {
    if (!this.user) return;

    this.eventEmiter.sendMessage({
      userId: this.user.userId,
      inboxUnreadCount: this.unreadCount,
    });
  }

  private subscribeToGlobalMessages(): void {
    this.eventEmiter.dataStr.subscribe((data: ComponentMessage) => {
      if (data.userId !== this.user?.userId || data.inboxUnreadCount === undefined) {
        return;
      }

      this.unreadCount = data.inboxUnreadCount;

      if (data.inboxUnreadCount !== this.notifications.length) {
        setTimeout(() => this.loadNotifications(), 300);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.searchPanelOpen) {
      return;
    }

    const target = event.target as Node | null;
    if (target && this.searchBar?.nativeElement.contains(target)) {
      return;
    }

    this.closeSearchPanel(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.searchPanelOpen) {
      return;
    }

    this.closeSearchPanel();
  }

  searchChanged() {
    this.searchPanelOpen = true;
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const query = this.searchQuery.trim();
      if (query.length >= 2) {
        this.searching = true;
        this.san11pkService.searchPackages(query, 5, '').subscribe({
          next: response => this.searchSuggestions = response.packages,
          error: () => this.searchSuggestions = [],
          complete: () => this.searching = false,
        });
      } else {
        this.searchSuggestions = [];
        this.searching = false;
      }
    }, 350);
  }

  openSearchPanel(): void {
    this.searchPanelOpen = true;
  }

  closeSearchPanel(blurInput = true): void {
    this.searchPanelOpen = false;
    if (blurInput) {
      this.searchInput?.nativeElement?.blur();
    }
  }

  submitSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) return;
    this.searchSuggestions = [];
    this.searching = false;
    this.closeSearchPanel();
    this.router.navigate(['/search'], { queryParams: { query } });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchSuggestions = [];
    this.searching = false;
    this.closeSearchPanel();
  }

  openSearchSuggestion(san11Package: Package): void {
    this.searchSuggestions = [];
    this.searchQuery = '';
    this.closeSearchPanel();
    this.router.navigate(san11Package.name.split('/'));
  }

  openCategory(categoryId: string): void {
    this.clearSearch();
    this.router.navigate(['/categories', categoryId]);
  }

  onUserDetail() {
    const userId = localStorage.getItem('userId');
    this.router.navigate(['users', userId]);
  }

  onSettings() {
    this.sidenav.close();
    this.router.navigate(['settings']);
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
