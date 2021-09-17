import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { min } from 'rxjs-compat/operator/min';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { isAdmin } from 'src/app/utils/user_util';
import { ListThreadsRequest, ListThreadsResponse, Thread } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {
  @Input() displayName: string;
  @Input() parent: string;

  virtualThreads: Thread[];
  cols = [];

  constructor(
    private router: Router,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    // if (!isAdmin()) {
    //   this.notificationService.warn('尚未开放');
    //   this.router.navigate(['']);
    // }
    this.cols = [
      { field: 'vin', header: 'Vin' },
      { field: 'year', header: 'Year' },
      { field: 'brand', header: 'Brand' },
      { field: 'color', header: 'Color' }
    ];
    this.virtualThreads = Array.from({ length: 300 });
  }

  loadCarsLazy(event: LazyLoadEvent) {
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

}
