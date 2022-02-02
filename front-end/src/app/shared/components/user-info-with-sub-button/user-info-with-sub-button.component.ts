import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { decrement, increment } from 'src/app/utils/number_util';
import { loadUser, signedIn } from 'src/app/utils/user_util';
import { CreateSubscriptionRequest, ListSubscriptionsRequest, ListSubscriptionsResponse, Status, Subscription, UnSubscribeRequest, User } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-user-info-with-sub-button',
  templateUrl: './user-info-with-sub-button.component.html',
  styleUrls: ['./user-info-with-sub-button.component.css']
})
export class UserInfoWithSubButtonComponent implements OnInit {
  @Input() user: User;

  hideAvatar = true;
  subscribed = false;
  notificationEnabled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
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
        console.log(resp);
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
}
