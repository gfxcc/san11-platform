import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from 'src/app/common/notification.service';
import { ProgressService } from 'src/app/progress.service';
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
  @Input() showTitle = true;

  threads: Thread[];
  pageSize = 20;
  totalThreadsCount = 200;
  reachedEnd = false;
  isLoading = false;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private dialog: MatDialog,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    public progressService: ProgressService,
  ) { }

  ngOnInit() {
    this.loadThreads(0, this.pageSize, false);
  }

  changePage(event: PageEvent) {
    this.loadThreads(event.pageIndex * event.pageSize, event.pageSize, true);
  }

  loadThreads(watermark: number, pageSize: number, shouldScrollToTop = true) {
    this.isLoading = true;
    this.progressService.loading();
    const request = new ListThreadsRequest({
      parent: this.parent,
      pageSize: this.pageSize.toString(),
      pageToken: `{ "watermark": "${watermark}" }`,
    })
    this.san11pkService.listThreads(request)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.progressService.complete();
      }))
      .subscribe({
        next: (resp: ListThreadsResponse) => {
          this.threads = resp.threads;
          if (shouldScrollToTop) {
            this.scrollToTop();
          }
          this.updateTotalCount(resp.threads.length < pageSize, watermark + resp.threads.length);
        },
        error: error => {
          this.notificationService.warn(`获取讨论列表失败: ${error.statusMessage}.`);
        }
      });
  }

  scrollToTop() {
    const targetElement = this.elementRef.nativeElement.querySelector('#caption');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });

      // const headerHeight = 70; // Height of your header
      // window.scrollBy(0, -headerHeight);
    }
  }

  updateTotalCount(reachedEnd: boolean, loadedSize: number) {
    if (this.reachedEnd) {
      return;
    }

    if (reachedEnd) {
      this.totalThreadsCount = loadedSize;
      this.reachedEnd = true;
    } else {
      if (loadedSize > this.totalThreadsCount * 0.8) {
        this.totalThreadsCount *= 2;
      }
    }
  }

  createThread() {
    this.dialog.open(CreateThreadComponent, {
      data: {
        parent: this.parent,
      }
    });
  }
}
