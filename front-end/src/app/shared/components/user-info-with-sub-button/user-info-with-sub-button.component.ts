import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from 'src/app/common/components/loading/loading.component';
import { GlobalConstants } from 'src/app/common/global-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { UploadService } from 'src/app/service/upload.service';
import { decrement, increment } from 'src/app/utils/number_util';
import { getUserUrl, loadUser, saveUser, signedIn } from 'src/app/utils/user_util';
import { CreateImageRequest, CreateSubscriptionRequest, ListSubscriptionsRequest, ListSubscriptionsResponse, Status, Subscription, UnSubscribeRequest, User } from 'src/proto/san11-platform.pb';
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

  loading;
  hideAvatar = true;
  subscribed = false;
  notificationEnabled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private uploadService: UploadService,
  ) { }

  ngOnInit(): void {
    this.setSubscriptionStatus();
  }

  setSubscriptionStatus() {
    if (!signedIn()) {
      return;
    }
    this.san11pkService.listSubscription(new ListSubscriptionsRequest({
      parent: this.user.name,
      filter: `subscriber_id=${loadUser().userId}`,
    })).subscribe(
      (resp: ListSubscriptionsResponse) => {
        if (resp.subscriptions.length > 0) {
          this.subscribed = true;
        }
      }, error => {
        this.notificationService.warn(`载入订阅状态失败: ${error.statusMessage}`);
      }
    );
  }

  onSubscribe() {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      return;
    }
    if (this.subscribed) {
      if (!confirm('确定要退订吗?')) {
        return;
      }
      this.san11pkService.unSubscribe(new UnSubscribeRequest({
        subscribedResource: this.user.name,
        subscriberId: loadUser().userId,
      })).subscribe(
        (resp: Status) => {
          this.user.subscriberCount = decrement(this.user.subscriberCount);
          this.notificationService.success('退订成功');
        }, error => {
          this.notificationService.warn(`退订失败: ${error.statusMessage}`);
        }
      );

      this.subscribed = false;
      this.notificationEnabled = false;
    } else {
      this.san11pkService.createSubscription(new CreateSubscriptionRequest({
        parent: this.user.name,
        subscription: new Subscription({
          type: Subscription.SubscribeType.ALL,
        }),
      })).subscribe(
        (sub: Subscription) => {
          this.user.subscriberCount = increment(this.user.subscriberCount);
          this.notificationService.success(`订阅成功`);
        }, error => {
          this.notificationService.warn(`订阅失败: ${error.statusMessage}`);
        }
      );
      this.subscribed = true;
    }
  }

  onNotification() {
    if (this.notificationEnabled) {
      this.notificationEnabled = false;
    } else {
      this.notificationEnabled = true;
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

    this.loading = this.dialog.open(LoadingComponent);

    const parent = getUserUrl(this.user);
    const filename = `${parent}/images/${uuid()}.jpeg`
    this.uploadService.upload(image, GlobalConstants.tmpBucket, filename).subscribe((upload) => {
      if (upload.state === 'DONE') {
        this.san11pkService.createImage(new CreateImageRequest({
          parent: parent,
          url: filename
        })).subscribe(
          url => {
            this.user.imageUrl = url.url;
            saveUser(this.user);

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
