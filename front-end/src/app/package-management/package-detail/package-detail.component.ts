import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageItem } from 'ng-gallery';
import { finalize } from 'rxjs';
import { ProgressService } from 'src/app/progress.service';
import { EditorService } from 'src/app/service/editor.service';
import { Action, CreateImageRequest, CreateSubscriptionRequest, DeletePackageRequest, DeleteSubscriptionRequest, FieldMask, GetUserRequest, ImageType, ListActivitiesRequest, ListActivitiesResponse, ListSubscriptionsRequest, ListSubscriptionsResponse, ListTagsRequest, Package, ResourceState, Subscription, Tag, UpdatePackageRequest, User } from "../../../proto/san11-platform.pb";
import { GlobalConstants } from '../../common/global-constants';
import { NotificationService } from "../../common/notification.service";
import { EventEmiterService } from "../../service/event-emiter.service";
import { San11PlatformServiceService } from "../../service/san11-platform-service.service";
import { UploadService } from '../../service/upload.service';
import { increment } from '../../utils/number_util';
import { getCategoryId, getPackageUrl } from "../../utils/package_util";
import { getFullUrl, parseName } from "../../utils/resrouce_util";
import { getUserUri, isAdmin, loadUser, signedIn } from "../../utils/user_util";


export interface DialogData {
  package: Package
}
@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.css']
})
export class PackageDetailComponent implements OnInit {
  @ViewChild('packageNameTitle') packageNameElement: ElementRef
  @ViewChild('imageInput') imageInputElement: ElementRef
  @ViewChild('gallery') galleryElementCatched: ElementRef
  @ViewChild('description') descriptionElement: ElementRef;

  images: ImageItem[] = [];
  packageId: string;
  package: Package;
  author: User = new User({});

  packageNameUpdated = false;

  galleryElement;

  // zones
  adminZone = false;
  authorZone = false;

  descEditor_updated = false;
  descEditor_onFocus = false;

  allTags: Tag[];
  tagCanEdit: boolean;

  // NEW UI
  descFolded = true;
  liked = false;
  disliked = false;

