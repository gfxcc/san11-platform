import { Output, EventEmitter, Component, OnInit, Input, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Comment, DeleteReplyRequest, FieldMask, UpdateReplyRequest, User } from "../../../../../proto/san11-platform.pb";

import { GetUserRequest } from "../../../../../proto/san11-platform.pb";
import { San11PlatformServiceService } from "../../../../service/san11-platform-service.service";
import { NotificationService } from "../../../../common/notification.service";
import { getFullUrl } from '../../../../utils/resrouce_util';
import { Reply } from "../../../../../proto/san11-platform.pb";
import { isAdmin } from "../../../../utils/user_util";

import { increment } from '../../../../utils/number_util';
import { getAge } from 'src/app/utils/time_util';



@Component({
  selector: 'app-reply-card',
  templateUrl: './reply-card.component.html',
  styleUrls: ['./reply-card.component.css']
})
export class ReplyCardComponent implements OnInit {
  @Input() reply: Reply;
  @Input() resourceOwnerId: string;
  @Output() replyDeleteEvent = new EventEmitter();
  @Output() replyEvent = new EventEmitter();

  hideUserImage = true;
  userImage: string;
  user: User;
  authorId: string;

  hideControl = true;

  constructor(
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) {
    this.authorId = localStorage.getItem('userId');
  }

  ngOnInit(): void {
    this.san11pkService.getUser(new GetUserRequest({ userId: this.reply.authorId })).subscribe(
      user => {
        this.user = user;
        this.userImage = getFullUrl(this.user.imageUrl);
      },
      error => {
        console.log('Failed to load user ' + this.reply.authorId + ':' + error.statusMessage);

        this.userImage = '../../../../assets/images/zhuge.jpg';
      }
    );
  }

  onUpvote() {

    const reply = new Reply({
      name: this.reply.name,
    });
    this.san11pkService.updateReply(new UpdateReplyRequest({
      reply: reply,
      updateMask: new FieldMask({
        paths: ['upvote_count']
      })
    })).subscribe(
      reply => {
        this.reply.upvoteCount = reply.upvoteCount;
      },
      error => {
        this.notificationService.warn(error.statusMessage);
      }
    );

  }

  onDeleteReply() {
    if (!confirm('????????????????????? ' + this.reply.text + ' ????')) {
      return;
    }
    this.san11pkService.deleteReply(new DeleteReplyRequest({
      name: this.reply.name,
    })).subscribe(
      empty => {
        this.notificationService.success('??????????????????');
        this.replyDeleteEvent.emit();
      },
      error => {
        this.notificationService.warn('??????????????????');
      }
    );
  }

  onUserClick() {
    this.router.navigate(['users', this.reply.authorId]);
  }

  onReply() {
    this.replyEvent.emit();
  }

  getReplyAge() {
    return getAge(this.reply.createTime);
  }

  mouseEnter() {
    if (!isAdmin() && this.authorId != this.reply.authorId) {
      return;
    }
    this.hideControl = false;
  }

  mouseLeave() {
    this.hideControl = true;
  }
}
