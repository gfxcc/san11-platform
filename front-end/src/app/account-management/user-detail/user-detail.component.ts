import { ViewChild, ElementRef, Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryItem, ImageItem, GalleryComponent } from 'ng-gallery';
import { GlobalConstants } from '../../common/global-constants'
import { Package, UploadImageRequest, User } from "../../../proto/san11-platform.pb";
import { getFullUrl } from "../../utils/resrouce_util";
import { getUserUrl } from "../../utils/user_util";
import { San11PlatformServiceService } from "../../service/san11-platform-service.service";
import { NotificationService } from "../../common/notification.service";
import { TextInputDialogComponent, TextData } from "../../common/components/text-input-dialog/text-input-dialog.component";
import { LoadingComponent } from '../../common/components/loading/loading.component'

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { isAdmin } from "../../utils/user_util";
import { increment } from '../../utils/number_util';
import { getPackageUrl } from "../../utils/package_util";


export interface UserData {
  userId: string
}
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @ViewChild('gallery') galleryElement: GalleryComponent
  @ViewChild('imageInput') imageInputElement: ElementRef

  user: User;
  images: ImageItem[];
  loading;

  hidePassword: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserData,
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
  ) {
    this.san11pkService.getUser(data.userId).subscribe(
      user => {
        this.user = user;
      },
      error => {
        this.notificationService.warn('获取用户资料失败: ' + error.statusMessage);
      }
    );
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setUpUserImage(this.user.imageUrl === '' ? '' : getFullUrl(this.user.imageUrl));
  }

  setUpUserImage(imageUrl: string): void {

    let images_;
    if (imageUrl === '') {
      images_ = [new ImageItem({ src: '../../../assets/images/upload.jpg', thumb: '../../../assets/images/upload.jpg' })];
    } else {
      images_ = [new ImageItem({ src: imageUrl })];
    }

    this.galleryElement.load(images_);
  }

  onGalleryItemClick(imageIndex: number) {
    if (!(this.iAmTheUser())) {
      return;
    }

    if (this.user.imageUrl === '') {
      this.imageInputElement.nativeElement.click();
    } else {
      if (!confirm('确定要删除头像吗?')) {
        return;
      }

      const updatedUser = new User({
        userId: this.user.userId,
        imageUrl: 'empty'
      });
      this.san11pkService.updateUser(updatedUser).subscribe(
        user => {
          this.setUpUserImage('');
          this.user = user;
          this.notificationService.success('删除头像 成功');
        },
        error => {
          this.notificationService.warn('删除头像 失败:' + error.statusMessage);
        }
      );

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

      var parent = getUserUrl(this.user);

      var arrayBuffer = fileReader.result;
      var bytes = new Uint8Array(arrayBuffer as ArrayBuffer);

      this.san11pkService.uploadImage(parent, bytes).subscribe(

        url => {
          this.user.imageUrl = url.url;
          this.setUpUserImage(getFullUrl(this.user.imageUrl));

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

  onUpdateUserForm(form) {
    console.log(form);
    let updatedUser = new User({
      userId: this.user.userId,
      email: form.value.email,
      website: form.value.website
    });
    console.log(updatedUser);
    console.log(updatedUser.imageUrl);
    this.san11pkService.updateUser(updatedUser).subscribe(
      user => {
        this.notificationService.success('更新用户 成功');
        this.user = user;
      },
      error => {
        this.notificationService.warn('更新用户 失败:' + error.statusMessage);
      }
    );

  }

  onUpdatePasswordClick() {
    this.dialog.open(PasswordDialog, {
      data: {
        userId: this.user.userId
      }
    });
  }


  iAmTheUser() {
    return this.user.userId === localStorage.getItem('userId');
  }
  // import functions



}


@Component({
  selector: 'password-dialog',
  templateUrl: 'password-dialog.html',
  styleUrls: ['./user-detail.component.css']
})
export class PasswordDialog implements OnInit {
  userId: string;
  hidePassword = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserData,
    public dialogRef: MatDialogRef<TextInputDialogComponent>,
    private notificationService: NotificationService,
    private san11Service: San11PlatformServiceService
  ) {
    this.userId = data.userId;

  }

  ngOnInit(): void {

  }

  onUpdatePasswordForm(form) {
    const password = form.value.password;
    this.san11Service.updatePassword(this.userId, password).subscribe(
      empty => {
        this.notificationService.success('更新密码 成功');
      },
      error => {
        this.notificationService.warn('更新密码 失败:' + error.statusMessage);
      }
    );
    this.dialogRef.close();
  }
}