  // The subscription of the current user to the package
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private _eventEmiter: EventEmiterService,
    private cd: ChangeDetectorRef,
    private uploadService: UploadService,
    public editorService: EditorService,
    private progressService: ProgressService,
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => {
        this.package = data.package;
        // Disable the logic which is used to set sidebar when directly load a packge-details from a link.
        // this._eventEmiter.sendMessage({ categoryId: getCategoryId(this.package.name).toString() });
      }
    );

    this.loadPage();
    this.loadTags();
    this.configDescEditor();

    this.tagCanEdit = this.isAuthor() || this.isAdmin();
    this.loadCollected();
  }

  @HostListener('document:keydown.meta.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (!this.descEditor_onFocus || !this.descEditor_updated) {
      return;
    }
    // check if cmd+enter is pressed
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      // trigger button click event
      this.onUpdateDesc();
    }
  }


  get collectButtonText(): string {
    if (this.isCollected) {
      return '取消收藏';
    } else {
      return '收藏';
    }
  }

  get isCollected(): boolean {
    return this.subscription != undefined;
  }

  loadCollected() {
    this.san11pkService.listSubscription(new ListSubscriptionsRequest({
      parent: getUserUri(loadUser()),
      filter: `target="${this.package.name}"`,
    })).subscribe(
      (resp: ListSubscriptionsResponse) => {
        this.subscription = resp.subscriptions[0];
      },
      error => {
        this.notificationService.warn(`载入收藏失败: ${error.statusMessage}`);
      }
    );
  }

  ngAfterViewInit(): void {
    if (this.isAuthor()) {
      this.packageNameElement.nativeElement.contentEditable = true;
    }
  }

  configDescEditor() {
    this.editorService.configEditor(!this.isAuthor(), this.package.name);
  }

  onDescEditorChange(event) {
    this.descEditor_updated = true;
  }

  onUpdateTitle() {
    const updatedPackageName = this.packageNameElement.nativeElement.innerHTML;
    const request = new UpdatePackageRequest({
      package: new Package({
        name: this.package.name,
        packageName: updatedPackageName
      }),
      updateMask: new FieldMask({
        paths: ['package_name']
      })
    });
    this.san11pkService.updatePackage(request).subscribe(
      san11Package => {
        this.package.packageName = updatedPackageName;
        this.packageNameUpdated = false;
        this.notificationService.success("更新成功");
      },
      error => {
        this.notificationService.warn("更新失败: " + error.statusMessage);
      }
    );
  }

  onUpdateDesc() {
    const newDesc = this.editorService.getData();

    if (newDesc != undefined) {
      const request = new UpdatePackageRequest({
        package: new Package({
          name: this.package.name,
          description: newDesc
        }),
        updateMask: new FieldMask({
          paths: ['description']
        })
      });
      this.san11pkService.updatePackage(request).subscribe({
        next: (san11Package: Package) => {
          this.package.description = san11Package.description;
        },
        error: error => {
          this.notificationService.warn(`更新失败: ${error.statusMessage}`);
        },
        complete: () => {
          this.descEditor_updated = false;
          this.notificationService.success('更新成功');
        }
      });
    }
  }


  newTagSelected(newTag: Tag) {
    for (const tag of this.package.tags) {
      if (tag.name === newTag.name) {
        return;
      }
    }
    let updateTags = this.package.tags;
    updateTags.push(newTag);

    const request = new UpdatePackageRequest({
      package: new Package({
        name: this.package.name,
        tags: updateTags
      }),
      updateMask: new FieldMask({
        paths: ['tags']
      })
    });
    this.san11pkService.updatePackage(request).subscribe(
      resp => {
        this.package.tags = resp.tags;
        this.notificationService.success('添加标签成功');
      },
      error => {
        this.notificationService.warn("添加标签失败: " + error.statusMessage);
      }
    );
  }

  removeTag(tagToRemove: Tag) {
    let updateTags = this.package.tags.filter((tag: Tag) => tag.name != tagToRemove.name);

    const request = new UpdatePackageRequest({
      package: new Package({
        name: this.package.name,
        tags: updateTags
      }),
      updateMask: new FieldMask({
        paths: ['tags']
      })
    });
    this.san11pkService.updatePackage(request).subscribe(
      resp => {
        this.package.tags = resp.tags;
        this.notificationService.success('删除标签成功');
      },
      error => {
        this.notificationService.warn("删除标签失败: " + error.statusMessage);
      }
    );
  }

  loadTags() {
    const [parent, collection, packageId] = parseName(this.package.name)
    this.san11pkService.listTags(new ListTagsRequest({ parent: parent })).subscribe(
      resp => {
        this.allTags = resp.tags;
      },
      error => {
        this.notificationService.warn('加载便签失败:' + error.statusMessage);
      }
    );
  }

  loadPage() {
    if (this.isAdmin() && this.package.state === ResourceState.UNDER_REVIEW) {
      this.adminZone = true;
    }
    if (this.isAdmin() || this.isAuthor()) {
      this.authorZone = true;
    }

    this.package.imageUrls.forEach(imageUrl => {
      const fullImageUrl = getFullUrl(imageUrl);
      this.images.push(new ImageItem({ src: fullImageUrl, thumb: fullImageUrl }));
    });

    if (getCategoryId(this.package.name) === 1) {
      // append a pre-set image for SIRE package
      const fullImageUrl = getFullUrl('static/images/sire2.jpg');
      this.images.push(new ImageItem({ src: fullImageUrl, thumb: fullImageUrl }));
    }
    // append image for upload 
    if (this.isAuthor() || this.isAdmin()) {
      this.images.push(new ImageItem({ src: '../../../assets/images/upload.jpg', thumb: '../../../assets/images/upload.jpg' }));
    }

    this.loadAuthor();

    this.setLikeAndDislikeStatus();
  }

  setLikeAndDislikeStatus() {
    this.san11pkService.listActivities(new ListActivitiesRequest({
      parent: `users/${loadUser().userId}`,
      filter: `resource_name="${this.package.name}"`,
    })).subscribe(
      (resp: ListActivitiesResponse) => {
        resp.activities.forEach(activity => {
          if (activity.action === Action.LIKE) {
            this.liked = true;
          } else if (activity.action === Action.DISLIKE) {
            this.disliked = true;
          }
        });
      },
      error => {

      }
    );
  }

  // admin
  onApprove() {

    const request = new UpdatePackageRequest({
      package: new Package({
        name: this.package.name,
        state: ResourceState.NORMAL,
      }),
      updateMask: new FieldMask({
        paths: ['state']
      })
    });
    this.san11pkService.updatePackage(request).subscribe(
      san11Package => {
        this.notificationService.success('审核通过')

        this.router.navigate(this.package.name.split('/')).then(() => {
          window.location.reload();
        });
      },
      error => {
        this.notificationService.warn('操作失败');
      }
    );
  }


  onFlipHide() {
    if (confirm('确认要' + (this.package.state === ResourceState.HIDDEN ? '显示' : '隐藏') + ' ' + this.package.packageName + ' 吗？') === false) {
      return;
    }
    const request = new UpdatePackageRequest({
      package: new Package({
        name: this.package.name,
        state: this.package.state === ResourceState.HIDDEN ? ResourceState.NORMAL : ResourceState.HIDDEN
      }),
      updateMask: new FieldMask({
        paths: ['state']
      })
    });
    this.san11pkService.updatePackage(request).subscribe(
      (resp: Package) => {
        this.notificationService.success('操作成功')
        this.router.navigate(this.package.name.split('/')).then(() => {
          window.location.reload();
        });
      },
      error => {
        this.notificationService.warn('操作失败');
      }
    );
  }

  // author
  onDelete() {
    if (confirm('确认要删除 ' + this.package.packageName + ' 吗？')) {
      if (this.isAdmin()) {
        this.san11pkService.deletePackage(new DeletePackageRequest({
          name: this.package.name,
        })).subscribe(
          (resp: Package) => {
            this.notificationService.success('成功删除');

            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
          },
          error => {
            this.notificationService.warn('删除失败:' + error.statusMessage);
          }
        );
      } else {
        const request = new UpdatePackageRequest({
          package: new Package({
            name: this.package.name,
            state: ResourceState.SCHEDULED_DELETE,
          }),
          updateMask: new FieldMask({
            paths: ['state']
          })
        });
        this.san11pkService.updatePackage(request).subscribe(
          san11Package => {
            this.notificationService.success('成功删除');

            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
          },
          error => {
            this.notificationService.warn('删除失败: ' + error.statusMessage);
          }
        );

      }
    }
  }

  onGalleryItemClick(imageIndex: number) {
    this.galleryElement = this.galleryElementCatched;
    if (!(this.isAdmin() || this.isAuthor())) {
      return;
    }

    if (imageIndex === this.images.length - 1) {
      // upload new image
      this.imageInputElement.nativeElement.click();

    } else {
      // ask for delete
      if (confirm("确定要删除这张截图吗?")) {
        if (getCategoryId(this.package.name) === 1 && imageIndex === this.images.length - 2) {
          this.notificationService.warn('不可删除系统预设图片');
          return;
        }
        this.package.imageUrls.splice(imageIndex, 1);

        const request = new UpdatePackageRequest({
          package: new Package({
            name: this.package.name,
            imageUrls: this.package.imageUrls
          }),
          updateMask: new FieldMask({
            paths: ['image_urls']
          })
        });
        this.san11pkService.updatePackage(request).subscribe(
          san11Package => {
            this.images.splice(imageIndex, 1);
            this.notificationService.success("删除成功");
            this.galleryElement.load(this.images);
          },
          error => {
            this.notificationService.warn("删除截图失败:" + error.statusMessage);
          }
        );
      }
    }
  }


  onUploadScreenshot(imageInput) {
    const image = imageInput.files[0];
    if (image.size > GlobalConstants.maxImageSize) {
      alert('上传图片必须小于: ' + (GlobalConstants.maxImageSize / 1024 / 1024).toString() + 'MB');
      return;
    }

    const parent = getPackageUrl(this.package);
    const filename = `${parent}/images/tmp.jpeg`

    this.progressService.loading();
    this.uploadService.upload(image, GlobalConstants.tmpBucket, filename).subscribe((upload) => {
      if (upload.state === 'DONE') {
        this.san11pkService.createImage(new CreateImageRequest({
          parent: parent,
          url: filename,
          imageType: ImageType.SCREENSHOT,
        }))
          .pipe(finalize(() => this.progressService.complete()))
          .subscribe({
            next: (url) => {
              this.package.imageUrls.push(url.url);
              const fullUrl = getFullUrl(url.url);
              if (getCategoryId(this.package.name) === 1) {
                this.images.splice(this.images.length - 2, 0, new ImageItem({ src: fullUrl, thumb: fullUrl }));
              } else {
                this.images.splice(this.images.length - 1, 0, new ImageItem({ src: fullUrl, thumb: fullUrl }));
              }

              this.galleryElement.load(this.images);

              this.notificationService.success('图片上传成功');
            },
            error: (error) => {
              this.notificationService.warn('上传截图失败: ' + error.statusMessage);
            },
          })
      }
    });
  }

  onBack() {
    this.router.navigate(['categories', getCategoryId(this.package.name).toString()]);
  }


  // childs
  onChildDownload(msg) {
    this.package.downloadCount = increment(this.package.downloadCount);
  }

  // NEW UI
  onAuthorNameClick() {
    this.router.navigate(['users', this.package.authorId]);
  }

  onToggleLike() {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      return;
    }
    if (this.liked) {
      this.liked = false;
    } else {
      this.liked = true;
      if (this.disliked) {
        this.disliked = false;
      }
    }
    this.toggleAction('like_count');
  }

  onToggleDislike() {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      return;
    }
    if (this.disliked) {
      this.disliked = false;
    } else {
      this.disliked = true;
      if (this.liked) {
        this.liked = false;
      }
    }
    this.toggleAction('dislike_count');
  }

  onToggleCollect() {
    if (this.isCollected) {
      this.san11pkService.deleteSubscription(new DeleteSubscriptionRequest({
        name: this.subscription.name,
      })).subscribe(
        (resp: Subscription) => {
          this.subscription = undefined;
          this.notificationService.success(`已取消收藏`);
        }, error => {
          this.notificationService.warn(`取消收藏失败: ${error.statusMessage}`);
        }
      );
    } else {
      this.san11pkService.createSubscription(new CreateSubscriptionRequest({
        parent: getUserUri(loadUser()),
        subscription: new Subscription({
          target: this.package.name,
        }),
      })).subscribe(
        (resp: Subscription) => {
          this.subscription = resp;
          this.notificationService.success(`收藏成功`);
        }, error => {
          this.notificationService.warn(`收藏失败: ${error.statusMessage}`);
        }
      );
    }
  }

  onReport() {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      return;
    }
  }

  loadAuthor() {
    this.san11pkService.getUser(new GetUserRequest({
      name: `users/${this.package.authorId}`,
    })).subscribe({
      next: user => {
        this.author = user;
      },
      error: error => {
        this.notificationService.warn('无法获取作者信息:' + error.statusMessage);
      }
    });
  }

  onDescription() {
    this.descFolded = false;
  }


  // utils
  toggleAction(field: string) {
    this.san11pkService.updatePackage(new UpdatePackageRequest({
      package: new Package({
        name: this.package.name,
      }),
      updateMask: new FieldMask({
        paths: [field],
      })
    })).subscribe({
      next: (pkg: Package) => {
        this.package = pkg;
      },
      error: error => {
        this.notificationService.warn(`操作失败: ${error.statusMessage}`);
      }
    });
  }

  isAdmin() {
    return isAdmin();
  }

  isAuthor() {
    return this.package.authorId === localStorage.getItem('userId');
  }

  getPackageUrl() {
    return getPackageUrl(this.package);
  }
}
