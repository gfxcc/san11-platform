import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { ListThreadsRequest, ListThreadsResponse, Thread } from 'src/proto/san11-platform.pb';
import { CreateThreadComponent } from './create-thread/create-thread.component';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {
  @Input() displayName: string = "讨论区";
  @Input() parent: string;

  virtualThreads: Thread[];
  cols = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.cols = [
      { field: 'vin', header: 'Vin' },
      { field: 'year', header: 'Year' },
      { field: 'brand', header: 'Brand' },
      { field: 'color', header: 'Color' }
    ];
    this.virtualThreads = Array.from({ length: 300 });
  }

  loadCarsLazy(event: LazyLoadEvent) {
    if (event.first < 0) {
      return;
    }

    const request = new ListThreadsRequest({
      parent: this.parent,
      pageSize: event.rows.toString(),
      pageToken: `{ "watermark": "${event.first}" }`,
    })
    this.san11pkService.listThreads(request).subscribe(
      (resp: ListThreadsResponse) => {
        Array.prototype.splice.apply(this.virtualThreads, [
          ...[event.first, resp.threads.length],
          ...resp.threads
        ]);

        if (resp.threads.length < event.rows) {
          this.virtualThreads.splice(event.first + resp.threads.length);
        } else {
          Array.prototype.splice.apply(this.virtualThreads, [
            ...[event.first + event.rows, 100],
            ...Array.from({ length: 100 })
          ]);
        }
        //trigger change detection
        this.virtualThreads = [...this.virtualThreads];
      },
      error => {
        console.log(`获取讨论列表失败: ${error.statusMessage}.`);
      }
    );
  }

  createThread() {
    this.dialog.open(CreateThreadComponent, {
      data: {
        parent: this.parent,
      }
    });
  }
}
