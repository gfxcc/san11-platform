import { Output, EventEmitter, Component, OnInit, Input, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Comment, User } from "../../../../proto/san11-platform.pb";

import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { NotificationService } from "../../../common/notification.service";
import { getFullUrl } from '../../../utils/resrouce_util';
import { Reply } from "../../../../proto/san11-platform.pb";

import { increment } from '../../../utils/number_util';


@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent implements OnInit {
  @Input() comment: Comment;
  @Output() commentDeleteEvent = new EventEmitter();
  @ViewChild('replyInput') replyInputElement: ElementRef;

  hideUserImage = true;
  userImage: string;
  user: User;


  hideAuthorImage = true;
  authorImage: string;
  authorId: string;

  hideControl = true;
  hideReplies = true;
  hideReplyEnter = true;

  constructor(
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) {
    this.authorId = localStorage.getItem('userId');
    if (this.authorId != null) {
      const localAuthorImage = localStorage.getItem('userImageUrl');
      if (localAuthorImage === null) {
        this.san11pkService.getUser(this.authorId).subscribe(
          user => {
            this.authorImage = getFullUrl(user.imageUrl);
          },
          error => {
            this.authorImage = '../../../../assets/images/zhuge.jpg';
            this.notificationService.warn('获取用户数据失败: ' + error.statusMessage);
          }
        );
      } else {
        this.authorImage = getFullUrl(localAuthorImage);
      }
    } else {
      this.authorImage = '../../../../assets/images/zhuge.jpg';
    }

  }

  ngOnInit(): void {
    this.san11pkService.getUser(this.comment.authorId).subscribe(
      user => {
        this.user = user;
        this.userImage = getFullUrl(this.user.imageUrl);
      },
      error => {
        this.userImage = '../../../../assets/images/zhuge.jpg';
      }
    );
  }

  onUserClick() {
    this.router.navigate(['users', this.comment.authorId]);
  }

  onDeleteComment() {
    if (!confirm('确定要删除评论 ' + this.comment.text + ' 吗?')) {
      return;
    }

    this.san11pkService.deleteComment(this.comment.commentId).subscribe(
      empty => {
        this.notificationService.success('删除评论 成功!');
        this.commentDeleteEvent.emit();
      },
      error => {
        this.notificationService.warn('删除评论 失败: ' + error.statusMessage);
      }
    );

  }

  onUpvote() {

    const comment = new Comment({
      commentId: this.comment.commentId,
      upvoteCount: increment(this.comment.upvoteCount)
    });
    this.san11pkService.updateComment(comment).subscribe(
      commentResp => {
        this.comment = commentResp;
      },
      error => {
        this.notificationService.warn(error.statusMessage);
      }
    );

  }

  onReply() {
    this.hideReplyEnter = false;
    setTimeout(() => {
      this.replyInputElement.nativeElement.focus();
    });
  }

  onCancelReply() {
    this.hideReplyEnter = true;
  }

  onCreateReply(value) {
    if (this.authorId === null) {
      this.notificationService.warn('请登录');
      return;
    }
    const text = value.input;
    const reply = new Reply({
      commentId: this.comment.commentId,
      authorId: this.authorId,
      text: text,
    });
    this.san11pkService.createReply(reply).subscribe(
      reply => {
        this.notificationService.success('评论添加 成功!');
        this.comment.replies.push(reply);
      },
      error => {
        this.notificationService.warn('failed' + error.statusMessage);
      }
    );
  }

  onReplyDelete(event) {
    this.commentDeleteEvent.emit();
  }

  mouseEnter() {
    if (this.authorId != this.comment.authorId) {
      return;
    }
    this.hideControl = false;
  }

  mouseLeave() {
    if (this.authorId != this.comment.authorId) {
      return;
    }
    this.hideControl = true;
  }
}