import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { ProgressService } from 'src/app/progress.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { UploadService } from 'src/app/service/upload.service';
import { decrement, increment } from 'src/app/utils/number_util';
import { getUserUri, loadUser, saveUser, signedIn } from 'src/app/utils/user_util';
import { CreateImageRequest, CreateSubscriptionRequest, DeleteSubscriptionRequest, ImageType, ListSubscriptionsRequest, ListSubscriptionsResponse, Subscription, User } from 'src/proto/san11-platform.pb';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-user-info-with-sub-button',
  templateUrl: './user-info-with-sub-button.component.html',
  styleUrls: ['./user-info-with-sub-button.component.css']
})
export class UserInfoWithSubButtonComponent implements OnInit {
  @Input() user: User;
  @Input() updateAvatar: false;
  @ViewChild('imageInput') imageInputElement: ElementRef

  displayUserImgLoading: boolean = true;
  subscription: Subscription;
  loadingSubscription: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private uploadService: UploadService,
    private progressService: ProgressService,
  ) { }

  ngOnInit(): void {
    this.setSubscriptionStatus();
  }

  setSubscriptionStatus() {
    if (!signedIn()) {
      this.loadingSubscription = false;
      return;
    }

    this.san11pkService.listSubscription(new ListSubscriptionsRequest({
      parent: `users/${loadUser().userId}`,
      filter: `target="users/${this.user.userId}"`,
    })).subscribe({
      next: (resp: ListSubscriptionsResponse) => {
        if (resp.subscriptions.length > 0) {
          this.subscription = resp.subscriptions[0];
        }
        this.loadingSubscription = false;
      },
      error: error => {
        this.notificationService.warn(`载入订阅状态失败: ${error.statusMessage}`);
      }
    });
  }

  onSubscribe() {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      return;
    }
    if (this.subscription != undefined) {
      if (!confirm('确定要退订吗?')) {
        return;
      }
      this.san11pkService.deleteSubscription(new DeleteSubscriptionRequest({
        name: this.subscription.name
      })).subscribe(
        (resp: Subscription) => {
          this.user.subscriberCount = decrement(this.user.subscriberCount);
          this.subscription = undefined;
          this.notificationService.success('退订成功');
        }, error => {
          this.notificationService.warn(`退订失败: ${error.statusMessage}`);
        }
      );
    } else {
      this.san11pkService.createSubscription(new CreateSubscriptionRequest({
        parent: getUserUri(loadUser()),
        subscription: new Subscription({
          target: getUserUri(this.user),
        }),
      })).subscribe(
        (sub: Subscription) => {
          this.user.subscriberCount = increment(this.user.subscriberCount);
          this.subscription = sub;
          this.notificationService.success(`订阅成功`);
        }, error => {
          this.notificationService.warn(`订阅失败: ${error.statusMessage}`);
        }
      );
    }
  }

  onAvatarClick() {
    if (!this.updateAvatar || this.user.userId != loadUser().userId) {
      this.router.navigate(this.user.name.split('/'));
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

    const parent = getUserUri(this.user);
    const filename = `${parent}/images/${uuid()}.jpeg`
    this.progressService.loading();
    this.uploadService.upload(image, GlobalConstants.tmpBucket, filename).subscribe((upload) => {
      if (upload.state === 'DONE') {
        this.san11pkService.createImage(new CreateImageRequest({
          parent: parent,
          url: filename,
          imageType: ImageType.USER_AVATAR,
        }))
          .pipe(finalize(() => this.progressService.complete()))
          .subscribe({
            next: (resp) => {
              this.user.imageUrl = resp.url;
              saveUser(this.user);

              this.notificationService.success('图片上传成功');
            },
            error: (error) => {
              this.notificationService.warn('上传图片失败: ' + error.statusMessage);
            },
          });
      }
    });
  }
}
