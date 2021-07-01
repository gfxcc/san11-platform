import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeIcons } from 'primeng/api';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { getFullUrl } from 'src/app/utils/resrouce_util';
import { Action, Activity, ListActivitiesRequest, ListActivitiesResponse, User } from 'src/proto/san11-platform.pb';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  userId: string;

  events: any[];
  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.userId = params.userId;
      this.load_activities();
    });

    this.events = [];
  }

  load_activities() {
    this.san11pkService.listActivities(new ListActivitiesRequest({
      userId: this.userId
    })).subscribe(
      (resp: ListActivitiesResponse) => {
        this.events = resp.activities.map((activity: Activity) => {
          return this.activityToEvent(activity);
        });
      }, 
      error => {
        this.notificationService.warn(`获取时间线失败: ${error.statusMessage}`)
      }
    );
  }

  activityToEvent(activity: Activity) {
    let action: string;
    let icon: string;
    let color = '#607D8B';
    switch (activity.action) {
      case Action.CREATE:
        action = '创建';
        icon = 'add';
        color = '#4286F3';
        break;
      case Action.DELETE:
        action = '删除';
        icon = 'delete';
        color = '#EA4333';
        break;
      case Action.UPDATE:
        action = '更新';
        icon = 'update';
        color = '#33A951';
        break;
      case Action.SELECT:
        action = '查看';
        icon = 'update';
        icon = 'travel_explore';
        break;
      case Action.LIKE:
        action = 'LIKE';
        icon = 'favorite';
        color = '#FBBE04';
        break;
      case Action.UPVOTE:
        action = '赞';
        icon = 'thumb_up';
        color = '#FBBE04';
        break;
      case Action.SUBSCRIBE:
        action = '订阅';
        icon = 'notifications';
        color = '#FBBE04';
        break;
      case Action.DOWNLOAD:
        action = '下载';
        icon = 'get_app';
        break;
    };

    return {
      'displayName': `${action} ${activity.resourceView ? activity.resourceView.displayName : '已删除'}`,
      'description': activity.resourceView ? activity.resourceView.description : '',
      'createTime': activity.createTime,
      'icon': icon,
      'image': (activity.resourceView && activity.resourceView.imageUrl) ? getFullUrl(activity.resourceView.imageUrl) : undefined,
      'color': color,
      'link': (activity.resourceView?.name) ? activity.resourceView.name : undefined,
    }
  }

  onDetailClick(event) {
    this.router.navigate([event.link]);
  }

}
