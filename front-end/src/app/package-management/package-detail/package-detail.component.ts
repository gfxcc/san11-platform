import { ViewChild, ChangeDetectorRef, ElementRef, Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { saveAs } from 'file-saver'
// import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import * as Editor from "../../common/components/ckeditor/ckeditor";
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
// import ImageInsert from "@ckeditor/ckeditor5-image/src/imageinsert";
// import Image from '@ckeditor/ckeditor5-image/src/image';

import { GalleryItem, ImageItem } from 'ng-gallery';
import { GlobalConstants } from '../../common/global-constants'
import { Package, UploadImageRequest, User } from "../../../proto/san11-platform.pb";
import { getFullUrl } from "../../utils/resrouce_util";
import { San11PlatformServiceService } from "../../service/san11-platform-service.service";
import { NotificationService } from "../../common/notification.service";
import { TextInputDialogComponent, TextData } from "../../common/components/text-input-dialog/text-input-dialog.component";
import { LoadingComponent } from '../../common/components/loading/loading.component'
import { EventEmiterService } from "../../service/event-emiter.service";

import { UserDetailComponent } from "../../account-management/user-detail/user-detail.component";

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { isAdmin } from "../../utils/user_util";
import { increment } from '../../utils/number_util';
import { getPackageUrl } from "../../utils/package_util";


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

  images: ImageItem[] = [];
  packageId: string;
  package: Package;
  author: User = new User({});
  hideAuthorImage = true;
  authorImageUrl: string;

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

  constructor(
    // public dialogRef: MatDialogRef<PackageDetailComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private _eventEmiter: EventEmiterService,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: { package: Package }) => {
        this.package = data.package;
        this._eventEmiter.sendMessage(this.package.categoryId);
      }
    );

    this.loadPage();
    this.configDescEditor();
  }

  ngAfterViewInit(): void {

    // this.authroNameElement.nativeElement.className = 'clickable';
    // this.authroNameElement.nativeElement.onclick = () => {

    // };
    if (this.isAuthor()) {
      // this.packageNameElement.nativeElement.className = 'clickable title';
      this.packageNameElement.nativeElement.contentEditable = true;
    }

    // console.log(this.descEditor);
  }

  configDescEditor() {
    this.descEditor_data = this.package.description;
    this.descEditor_disabled = !this.isAuthor();
    // this.descEditor_config = "{ toolbar: [ 'heading', '|', 'bold', 'italic', 'link' , 'numberedList', 'bulletedList', '|', 'decreaseIndent', 'increaseIndent', '|', 'insertImage', 'insertTable', '|', 'undo', 'redo'] }";
    this.descEditor_config = {
      placeholder: '请添加描述 (支持 Markdown)',
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'blockQuote',
          'code',
          'link',
          '|',
          'bulletedList',
          'todoList',
          'numberedList',
          '|',
          'outdent',
          'indent',
          'horizontalLine',
          '|',
          'codeBlock',
          'insertTable',
          '|',
          'undo',
          'redo'
        ]
      },
      language: 'zh-cn',
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
        ]
      },
      licenseKey: '',
    };
  }

  onUpdateTitle() {
    const updatedPackageName = this.packageNameElement.nativeElement.innerHTML;
    const newPackage = new Package({
      packageId: this.package.packageId,
      name: updatedPackageName
    });
    this.san11pkService.updatePackage(newPackage).subscribe(
      san11Package => {
        this.package.name = updatedPackageName;
        this.packageNameUpdated = false;
        this.notificationService.success("更新成功");
      },
      error => {
        this.notificationService.warn("更新失败: " + error.statusMessage);
      }
    );
  }

  onUpdateDesc() {
    console.log('on update dec');
    const newDesc = this.descEditor_element.getData();

    if (newDesc != undefined) {
      const newPackage = new Package({
        packageId: this.package.packageId,
        description: newDesc
      });
      this.san11pkService.updatePackage(newPackage).subscribe(
        san11Package => {
          this.package.description = san11Package.description;
          this.descEditor_updated = false;
          this.notificationService.success("更新成功");
        },
        error => {
          this.notificationService.warn("更新失败: " + error.statusMessage);
        }
      );
    }

  }

  onDescEditorReady(event) {
    this.descEditor_element = event;
  }

  onDescEditorChange(event) {
    console.log(event.editor.getData());
    console.log('Desc is changed');
    this.descEditor_updated = true;
  }

  onDownloadDesc() {
    const data = this.descEditor_element.getData();
    const filename = `${this.package.name}-desc.md`;
    var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
  }

  loadPage() {
    if (this.isAdmin() && this.package.status === 'under_review') {
      this.adminZone = true;
    }
    if (this.isAdmin() || this.isAuthor()) {
      this.authorZone = true;
    }

    this.package.imageUrls.forEach(imageUrl => {
      const fullImageUrl = getFullUrl(imageUrl);
      this.images.push(new ImageItem({ src: fullImageUrl, thumb: fullImageUrl }));
    });

    if (this.package.categoryId === '1') {
      // append a pre-set image for SIRE package
      const fullImageUrl = getFullUrl('images/sire2.jpg');
      this.images.push(new ImageItem({ src: fullImageUrl, thumb: fullImageUrl }));
    }
    // append image for upload 
    if (this.isAuthor() || this.isAdmin()) {
      this.images.push(new ImageItem({ src: '../../../assets/images/upload.jpg', thumb: '../../../assets/images/upload.jpg' }));
    }

    this.san11pkService.getUser(this.package.authorId).subscribe(
      user => {
        this.author = user;
        this.authorImageUrl = getFullUrl(this.author.imageUrl);
      },
      error => {
        this.notificationService.warn('无法获取作者信息:' + error.statusMessage);
      }
    );
  }

  onAuthorClick() {
    this.router.navigate(['users', this.package.authorId]);
  }

  // admin
  onApprove() {
    this.san11pkService.updatePackage(new Package({
      packageId: this.package.packageId,
      status: 'normal'
    })).subscribe(
      san11Package => {
        this.notificationService.success('审核通过')

        this.router.navigate(['categories', this.package.categoryId]).then(() => {
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
    if (confirm('确认要删除 ' + this.package.name + ' 吗？')) {
      if (this.isAdmin()) {
        this.san11pkService.deletePackage(this.package).subscribe(
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
        const updatedPakcage = new Package({
          packageId: this.package.packageId,
          status: 'hidden'
        });
        this.san11pkService.updatePackage(updatedPakcage).subscribe(
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


  onUpdateDescription() {
    this.dialog.open(TextInputDialogComponent, {
      data: {
        title: "描述",
        preSetText: this.package.description
      }
    }).afterClosed().subscribe(
      data => {
        if (data != undefined) {
          const newDescription = data.data;
          const newPackage = new Package({
            packageId: this.package.packageId,
            description: newDescription
          });
          this.san11pkService.updatePackage(newPackage).subscribe(
            san11Package => {
              this.package.description = newDescription;
              this.notificationService.success("更新成功");
            },
            error => {
              this.notificationService.warn("更新失败: " + error.statusMessage);
            }
          );
        }
      }
    );

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
        if (this.package.categoryId === '1' && imageIndex === this.images.length - 2) {
          this.notificationService.warn('不可删除系统预设图片');
          return;
        }
        this.package.imageUrls.splice(imageIndex, 1);
        this.san11pkService.updatePackage(new Package({
          packageId: this.package.packageId,
          imageUrls: this.package.imageUrls.length > 0 ? this.package.imageUrls : ['empty']
        })).subscribe(
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

    let fileReader = new FileReader();
    fileReader.onload = () => {

      var parent = getPackageUrl(this.package);

      var arrayBuffer = fileReader.result;
      var bytes = new Uint8Array(arrayBuffer as ArrayBuffer);

      this.san11pkService.uploadImage(parent, bytes).subscribe(

        url => {
          this.package.imageUrls.push(url.url);
          const fullUrl = getFullUrl(url.url);
          if (this.package.categoryId === '1') {
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

    fileReader.readAsArrayBuffer(image);

  }

  onBack() {
    this.router.navigate(['categories', this.package.categoryId]);
  }


  // childs
  onChildDownload(msg) {
    this.package.downloadCount = increment(this.package.downloadCount);
  }


  // utils
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
