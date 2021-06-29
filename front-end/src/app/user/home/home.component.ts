import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateImageRequest, User } from '../../../proto/san11-platform.pb';
import { LoadingComponent } from '../../common/components/loading/loading.component';
import { GlobalConstants } from '../../common/global-constants';
import { NotificationService } from '../../common/notification.service';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { UploadService } from '../../service/upload.service';
import { getFullUrl } from '../../utils/resrouce_util';
import { getUserUrl, isAdmin, loadUser } from '../../utils/user_util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('imageInput') imageInputElement: ElementRef

  loading: MatDialogRef<LoadingComponent>;
  user: User;
  selectedIndex = 0;

  tabs = [
    {
      label: '作品',
      link: ['publishedPackages'],
      disabled: false,
    },
    {
      label: '时间线',
      link: ['timeline'],
      disabled: false
    },
    {
      label: '账户信息',
      link: ['accountInfo'],
      disabled: false
    },
    // {
    //   label: '关于',
    //   link: ['about']
    // }
  ];

  constructor(
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private uploadService: UploadService,
  ) { }

  ngOnInit(): void {

    this.route.data.subscribe(
      (data) => {
        if (data.user) {
          this.user = data.user;
          // this.selectedTabChange({ index: 0 });
        }
      }
    );

    const patterns = this.router.url.split('/');
    console.log(patterns);
    switch (patterns[patterns.length - 1]) {
      case 'timeline':
        console.log('in');
        this.selectedIndex = 1;
        break;
      case 'accountInfo':
        this.selectedIndex = 2;
        break;
    }
  }

  // getter
  get userImageUrl() {
    return getFullUrl(this.user.imageUrl);
  }
  // getter end

  selectedTabChange(event: { index: number }) {
    const link = this.tabs[event.index].link;
    this.router.navigate(link, { relativeTo: this.route, state: { user: this.user } });
  }

  onAvatarClick() {
    console.log('click');
    if (this.user.userId != loadUser().userId) {
      return;
    }

    if (confirm('要更换头像吗?')) {
      this.imageInputElement.nativeElement.click();
    }
  }

  onUploadUserAvatar(imageInput) {
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

}
