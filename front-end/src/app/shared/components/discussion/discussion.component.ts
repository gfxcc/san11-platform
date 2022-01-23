import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { CreateThreadRequest, ListThreadsRequest, ListThreadsResponse, Thread } from 'src/proto/san11-platform.pb';
import { TextInputDialogComponent } from '../text-input-dialog/text-input-dialog.component';

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
    // // simulate remote connection with a timeout
    // setTimeout(() => {
    //   //load data of required page


    //   let loadedProducts = this.products.slice(
    //     event.first,
    //     event.first + event.rows
    //   );

    //   //populate page of virtual cars
    //   Array.prototype.splice.apply(this.virtualThreads, [
    //     ...[event.first, event.rows],
    //     ...loadedProducts
    //   ]);

    //   //trigger change detection
    //   this.virtualThreads = [...this.virtualThreads];
    // }, 1000);
  }

  createThread() {
    this.dialog.open(TextInputDialogComponent, {
      data: {
        title: '新帖子',
        inputTitle: '标题',
        preSetText: ''
      }
    }).afterClosed().subscribe(
      data => {
        if (data) {
          const subject = data.data;
          this._createThread(this.parent, subject);
        }
      }
    );
  }

  _createThread(parent: string, subject: string) {
    this.san11pkService.createThread(new CreateThreadRequest({
      parent: parent,
      thread: new Thread({
        subject: subject,
      })
    })).subscribe(
      (resp: Thread) => {
        this.router.navigate([resp.name])
      },
      error => {
        this.notificationService.warn(`创建失败: ${error.statusMessage}.`)
      }
    );
  }
}
