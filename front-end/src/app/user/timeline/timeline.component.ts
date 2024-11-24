import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute, DefaultUrlSerializer, Router, UrlTree } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from 'src/app/common/notification.service';
import { ProgressService } from 'src/app/progress.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { activityToEvent } from 'src/app/utils/activity_util';
import { Activity, ListActivitiesRequest, ListActivitiesResponse } from 'src/proto/san11-platform.pb';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  userId: string;

  events: any[] = [];
  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private progressService: ProgressService,
  ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.userId = params.userId;
      this.load_activities();
    });
  }

  load_activities() {
    this.progressService.loading();

    this.san11pkService.listActivities(new ListActivitiesRequest({
      parent: `users/${this.userId}`,
      orderBy: 'create_time desc',
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
