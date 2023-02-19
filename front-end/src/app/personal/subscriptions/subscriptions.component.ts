import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { getUserUri, loadUser } from 'src/app/utils/user_util';
import { ListSubscriptionsRequest, ListSubscriptionsResponse, Subscription } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

  subscriptions: Subscription[];

  constructor(
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.san11pkService.listSubscription(new ListSubscriptionsRequest({
      parent: getUserUri(loadUser())
    })).subscribe(
      (resp: ListSubscriptionsResponse) => {
        this.subscriptions = resp.subscriptions;
      }, error => {

      }
    );
  }

}
