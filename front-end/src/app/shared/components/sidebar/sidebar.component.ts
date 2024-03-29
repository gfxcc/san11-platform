import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { onMobile } from 'src/app/utils/layout_util';
import { CreateTagRequest, CreateThreadRequest, DeleteTagRequest, ListTagsRequest, Tag, Thread } from '../../../../proto/san11-platform.pb';
import { GlobalConstants } from '../../../common/global-constants';
import { NotificationService } from '../../../common/notification.service';
import { ComponentMessage, EventEmiterService } from '../../../service/event-emiter.service';
import { San11PlatformServiceService } from '../../../service/san11-platform-service.service';
import { isAdmin, loadUser, signedIn } from '../../../utils/user_util';
import { TextInputDialogComponent } from '../text-input-dialog/text-input-dialog.component';
import { SidenavService } from './sidenav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('categoryNav') categoryNav;

  categories = GlobalConstants.categories;

  personalModules = [
    // { value: '21', text: '主页', link: ['/home'], icon: 'home' },
    // { value: '22', text: '订阅', link: ['/subscriptions'], icon: 'subscriptions' },
    { value: '23', text: '收藏', link: ['/collections'], icon: 'collections_bookmark' },
    { value: '24', text: '我的足迹', link: ['/history'], icon: 'history' },
  ]

  webModules = [
    { value: '11', text: '讨论区', link: ['/discussion'], icon: 'forum' },
    { value: '12', text: '专栏文章', link: ['/articles'], icon: 'sticky_note_2' },
    { value: '13', text: '留言板', link: ['/message-board'], icon: 'note_alt' },
  ]

  adminModules = [
    {
      value: '1', text: '管理员', link: ['/admin-message-board'], icon: 'admin_panel_settings',
    }
  ]

  selectedCategory = undefined;
  tags: Tag[] = [];

  constructor(
    private notificationService: NotificationService,
    private san11pkService: San11PlatformServiceService,
    private dialog: MatDialog,
    private router: Router,
    private _eventEmiter: EventEmiterService,
    private sidenavService: SidenavService,
  ) {
    const userId = loadUser().userId;
  }

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags() {
    this.san11pkService.listTags(new ListTagsRequest({ parent: `categories/${this.selectedCategory}` })).subscribe(
      resp => {
        if (resp.tags.length === 0) {
          this.tags = [];
        } else {
          this.tags = resp.tags;
        }
      },
      error => {
        this.notificationService.warn('无法获取 标签:' + error.statusMessage);
      }
    );
  }

  createTag(event) {
    const newTagName = event.target.value;
    this.san11pkService.createTag(new CreateTagRequest({
      parent: `categories/${this.selectedCategory}`,
      tag: new Tag({
        tagName: newTagName
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

  removeTag(tag: Tag) {
    if (!confirm(`删除标签【${tag.name}】?`)) {
      return;
    }
    this.san11pkService.deleteTag(new DeleteTagRequest({ name: tag.name })).subscribe(
      resp => {
        this.notificationService.success('删除标签 成功');
        this.loadTags();
      },
      error => {
        this.notificationService.warn(`无法删除标签【${tag.name}】: ${error.statusMessage}`)
      }
    );
  }

  onClickTag(tag: Tag) {
    this.router.navigate(['/categories', this.selectedCategory], { queryParams: { tagId: tag.name } });
  }

  onClickSidenav(item) {
    this.tags = [];
    if (onMobile()) {
      this.sidenavService.close();
    }
    this.router.navigate(item.link);
  }

  onCategoryLabelClick(category) {
    this.selectedCategory = category.value;

    if (onMobile()) {
      this.sidenavService.close();
    }
    this.router.navigate(category.link);
    this.loadTags();
  }

  onClickCreateTool() {
    if (!signedIn()) {
      this.notificationService.warn('上传工具需要登陆');
    } else {
      this.navigateToCreate();
      this.categoryNav.deselectAll();
    }
  }

  navigateToCreate() {
    const parent = this.router.url.substr(1);
    const patterns = parent.split('/');
    console.log(patterns);
    switch (patterns[0]) {
      case 'discussion':
        this.triggerCreateThreadWorkflow(parent);
        // this.router.navigate(['discussion', 'create'], { queryParams: { parent: parent } });
        break;
      case 'articles':
        this.router.navigate(['createNew'], { queryParams: { selected: '11' } });
        break;
      default:
        this.router.navigate(['createNew'], { queryParams: { selected: patterns[patterns.length - 1] } });
    }
  }

  triggerCreateThreadWorkflow(parent: string) {
    this.dialog.open(TextInputDialogComponent, {
      data: {
        title: '新帖子',
        inputTitle: '标题',
        preSetText: ''
      }
    }).afterClosed().subscribe(
      data => {
        if (data) {
          const subject = data.data;
          this.createThread(parent, subject);
        }
      }
    );
  }

  createThread(parent: string, subject: string) {
    this.san11pkService.createThread(new CreateThreadRequest({
      parent: parent,
      thread: new Thread({
        subject: subject,
      })
    })).subscribe(
      (resp: Thread) => {
        this.router.navigate([resp.name])
      },
      error => {
        this.notificationService.warn(`创建失败: ${error.statusMessage}.`)
      }
    );
  }

  // To receive global messages
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

  // utilities wrapper
  isAdmin() {
    return isAdmin()
  }
}
