import { Output, EventEmitter, Component, OnInit, Input, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Comment, User } from "../../../../../proto/san11-platform.pb";

import { San11PlatformServiceService } from "../../../../service/san11-platform-service.service";
import { NotificationService } from "../../../../common/notification.service";
import { getFullUrl } from '../../../../utils/resrouce_util';
import { Reply } from "../../../../../proto/san11-platform.pb";

import { increment } from '../../../../utils/number_util';



@Component({
  selector: 'app-reply-card',
  templateUrl: './reply-card.component.html',
  styleUrls: ['./reply-card.component.css']
})
export class ReplyCardComponent implements OnInit {
  @Input() reply: Reply;
  @Output() replyDeleteEvent = new EventEmitter();
  @Output() replyEvent = new EventEmitter();

  hideUserImage = true;
  userImage: string;
  user: User;

  hideControl = true;

  constructor(
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.san11pkService.getUser(this.reply.authorId).subscribe(
      user => {
        this.user = user;
        if (this.user.imageUrl != '') {
          this.userImage = getFullUrl(this.user.imageUrl);
        } else {
          this.userImage = '../../../../assets/images/zhuge.jpg';
        }
      },
      error => {
        console.log('Failed to load user ' + this.reply.authorId + ':' + error.statusMessage);

        this.userImage = '../../../../assets/images/zhuge.jpg';
      }
    );
  }

  onUpvote() {

    const reply = new Reply({
      replyId: this.reply.replyId,
      upvoteCount: increment(this.reply.upvoteCount)
    });
    this.san11pkService.updateReply(reply).subscribe(
      reply => {
        this.reply = reply;
      },
      error => {
        this.notificationService.warn(error.statusMessage);
      }
    );

  }

  onDeleteReply() {
    if (!confirm('确定要删除评论 ' + this.reply.text + ' 吗?')) {
      return;
    }
    this.san11pkService.deleteReply(this.reply.replyId).subscribe(
      empty => {
        this.notificationService.success('回复删除成功');
        this.replyDeleteEvent.emit();
      },
      error => {
        this.notificationService.warn('回复删除失败');
      }
    );
  }

  onUserClick() {
    this.router.navigate(['users', this.reply.authorId]);
  }

  onReply() {
    this.replyEvent.emit();
  }

  mouseEnter() {
    this.hideControl = false;
  }

  mouseLeave() {
    this.hideControl = true;
  }
}
