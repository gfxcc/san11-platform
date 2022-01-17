import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryComponent, ImageItem } from 'ng-gallery';
import { CreateImageRequest, FieldMask, GetUserRequest, Package, UpdatePasswordRequest, UpdateUserRequest, User } from "../../../proto/san11-platform.pb";
import { LoadingComponent } from '../../common/components/loading/loading.component';
import { GlobalConstants } from '../../common/global-constants';
import { NotificationService } from "../../common/notification.service";
import { San11PlatformServiceService } from "../../service/san11-platform-service.service";
import { UploadService } from '../../service/upload.service';
import { getFullUrl } from "../../utils/resrouce_util";
import { getUserUrl } from "../../utils/user_util";




export interface UserData {
  user: User
}
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @ViewChild('userGallery') galleryElement: GalleryComponent
  @ViewChild('imageInput') imageInputElement: ElementRef
  @ViewChild(MatPaginator) paginator: MatPaginator;

  userId: string;
  user: User;
  loading;
  userFormUpdated = false;

  hidePassword: boolean = true;

  displayedColumns: string[] = ['name', 'createTime', 'downloadCount'];
  dataSource: MatTableDataSource<Package>;

  constructor(
    // public dialogRef: MatDialogRef<UserDetailComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: UserData,
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private uploadService: UploadService,
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: { user: User }) => {
        if (data.user) {
          this.user = data.user;
        }
      }
    );
    this.loadPage();
  }

  get userImageUrl() {
    return getFullUrl(this.user.imageUrl);
  }


  loadPage() {
    this.san11pkService.getUser(new GetUserRequest({ userId: this.user.userId })).subscribe(
      user => {
        this.user = user;
        this.loadPackageList(user);
        if (this.canSetupGallery()) {
          this.setUpUserImage(this.user.imageUrl === '' ? '' : getFullUrl(this.user.imageUrl));
        }
      },
      error => {
        this.notificationService.warn('获取用户资料失败: ' + error.statusMessage);
      }
    );
  }

  ngAfterViewInit(): void {
    if (this.canSetupGallery()) {
      this.setUpUserImage(this.user.imageUrl === '' ? '' : getFullUrl(this.user.imageUrl));
    }
  }

  formUpdated() {
    this.userFormUpdated = true;
  }

  canSetupGallery() {
    return this.user != undefined && this.galleryElement != undefined;
  }

  loadPackageList(user: User) {
    // TODO: Implement this logic with utilize field `filter`.
    // this.san11pkService.listPackages(new ListPackagesRequest({  })).subscribe(
    //   resp => {
    //     this.dataSource = new MatTableDataSource(resp.packages);
    //     this.dataSource.paginator = this.paginator;
    //   },
    //   error => {
    //     this.notificationService.warn('获取工具列表 失败: ' + error.statusMessage);
    //   }
    // );
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

    if (confirm('要更换头像吗?')) {
      this.imageInputElement.nativeElement.click();
    } else {

    }
  }

  onUploadScreenshot(imageInput) {
    const image = imageInput.files[0];
    if (image.size > GlobalConstants.maxImageSize) {
      alert('上传图片必须小于: ' + (GlobalConstants.maxImageSize / 1024 / 1024).toString() + 'MB');
      return;
    }

    this.loading = this.dialog.open(LoadingComponent);

    const parent = getUserUrl(this.user);
    const filename = `${parent}/images/tmp.jpeg`
    this.uploadService.upload(image, GlobalConstants.tmpBucket, filename).subscribe((upload) => {
      if (upload.state === 'DONE') {
        this.san11pkService.createImage(new CreateImageRequest({
          parent: parent,
          url: filename
        })).subscribe(
          url => {
            this.user.imageUrl = url.url;
            this.setUpUserImage(getFullUrl(this.user.imageUrl));

            this.notificationService.success('图片上传成功');
            this.loading.close();
          },
          error => {
            this.notificationService.warn('上传截图失败: ' + error.statusMessage);
            this.loading.close();
          }
        );
      }
    });
  }

  onUpdateUserForm(form) {
    const request = new UpdateUserRequest({
      user: new User({
        userId: this.user.userId,
        username: form.value.username,
        email: form.value.email,
        website: form.value.website
      }),
      updateMask: new FieldMask({
        paths: ['username', 'website']
      })
    });
    this.san11pkService.updateUser(request).subscribe(
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

  onPackageClick(san11Package: Package) {
    // this.dialogRef.close();
    this.router.navigate(san11Package.name.split('/'));
    // this.san11pkService.getPackage(packageId).subscribe(
    //   san11Package => {
    //     this.dialog.open(PackageDetailComponent, {
    //       data: {
    //         package: san11Package
    //       }
    //     });
    //   },
    //   error => {
    //     this.notificationService.warn('获取工具详情 失败: ' + error.statusMessage);
    //   }
    // );
  }


  iAmTheUser() {
    return this.user.userId === localStorage.getItem('userId');
  }
}



export interface UserIdData {
  userId: string
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
    @Inject(MAT_DIALOG_DATA) public data: UserIdData,
    public dialogRef: MatDialogRef<PasswordDialog>,
    private notificationService: NotificationService,
    private san11Service: San11PlatformServiceService
  ) {
    this.userId = data.userId;
  }

  ngOnInit(): void {

  }

  onUpdatePasswordForm(form) {
    const password = form.value.password;
    this.san11Service.updatePassword(new UpdatePasswordRequest({
      userId: this.userId,
      password: password
    })).subscribe(
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