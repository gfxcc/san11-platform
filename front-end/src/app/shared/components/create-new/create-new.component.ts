import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { ProgressService } from 'src/app/progress.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { Article, CreateArticleRequest, CreatePackageRequest, Package, ResourceState } from 'src/proto/san11-platform.pb';


interface ResourceType {
  type: string;
  value: string;
  text: string;
}

interface ResourceGroup {
  disabled?: boolean;
  name: string;
  resourceTypes: ResourceType[];
};

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.css']
})
export class CreateNewComponent implements OnInit {

  selectedCategory: ResourceType;
  categories = GlobalConstants.categories;
  resourceGroups: ResourceGroup[] = [
    {
      name: '工具',
      resourceTypes: GlobalConstants.categories.map(category => ({ value: category.value, text: category.text, type: 'packages' }))
    },
    {
      name: '社区',
      resourceTypes: [
        {
          type: 'articles',
          value: 'default',
          text: '专栏文章',
        }
      ]
    }
  ];

  isCreateArticle = false;

  get selectedResourceLabel(): string {
    if (this.isCreateArticle) {
      return '专栏文章';
    }
    return this.selectedCategory?.text || '未选择类别';
  }

  get createTitle(): string {
    return this.isCreateArticle ? '创建文章' : '创建资源';
  }

  get createSubtitle(): string {
    return this.isCreateArticle
      ? '先写下标题，创建后进入正文编辑和发布检查。'
      : '先建立资源页面，再按截图、介绍、标签和版本逐步完善。';
  }

  get publishChecklist() {
    if (this.isCreateArticle) {
      return [
        { icon: 'title', text: '确认标题清楚具体', required: true },
        { icon: 'edit_note', text: '进入详情页撰写正文', required: true },
        { icon: 'visibility', text: '由作者或管理员确认公开状态', required: false },
      ];
    }

    return [
      { icon: 'image', text: '上传截图并把第一张设为封面', required: true },
      { icon: 'description', text: '填写资源介绍、玩法和使用说明', required: true },
      { icon: 'sell', text: '添加能帮助检索的标签', required: false },
      { icon: 'new_releases', text: '发布首个可下载版本', required: true },
      { icon: 'task_alt', text: '提交审核后再对普通用户展示', required: false },
    ];
  }

  constructor(
    private dialog: MatDialog,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private progressService: ProgressService,
  ) { }

  ngOnInit(): void {
    this.route
      .queryParams
      .subscribe((params: Params) => {
        switch (params.selected) {
          case '11':
            this.isCreateArticle = true;
            break;
          default:
            break;
        }
      });
  }

  onCreate(createForm) {
    const name: string = createForm.value.name;
    const resourceType: ResourceType = createForm.value.resourceType;

    if (this.isCreateArticle) {
      this.createArticle(name);
      return;
    }

    switch (resourceType.type) {
      case 'packages':
        this.createPackage(name, resourceType.value);
        break;
      case 'articles':
        this.createArticle(name);
        break;
      default:
        break;
    }
  }

  createPackage(packageName: string, categoryId: string) {
    this.progressService.loading();
    this.san11pkService.createPackage(new CreatePackageRequest({
      parent: `categories/${categoryId}`,
      package: new Package({
        packageName: packageName,
        description: '',
        authorId: '0',
        imageUrls: []
      })
    }))
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: (resp: Package) => {
          this.notificationService.success('创建成功')
          this.router.navigate([resp.name]);
        },
        error: error => {
          this.notificationService.warn(`创建失败: ${error.statusMessage}`);
        },
      });
  }

  createArticle(subject: string) {
    this.progressService.loading();
    this.san11pkService.createArticle(new CreateArticleRequest({
      parent: '',
      article: new Article({
        subject: subject,
        state: ResourceState.NORMAL,
      }),
    }))
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: (resp: Article) => {
          this.notificationService.success('创建成功');
          this.router.navigate([resp.name]);
        },
        error: error => {
          this.notificationService.warn(`创建失败: ${error.statusMessage}`);
        }
      });
  }

}
