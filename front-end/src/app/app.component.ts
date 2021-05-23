import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { San11PlatformServiceService } from './service/san11-platform-service.service';
import { NotificationService } from "./common/notification.service";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalConstants } from './common/global-constants'

import { UserDetailComponent, UserData } from "./account-management/user-detail/user-detail.component";
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
import { PackageDetailComponent } from './package-management/package-detail/package-detail.component';
import { ComponentMessage, EventEmiterService } from "./service/event-emiter.service";
import { getFullUrl } from './utils/resrouce_util';
import { CreateTagRequest, ListTagsRequest, DeleteTagRequest, Tag, User } from '../proto/san11-platform.pb';
import { clearUser, loadUser, signedIn, isAdmin } from './utils/user_util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  categories = GlobalConstants.categories;
  webModules = GlobalConstants.webModules;
  adminModules = GlobalConstants.adminModules;

  sideBarOpen = true;

  title = 'san11-platform';

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
  }

  ngOnInit(): void {
    this.loadTags();
  }

  ngAfterViewInit(): void {
  }

  sideBarToggler(event) {
    this.sideBarOpen = !this.sideBarOpen;
  }

  createTag(event) {
    const newTagName = event.target.value;
    this.san11pkService.createTag(new CreateTagRequest({
      tag: new Tag({
        categoryId: this.selectedCategory,
        name: newTagName
      })
    })).subscribe(
      tag => {
        this.loadTags();
      },
      error => {
        this.notificationService.warn(`创建标签 失败: ${error.statusMessage}`);
      }
    );
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


  username() {
    return localStorage.getItem('username');
  }
  userId() {
    return localStorage.getItem('userId');
  }
  isAdmin() {
    return isAdmin();
  }


  onActivate(elementRef) {
    this._eventEmiter.dataStr.subscribe((data: ComponentMessage) => {
      if (data.categoryId != undefined) {
        setTimeout(() => {
          if (this.selectedCategory === data.categoryId) {
            return;
          }
          this.selectedCategory = data.categoryId;
          this.loadTags();
        });
      }
    });
  }
}
