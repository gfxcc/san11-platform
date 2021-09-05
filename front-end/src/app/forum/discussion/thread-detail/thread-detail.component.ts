import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { UploadService } from 'src/app/service/upload.service';
import { Comment, FieldMask, Thread, UpdateThreadRequest } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.css']
})
export class ThreadDetailComponent implements OnInit {
  thread: Thread;

  rootComment: Comment;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private uploadService: UploadService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => {
        this.thread = data.thread;

        this.rootComment = new Comment({
          name: this.thread.name,
          text: this.thread.content,
          createTime: this.thread.createTime,
          updateTime: this.thread.updateTime,
          upvoteCount: this.thread.likeCount,
        })
      }
    );
  }

  togglePin() {
    this.san11pkService.updateThread(new UpdateThreadRequest({
      thread: new Thread({
        name: this.thread.name,
        pinned: !this.thread.pinned,
      }),
      updateMask: new FieldMask({
        paths: ['pinned']
      }),
    })).subscribe(
      (resp: Thread) => {
        this.notificationService.success('已置顶');
      },
      error => {
        this.notificationService.warn(`置顶失败 ${error.statusMessage}.`);
      }
    );
  }
}
