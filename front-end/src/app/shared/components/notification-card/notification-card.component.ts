import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { getFullUrl } from 'src/app/utils/resrouce_util';
import { getAge } from 'src/app/utils/time_util';
import { GetUserRequest, Notification, User } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent implements OnInit {
  @Input() notification: Notification;
  hideSenderImage = true;
  sender: User;


  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.san11pkService.getUser(new GetUserRequest({
      name: `users/${this.notification.senderId}`,
    })).subscribe(
      (resp: User) => {
        this.sender = resp;
      },
      error => {
        this.notificationService.warn(`无法获取用户数据: ${error.statusMessage}`);
      }
    )
  }

  get senderAvatar() {
    return getFullUrl(this.sender?.imageUrl);
  }

  get preview() {
    return getFullUrl(this.notification.imagePreview);
  }

  get age() {
    return getAge(this.notification.createTime);
  }
}
