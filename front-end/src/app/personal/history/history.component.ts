import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DefaultUrlSerializer, Router, UrlTree } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from 'src/app/common/notification.service';
import { ProgressService } from 'src/app/progress.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { activityToEvent } from 'src/app/utils/activity_util';
import { loadUser, signedIn } from 'src/app/utils/user_util';
import { Activity, ListActivitiesRequest, ListActivitiesResponse } from 'src/proto/san11-platform.pb';



@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  userId: string;

  events: any[];

  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog,
    private progressService: ProgressService,
  ) { }

  ngOnInit(): void {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      this.router.navigate(['/']);
      return
    }
    this.userId = loadUser().userId;
    this.load_activities();

    this.events = [];
  }

  load_activities() {
    this.progressService.loading();
    this.san11pkService.listActivities(new ListActivitiesRequest({
      parent: `users/${this.userId}`,
      orderBy: 'create_time desc',
      pageSize: '200',
    }))
      .pipe(finalize(() => this.progressService.complete()))
      .subscribe({
        next: (resp: ListActivitiesResponse) => {
          this.events = resp.activities.map((activity: Activity) => {
            return activityToEvent(activity);
          });
        },
        error: error => {
          this.notificationService.warn(`获取时间线失败: ${error.statusMessage}`)
        }
      });
  }


  onDetailClick(event) {
    const urlTree: UrlTree = new DefaultUrlSerializer().parse(event.link);
    this.router.navigateByUrl(urlTree);
  }

}
