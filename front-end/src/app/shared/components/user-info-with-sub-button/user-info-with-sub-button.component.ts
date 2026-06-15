import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { InteractionService } from 'src/app/common/interaction.service';
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
export class UserInfoWithSubButtonComponent implements OnChanges, OnDestroy {
  @Input() user: User;
  @Input() updateAvatar: false;
  @ViewChild('imageInput') imageInputElement: ElementRef

  displayUserImgLoading: boolean = true;
  subscription: Subscription;
  loadingSubscription: boolean = true;
  subscriptionBusy = false;
  subscriptionBurst = false;
  subscriberCountPulse = false;
  pendingAvatar: File | undefined;
  avatarPreviewUrl = '';
  private subscriptionStatusTarget = '';
  private subscriptionBurstTimeout: ReturnType<typeof setTimeout>;
  private subscriberCountPulseTimeout: ReturnType<typeof setTimeout>;

  get currentUserId(): string {
    return loadUser().userId;
  }

  get canSubscribeToUser(): boolean {
    return !!this.user?.userId && this.user.userId !== this.currentUserId;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private interactionService: InteractionService,
    private uploadService: UploadService,
    private progressService: ProgressService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user) {
      this.setSubscriptionStatus();
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptionBurstTimeout) {
      clearTimeout(this.subscriptionBurstTimeout);
    }
    if (this.subscriberCountPulseTimeout) {
      clearTimeout(this.subscriberCountPulseTimeout);
    }
  }

  setSubscriptionStatus() {
    if (!this.user?.userId) {
      this.subscriptionStatusTarget = '';
      this.subscription = undefined;
      this.loadingSubscription = true;
      return;
    }

    if (!this.canSubscribeToUser) {
      this.subscriptionStatusTarget = getUserUri(this.user);
      this.subscription = undefined;
      this.loadingSubscription = false;
      return;
    }

    const target = getUserUri(this.user);
    if (target === this.subscriptionStatusTarget) {
      return;
    }

    this.subscriptionStatusTarget = target;
    this.subscription = undefined;

    if (!signedIn()) {
      this.loadingSubscription = false;
      return;
    }

    this.loadingSubscription = true;
    this.san11pkService.listSubscription(new ListSubscriptionsRequest({
      parent: `users/${loadUser().userId}`,
      filter: `target="${target}"`,
    })).subscribe({
      next: (resp: ListSubscriptionsResponse) => {
        if (resp.subscriptions.length > 0) {
          this.subscription = resp.subscriptions[0];
        }
        this.loadingSubscription = false;
      },
      error: error => {
        this.loadingSubscription = false;
        this.notificationService.warn(`载入订阅状态失败: ${error.statusMessage}`);
      }
    });
  }

  onSubscribe() {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      return;
    }
    if (this.subscriptionBusy) {
      return;
    }

    if (this.subscription != undefined) {
      this.subscriptionBusy = true;
      this.interactionService.confirm({
        title: '取消订阅',
        message: `确认要取消订阅“${this.user.username}”吗？之后将不再收到该作者的更新提醒。`,
        confirmText: '取消订阅',
        cancelText: '继续订阅',
        icon: 'notifications_off',
      }).subscribe(confirmed => {
        if (!confirmed) {
          this.subscriptionBusy = false;
          return;
        }

        this.deleteSubscription();
      });
    } else {
      this.subscriptionBusy = true;
      this.san11pkService.createSubscription(new CreateSubscriptionRequest({
        parent: getUserUri(loadUser()),
        subscription: new Subscription({
          target: getUserUri(this.user),
        }),
      })).pipe(finalize(() => this.subscriptionBusy = false)).subscribe(
        (sub: Subscription) => {
          this.user.subscriberCount = increment(this.user.subscriberCount);
          this.subscription = sub;
          this.playSubscriptionFeedback();
          this.notificationService.success(`订阅成功`);
        }, error => {
          this.notificationService.warn(`订阅失败: ${error.statusMessage}`);
        }
      );
    }
  }

  private deleteSubscription(): void {
    this.san11pkService.deleteSubscription(new DeleteSubscriptionRequest({
      name: this.subscription.name
    })).pipe(finalize(() => this.subscriptionBusy = false)).subscribe(
      (resp: Subscription) => {
        this.user.subscriberCount = decrement(this.user.subscriberCount);
        this.subscription = undefined;
        this.playSubscriberCountFeedback();
        this.interactionService.undo('已取消订阅').subscribe(() => this.onSubscribe());
      }, error => {
        this.notificationService.warn(`退订失败: ${error.statusMessage}`);
      }
    );
  }

  onAvatarClick() {
    if (!this.updateAvatar || this.user.userId != loadUser().userId) {
      this.router.navigate(this.user.name.split('/'));
      return;
    }

    this.imageInputElement.nativeElement.click();
  }

  onUploadUserAvatar(imageInput) {
    const image = imageInput.files[0];
    if (!image) {
      return;
    }
    if (image.size > GlobalConstants.maxImageSize) {
      this.notificationService.warn(`上传图片必须小于 ${GlobalConstants.maxImageSize / 1024 / 1024}MB`);
      return;
    }

    this.pendingAvatar = image;
    this.avatarPreviewUrl = URL.createObjectURL(image);
    imageInput.value = '';
  }

  cancelAvatarUpload(): void {
    if (this.avatarPreviewUrl) {
      URL.revokeObjectURL(this.avatarPreviewUrl);
    }
    this.avatarPreviewUrl = '';
    this.pendingAvatar = undefined;
  }

  confirmAvatarUpload(): void {
    const image = this.pendingAvatar;
    if (!image) {
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
              this.cancelAvatarUpload();
              this.notificationService.success('图片上传成功');
            },
            error: (error) => {
              this.notificationService.warn('上传图片失败: ' + error.statusMessage);
            },
          });
      }
    });
  }

  private playSubscriberCountFeedback(): void {
    if (this.subscriberCountPulseTimeout) {
      clearTimeout(this.subscriberCountPulseTimeout);
    }

    this.subscriberCountPulse = false;
    requestAnimationFrame(() => {
      this.subscriberCountPulse = true;
      this.subscriberCountPulseTimeout = setTimeout(() => this.subscriberCountPulse = false, 420);
    });
  }

  private playSubscriptionFeedback(): void {
    if (this.subscriptionBurstTimeout) {
      clearTimeout(this.subscriptionBurstTimeout);
    }

    this.playSubscriberCountFeedback();
    this.subscriptionBurst = false;
    requestAnimationFrame(() => {
      this.subscriptionBurst = true;
      this.subscriptionBurstTimeout = setTimeout(() => this.subscriptionBurst = false, 1260);
    });
  }
}
