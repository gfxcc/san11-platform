import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { getAge } from 'src/app/utils/time_util';
import { DeleteReplyRequest, GetUserRequest, Reply, User } from "../../../../../proto/san11-platform.pb";
import { NotificationService } from "../../../../common/notification.service";
import { San11PlatformServiceService } from "../../../../service/san11-platform-service.service";
import { isAdmin } from "../../../../utils/user_util";





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
    this.san11pkService.getUser(new GetUserRequest({
      name: `users/${this.reply.authorId}`,
    })).subscribe(
      user => {
        this.user = user;
      },
      error => {
      }
    );
  }

  onDeleteReply() {
    if (!confirm('确定要删除评论 ' + this.reply.text + ' 吗?')) {
      return;
    }
    this.san11pkService.deleteReply(new DeleteReplyRequest({
      name: this.reply.name,
    })).subscribe(
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
    this.replyEvent.emit('@' + this.user.username + ': ');
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
