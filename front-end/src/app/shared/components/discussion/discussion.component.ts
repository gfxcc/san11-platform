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
  totalThreadsCount = this.pageSize;
  pageIndex = 0;
  isLoading = false;
  private pageTokens: Array<string | undefined> = [''];

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private dialog: MatDialog,
    public san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    public progressService: ProgressService,
  ) { }

  ngOnInit() {
    this.loadThreads(0, false);
  }

  changePage(event: PageEvent) {
    this.loadThreads(event.pageIndex, true);
  }

  loadThreads(pageIndex: number, shouldScrollToTop = true) {
    const pageToken = this.pageTokens[pageIndex];
    if (pageToken === undefined) {
      return;
    }

    this.isLoading = true;
    this.progressService.loading();
    const request = new ListThreadsRequest({
      parent: this.parent,
      pageSize: this.pageSize.toString(),
      pageToken,
    })
    this.san11pkService.listThreads(request)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.progressService.complete();
      }))
      .subscribe({
        next: (resp: ListThreadsResponse) => {
          this.pageIndex = pageIndex;
          this.threads = resp.threads;
          this.pageTokens[pageIndex + 1] = resp.nextPageToken || undefined;
          if (shouldScrollToTop) {
            this.scrollToTop();
          }
          this.updateTotalCount(pageIndex, this.threads.length, !!resp.nextPageToken);
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

  updateTotalCount(pageIndex: number, loadedSize: number, hasMore: boolean) {
    const loadedThrough = pageIndex * this.pageSize + loadedSize;
    this.totalThreadsCount = hasMore
      ? Math.max(this.totalThreadsCount, loadedThrough + 1)
      : loadedThrough;
  }

  createThread() {
    this.dialog.open(CreateThreadComponent, {
      panelClass: 'app-responsive-dialog',
      data: {
        parent: this.parent,
      }
    });
  }
}
