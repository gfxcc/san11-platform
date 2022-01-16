import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoadingComponent } from 'src/app/common/components/loading/loading.component';
import { GlobalConstants } from 'src/app/common/global-constants';
import { NotificationService } from 'src/app/common/notification.service';
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

  selectedCategory: string;
  categories = GlobalConstants.categories;
  resourceGroups: ResourceGroup[] = [
    {
      name: '工具',
      resourceTypes: GlobalConstants.categories.map(category => ({ value: category.value, text: category.text, type: 'packages'}))
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

  loading;
  isCreateArticle = false;

  constructor(
    private dialog: MatDialog,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route
    .queryParams
    .subscribe((params: Params) => {
      switch(params.selected) {
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
    const resourceType:ResourceType = createForm.value.resourceType;

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
    this.loading = this.dialog.open(LoadingComponent);

    this.san11pkService.createPackage(new CreatePackageRequest({
      parent: `categories/${categoryId}`,
      package: new Package({
      packageName: packageName,
      description: '',
      authorId: '0',
      imageUrls: []
    })
    })).subscribe(
      san11Package => {
        this.loading.close();
        this.notificationService.success('创建成功')
        this.router.navigate(['categories', categoryId]);
      },
      error => {
        this.notificationService.warn('创建工具失败:' + error.statusMessage);
        this.loading.close();
      }
    );
  }

  createArticle(subject: string) {
    this.loading = this.dialog.open(LoadingComponent);
    this.san11pkService.createArticle(new CreateArticleRequest({
      parent: '',
      article: new Article({
        subject: subject,
        state: ResourceState.NORMAL,
      }),
    })).subscribe(
      (resp: Article) => {
        this.loading.close();
        this.notificationService.success('创建成功')
        this.router.navigate([resp.name]);
      },
      error => {
        this.loading.close();
        this.notificationService.warn(`创建失败: ${error.statusMessage}`);
      }
    );
  }

}
