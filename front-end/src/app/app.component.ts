import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { San11PlatformServiceService } from './service/san11-platform-service.service';
import { NotificationService } from "./common/notification.service";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalConstants } from './common/global-constants'

import { UserDetailComponent, UserData } from "./account-management/user-detail/user-detail.component";
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
import { PackageDetailComponent } from './package-management/package-detail/package-detail.component';
import { EventEmiterService } from "./service/event-emiter.service";
import { getFullUrl } from './utils/resrouce_util';
import { User } from '../proto/san11-platform.pb';
import { clearUser, loadUser, signedIn } from './utils/user_util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('categoryNav') categoryNav;

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  categories = GlobalConstants.categories;

  title = 'san11-platform';

  today_visit_count: number = 1;
  today_download_count: number = 2;
  selectedCategory = '1';

  user: User;
  hideUserImage = true;
  userImage: string;

  constructor(
    private notificationService: NotificationService,
    private san11PlatformServiceService: San11PlatformServiceService,
    private dialog: MatDialog,
    private _eventEmiter: EventEmiterService,
    public router: Router) {
    this.san11PlatformServiceService.getStatistic().subscribe(
      statistic => {
        this.today_visit_count = Number(statistic.visitCount);
        this.today_download_count = Number(statistic.downloadCount);
      }
    );

    if (signedIn()) {
      this.user = loadUser();
    }
  }

  signedIn() {
    return signedIn();
  }

  username() {
    return localStorage.getItem('username');
  }
  userId() {
    return localStorage.getItem('userId');
  }

  onUserDetail() {
    const userId = localStorage.getItem('userId');
    this.router.navigate(['users', userId]);
  }

  onSignOut() {
    this.san11PlatformServiceService.signOut(localStorage.getItem('userId')).subscribe(
      () => console.log('log out')
    );

    clearUser();

    this.router.navigate(['/']);
    this.notificationService.success('已登出')
  }

  uploadTool() {
    this.router.navigate(['app-create-package']);
  }

  myTools() {

  }

  onCategoryLabelClick(category) {
    if (category.disabled) {
      this.notificationService.warn(category.text + ' 尚在开发中');
      this.categoryNav.deselectAll();
      return;
    }
    this.router.navigate(category.link);
  }

  compareWith(o1, o2) {
    console.log('compareWith o1=');
    console.log(o1);
    return false;
  }

  onSignInClick() {
    this.router.navigate(['signin']);
    this.categoryNav.deselectAll();
  }

  onSignUpClick() {
    this.router.navigate(['register']);
    this.categoryNav.deselectAll();
  }


  onClickCreateTool() {
    if (!this.signedIn()) {
      this.notificationService.warn('上传工具需要登陆');
    } else {
      this.uploadTool();
      this.categoryNav.deselectAll();
    }
  }

  onActivate(elementRef) {
    this._eventEmiter.dataStr.subscribe(data => {
      setTimeout(() => {
        this.selectedCategory = data;
      });
    });
    // if (elementRef instanceof DashboardComponent) {
    //   console.log(1);
    //   console.log(elementRef.categoryId);
    // } else if (elementRef instanceof PackageDetailComponent) {
    //   console.log(2);
    //   console.log(elementRef.package.categoryId);
    // }
  }
}
