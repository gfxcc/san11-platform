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
  @ViewChild('categoryNav') categoryNav;
  @ViewChild('searchInput') searchInput;

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  categories = GlobalConstants.categories;
  webModules = GlobalConstants.webModules;
  adminModules = GlobalConstants.adminModules;

  title = 'san11-platform';

  today_visit_count: number = 1;
  today_download_count: number = 2;
  selectedCategory = '1';

  user: User;
  hideUserImage = true;
  userImage: string;

  tagGroups = [];

  searchQuery: string = '';
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
  }

  ngOnInit(): void {
    this.loadTags();
  }

  ngAfterViewInit(): void {
  }

  onClickTag(tag: Tag) {
    this.router.navigate(['/categories', this.selectedCategory], { queryParams: { tagId: tag.tagId } });
  }

  removeTag(tag: Tag) {
    if (!confirm(`删除标签【${tag.name}】?`)) {
      return;
    }
    this.san11pkService.deleteTag(new DeleteTagRequest({ tagId: tag.tagId })).subscribe(
      resp => {
        this.notificationService.success('删除标签 成功');
        this.loadTags();
      },
      error => {
        this.notificationService.warn(`无法删除标签【${tag.name}】: ${error.statusMessage}`)
      }
    );
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

  searchChanged() {

    this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });

    // console.log(this.searchQuery);
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

  onUserDetail() {
    const userId = localStorage.getItem('userId');
    this.router.navigate(['users', userId]);
  }

  onSignOut() {
    this.san11pkService.signOut(localStorage.getItem('userId')).subscribe(
      () => console.log('log out')
    );

    clearUser();

    this.user = undefined;
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

  onAdminLabelClick(adminModule) {
    this.router.navigate(adminModule.link);
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
    if (!signedIn()) {
      this.notificationService.warn('上传工具需要登陆');
    } else {
      this.uploadTool();
      this.categoryNav.deselectAll();
    }
  }

  onActivate(elementRef) {
    this._eventEmiter.dataStr.subscribe((data: ComponentMessage) => {
      if (data.categoryId != undefined) {
        console.log('in');
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
