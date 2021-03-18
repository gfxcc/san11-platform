import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { San11PlatformServiceService } from './service/san11-platform-service.service';
import { NotificationService } from "./common/notification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'san11-platform';

  today_visit_count: number = 1;
  today_download_count: number = 2;

  constructor(
    private notificationService: NotificationService,
    private san11PlatformServiceService: San11PlatformServiceService,
    private router: Router) {
      this.san11PlatformServiceService.getStatistic().subscribe(
        statistic => {
          this.today_visit_count = Number(statistic.visitCount);
          this.today_download_count = Number(statistic.downloadCount);
        }
      );
  }


  signedIn() {
    return localStorage.getItem('sid');
  }
  username() {
    return localStorage.getItem('username');
  }
  userId() {
    return localStorage.getItem('userId');
  }

  onSignOut() {
    console.log(localStorage.getItem('userId'));
    this.san11PlatformServiceService.signOut(localStorage.getItem('userId')).subscribe(
      () => console.log('log out')
    );

    localStorage.removeItem('sid');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');

    this.router.navigate(['/']);

    this.notificationService.success('已登出')
  }

  uploadTool() {
    this.router.navigate(['app-create-package']);
  }

  myTools() {

  }

  modDashboardOnClick() {
    this.notificationService.warn('MOD专区尚在开发中');
  }
}
