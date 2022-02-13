import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageItem } from 'ng-gallery';
import { Action, CreateImageRequest, DeletePackageRequest, FieldMask, GetUserRequest, ListActivitiesRequest, ListActivitiesResponse, ListTagsRequest, Package, ResourceState, Tag, UpdatePackageRequest, User } from "../../../proto/san11-platform.pb";
import * as Editor from "../../common/components/ckeditor/ckeditor";
import { LoadingComponent } from '../../common/components/loading/loading.component';
import { GlobalConstants } from '../../common/global-constants';
import { NotificationService } from "../../common/notification.service";
import { MyUploadAdapter } from '../../service/cke-upload-adapter';
import { EventEmiterService } from "../../service/event-emiter.service";
import { San11PlatformServiceService } from "../../service/san11-platform-service.service";
import { UploadService } from '../../service/upload.service';
import { increment } from '../../utils/number_util';
import { getCategoryId, getPackageUrl } from "../../utils/package_util";
import { getFullUrl, parseName } from "../../utils/resrouce_util";
import { getUserUrl, isAdmin, loadUser, signedIn } from "../../utils/user_util";


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
  loading;

  galleryElement;

  // zones
  adminZone = false;
  authorZone = false;

  descEditor = Editor;
  descEditor_element;
  descEditor_disabled = true;
  descEditor_updated = false;
  descEditor_data: string;
  descEditor_config;

  userFeeds;
  allTags: Tag[];
  tagCanEdit: boolean;

  // NEW UI
  descFolded = true;
  liked = false;
  disliked = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private _eventEmiter: EventEmiterService,
    private cd: ChangeDetectorRef,
    private uploadService: UploadService,
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

    if (this.isAuthor()) {
      this.preloadUserFeeds();
    }

    this.tagCanEdit = this.isAuthor() || this.isAdmin();
  }

  ngAfterViewInit(): void {
    if (this.isAuthor()) {
      this.packageNameElement.nativeElement.contentEditable = true;
    }
  }

  configDescEditor() {
    this.descEditor_data = this.package.description;
    this.descEditor_disabled = !this.isAuthor();
    this.descEditor_config = {
      placeholder: '请添加描述...',
      toolbar: {
        items: [
          'heading',
          '|',
          'fontColor',
          'bold',
          'italic',
          'underline',
          'blockQuote',
          'code',
          'link',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
          'horizontalLine',
          '|',
          'outdent',
          'indent',
          'alignment',
          '|',
          'imageUpload', // comment out this function as current implement will cause performance issue 
          'codeBlock',
          'insertTable',
          'undo',
          'redo'
        ]
      },
      language: 'zh-cn',
      image: {
        toolbar: [
          'imageStyle:full',
          'imageStyle:side',
        ]
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableCellProperties',
          'tableProperties'
        ]
      },
      mention: {
        feeds: [
          {
            marker: '@',
            feed: this.getUsernameFeedItems.bind(this),
            minimumCharacters: 1,
          }
        ]
      },
      licenseKey: '',
    };
  }

  preloadUserFeeds() {
    this.san11pkService.listUsers().subscribe(
      resp => {
        this.userFeeds = resp.users.map((user: User) => ({
          id: `@${user.username}`,
          userId: user.userId,
          username: user.username,
          link: getUserUrl(user),
          userAvatar: getFullUrl(user.imageUrl)
        }));
      },
      error => {
        console.log('Failed to load user feeds');
      }
    );
  }

  getUsernameFeedItems(queryText: string) {
    return new Promise(resolve => {
      setTimeout(() => {
        const itemsToDisplay = this.userFeeds
          // Filter out the full list of all items to only those matching the query text.
          .filter(isItemMatching)
          // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
          .slice(0, 10);

        resolve(itemsToDisplay);
      }, 100);
    });

    function isItemMatching(item) {
      // Make the search case-insensitive.
      const searchString = queryText.toLowerCase();

      // Include an item in the search results if the name or username includes the current user input.
      return (
        item.username.toLowerCase().includes(searchString) ||
        item.userId.toLowerCase().includes(searchString)
      );
    }
  }

  MentionCustomization(editor) {
    // The upcast converter will convert view <a class="mention" href="" data-user-id="">
    // elements to the model 'mention' text attribute.
    editor.conversion.for('upcast').elementToAttribute({
      view: {
        name: 'a',
        key: 'data-mention',
        classes: 'mention',
        attributes: {
          href: true,
          'data-user-id': true
        }
      },
      model: {
        key: 'mention',
        value: viewItem => {
          // The mention feature expects that the mention attribute value
          // in the model is a plain object with a set of additional attributes.
          // In order to create a proper object use the toMentionAttribute() helper method:
          const mentionAttribute = editor.plugins.get('Mention').toMentionAttribute(viewItem, {
            // Add any other properties that you need.
            link: viewItem.getAttribute('href'),
            userId: viewItem.getAttribute('data-user-id')
          });

          return mentionAttribute;
        }
      },
      converterPriority: 'high'
    });

    // Downcast the model 'mention' text attribute to a view <a> element.
    editor.conversion.for('downcast').attributeToElement({
      model: 'mention',
      view: (modelAttributeValue, { writer }) => {
        // Do not convert empty attributes (lack of value means no mention).
        if (!modelAttributeValue) {
          return;
        }

        return writer.createAttributeElement('a', {
          class: 'mention',
          'data-mention': modelAttributeValue.id,
          'data-user-id': modelAttributeValue.userId,
          'href': modelAttributeValue.link
        }, {
          // Make mention attribute to be wrapped by other attribute elements.
          priority: 20,
          // Prevent merging mentions together.
          id: modelAttributeValue.uid
        });
      },
      converterPriority: 'high'
    });
  }

  //
  // Editor-END
  //

  onUpdateTitle() {
    const updatedPackageName = this.packageNameElement.nativeElement.innerHTML;
    const newPackage = new Package({
    });
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
    const newDesc = this.descEditor_element.getData();

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
      this.san11pkService.updatePackage(request).subscribe(
        san11Package => {
          this.package.description = san11Package.description;
          this.descEditor_updated = false;
          this.notificationService.success('更新成功');
        },
        error => {
          this.notificationService.warn(`更新失败: ${error.statusMessage}`);
        }
      );
    }
  }

  onDescEditorReady(event) {
    this.descEditor_element = event;
    event.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, this.san11pkService, this.uploadService, getPackageUrl(this.package));
    };
  }

  onDescEditorChange(event) {
    this.descEditor_updated = true;
  }

  newTagSelected(newTag: Tag) {
    for (const tag of this.package.tags) {
      if (tag.name === newTag.name) {
        return;
      }
    }
    let updateTags = this.package.tags;
    updateTags.push(newTag);

    console.log(updateTags);

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
      const fullImageUrl = getFullUrl('images/sire2.jpg');
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
      san11Package => {
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
          status => {
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

    this.loading = this.dialog.open(LoadingComponent);

    const parent = getPackageUrl(this.package);
    const filename = `${parent}/images/tmp.jpeg`
    this.uploadService.upload(image, GlobalConstants.tmpBucket, filename).subscribe((upload) => {
      if (upload.state === 'DONE') {
        this.san11pkService.createImage(new CreateImageRequest({
          parent: parent,
          url: filename
        })).subscribe(
          url => {
            this.package.imageUrls.push(url.url);
            const fullUrl = getFullUrl(url.url);
            if (getCategoryId(this.package.name) === 1) {
              this.images.splice(this.images.length - 2, 0, new ImageItem({ src: fullUrl, thumb: fullUrl }));
            } else {
              this.images.splice(this.images.length - 1, 0, new ImageItem({ src: fullUrl, thumb: fullUrl }));
            }

            this.galleryElement.load(this.images);

            this.notificationService.success('图片上传成功');
            this.loading.close();
          },
          error => {
            this.loading.close();
            this.notificationService.warn('上传截图失败: ' + error.statusMessage);
          }
        );

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

  onReport() {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      return;
    }


  }

  loadAuthor() {
    this.san11pkService.getUser(new GetUserRequest({
      name: `users/${this.package.authorId}`,
    })).subscribe(
      user => {
        this.author = user;
      },
      error => {
        this.notificationService.warn('无法获取作者信息:' + error.statusMessage);
      }
    );
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
    })).subscribe(
      (pkg: Package) => {
        this.package = pkg;
      },
      error => {
        this.notificationService.warn(`操作失败: ${error.statusMessage}`);
      }
    );
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
