import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from 'src/app/common/components/loading/loading.component';
import { NotificationService } from 'src/app/common/notification.service';
import { getFullUrl } from 'src/app/utils/resrouce_util';
import { Action, Activity, ListActivitiesRequest, ListActivitiesResponse } from 'src/proto/san11-platform.pb';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';


@Component({
  selector: 'app-admin-message-board',
  templateUrl: './admin-message-board.component.html',
  styleUrls: ['./admin-message-board.component.css']
})
export class AdminMessageBoardComponent implements OnInit {
  userId: string;

  events: any[] = [];
  loading;
  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.userId = params.userId;
      this.load_activities();
    });
  }

  load_activities() {
    this.loading = this.dialog.open(LoadingComponent);
    this.san11pkService.listActivities(new ListActivitiesRequest({
      parent: '',
      orderBy: 'create_time desc',
      pageSize: '100',
    })).subscribe(
      (resp: ListActivitiesResponse) => {
        this.events = resp.activities.map((activity: Activity) => {
          return this.activityToEvent(activity);
        });
        this.loading.close();
      },
      error => {
        this.notificationService.warn(`获取时间线失败: ${error.statusMessage}`)
        this.loading.close();
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
      case Action.DISLIKE:
        action = '反对';
        icon = 'thumb_down';
        color = '#EA4333';
        break;
      case Action.DOWNLOAD:
        action = '下载';
        icon = 'get_app';
        break;
    };

    return {
      'displayName': `【${action}】 ${activity.resourceView ? activity.resourceView.displayName : '已删除'}`,
      'description': activity.resourceView ? activity.resourceView.description : '',
      'createTime': activity.createTime,
      'icon': icon,
      'image': (activity.resourceView && activity.resourceView.imageUrl) ? getFullUrl(activity.resourceView.imageUrl) : undefined,
      'color': color,
      'link': (activity.resourceView?.name) ? activity.resourceView.name : undefined,
    }
  }

  onDetailClick(event) {
    console.log(event.link);
    this.router.navigate(event.link.split('/'));
  }

}
