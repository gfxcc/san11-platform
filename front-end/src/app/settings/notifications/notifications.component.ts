import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';

import { FieldMask, UpdateUserRequest, User } from "../../../proto/san11-platform.pb";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})

// export interface NotificationSetting {

// }

export class NotificationsComponent implements OnInit {
  @Input() user: User;

  constructor(
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => {
        this.user = data.user;
      }
    );
  }

  updateSetting() {
    console.log(this.user);

    const request = new UpdateUserRequest({
      user: this.user,
      updateMask: new FieldMask({
        paths: ['settings'],
      })
    });
    this.san11pkService.updateUser(request).subscribe(
      (user: User) => {
        this.notificationService.success('更新成功');
      },
      error => {
        this.notificationService.warn(`更新失败: ${error.statusMessage}`)
      }
    );
  }
}
