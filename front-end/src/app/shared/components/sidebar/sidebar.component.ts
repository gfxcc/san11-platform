import { ViewChild, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateTagRequest, DeleteTagRequest, ListTagsRequest, Tag } from '../../../../proto/san11-platform.pb';
import { GlobalConstants } from '../../../common/global-constants';
import { NotificationService } from '../../../common/notification.service';
import { ComponentMessage, EventEmiterService } from '../../../service/event-emiter.service';
import { San11PlatformServiceService } from '../../../service/san11-platform-service.service';
import { isAdmin, signedIn } from '../../../utils/user_util';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('categoryNav') categoryNav;

  categories = GlobalConstants.categories;
  webModules = GlobalConstants.webModules;
  adminModules = GlobalConstants.adminModules;

  selectedCategory = '1';
  tags: Tag[] = [];

  constructor(
    private notificationService: NotificationService,
    private san11pkService: San11PlatformServiceService,
    private dialog: MatDialog,
    public router: Router,
    private _eventEmiter: EventEmiterService,
  ) { }

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags() {
    this.san11pkService.listTags(new ListTagsRequest({ categoryId: this.selectedCategory })).subscribe(
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

  onClickTag(tag: Tag) {
    this.router.navigate(['/categories', this.selectedCategory], { queryParams: { tagId: tag.tagId } });
  }

  onCategoryLabelClick(category) {
    this.selectedCategory = category.value;
    this.router.navigate(category.link);
    this.loadTags();
  }

  onAdminLabelClick(adminModule) {
    this.router.navigate(adminModule.link);
  }

  onClickCreateTool() {
    if (!signedIn()) {
      this.notificationService.warn('上传工具需要登陆');
    } else {
      this.uploadTool();
      this.categoryNav.deselectAll();
    }
  }


  uploadTool() {
    this.router.navigate(['app-create-package']);
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
