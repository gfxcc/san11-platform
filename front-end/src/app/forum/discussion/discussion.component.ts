import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { ListThreadsRequest, ListThreadsResponse, Thread } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {

  virtualThreads: Thread[];

  constructor(
    private router: Router,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.virtualThreads = Array.from({ length: 10000 });

  }

  loadCarsLazy(event: LazyLoadEvent) {
    this.san11pkService.listThreads(new ListThreadsRequest({
      parent: 'general',
      pageSize: event.rows.toString(),
      pageToken: `{ "watermark": "${event.first}" }`,
    })).subscribe(
      (resp: ListThreadsResponse) => {
        Array.prototype.splice.apply(this.virtualThreads, [
          ...[event.first, event.rows],
          ...resp.threads
        ]);

        //trigger change detection
        this.virtualThreads = [...this.virtualThreads];
      }, 
      error => {
        this.notificationService.warn(`获取讨论列表失败: ${error.statusMessage}.`)
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
