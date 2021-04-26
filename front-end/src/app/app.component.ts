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
import { ListTagsRequest, Tag, User } from '../proto/san11-platform.pb';
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
  webModules = GlobalConstants.webModules;

  title = 'san11-platform';

  today_visit_count: number = 1;
  today_download_count: number = 2;
  selectedCategory = '1';

  user: User;
  hideUserImage = true;
  userImage: string;

  tagGroups = [];
  // tagGroups = [{
  //   groupName: 'SIRE 版本',
  //   tags: ['SIRE 2', 'SIRE 1']
  // }, {
  //   groupName: '类型',
  //   tags: ['通用', '战法', '特技', '计略', '部队', '战略', '地形', 'AI']
  // }];

  constructor(
    private notificationService: NotificationService,
    private san11pkService: San11PlatformServiceService,
    private dialog: MatDialog,
    private _eventEmiter: EventEmiterService,
    public router: Router) {
    this.san11pkService.getStatistic().subscribe(
      statistic => {
        this.today_visit_count = Number(statistic.visitCount);
        this.today_download_count = Number(statistic.downloadCount);
      }
    );

    if (signedIn()) {
      this.user = loadUser();
    }

    // if (this.selectedCategory === '1') {
    //   this.tagGroups = [{
    //     groupName: 'SIRE 版本',
    //     tags: [new Tag({
    //       tagId: '1',
    //       name: 'SIRE 1',
    //       categoryId: '1',
    //       mutable: false
    //     }), new Tag({
    //       tagId: '2',
    //       name: 'SIRE 2',
    //       categoryId: '1',
    //       mutable: false
    //     })]
    //   }];
    // }
  }

  ngOnInit(): void {
    this.loadTags();
  }

  onClickTag(tag: Tag) {
    this.router.navigate(['/categories', this.selectedCategory], { queryParams: { tagId: tag.tagId } });
  }

  loadTags() {
    this.san11pkService.listTags(new ListTagsRequest({ categoryId: this.selectedCategory })).subscribe(
      resp => {
        if (resp.tags.length === 0) {
          this.tagGroups = [];
        } else {
          this.tagGroups = [{
            groupName: '类型',
            tags: resp.tags
          }];
        }
      },
      error => {
        this.notificationService.warn('无法获取 标签:' + error.statusMessage);
      }
    );
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
    this.san11pkService.signOut(localStorage.getItem('userId')).subscribe(
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
    this.router.navigate(category.link);
    this.loadTags();
  }

  compareWith(o1, o2) {
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
        this.loadTags();
      });
    });
  }
}
