import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { getAge } from 'src/app/utils/time_util';
import { Comment, CreateReplyRequest, DeleteCommentRequest, FieldMask, GetUserRequest, Reply, UpdateCommentRequest, User } from "../../../../proto/san11-platform.pb";
import * as Editor from "../../../common/components/ckeditor/ckeditor";
import { NotificationService } from "../../../common/notification.service";
import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { getFullUrl } from '../../../utils/resrouce_util';
import { isAdmin } from '../../../utils/user_util';





@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent implements OnInit {
  @Input() comment: Comment;
  @Input() resourceOwnerId: string;
  @Output() commentDeleteEvent = new EventEmitter();
  @Output() replyCreateEvent = new EventEmitter();
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

  descEditor = Editor;

  constructor(
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) {
    this.authorId = localStorage.getItem('userId');
    if (this.authorId != null) {
      const localAuthorImage = localStorage.getItem('userImageUrl');
      if (localAuthorImage === null) {
        this.san11pkService.getUser(new GetUserRequest({
          name: `users/${this.authorId}`,
        })).subscribe(
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
    this.san11pkService.getUser(new GetUserRequest({
      name: `users/${this.comment.authorId}`,
    })).subscribe(
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

    this.san11pkService.deleteComment(new DeleteCommentRequest({
      name: this.comment.name,
    })).subscribe(
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
      // commentId: this.comment.commentId,
      name: this.comment.name,
    });
    this.san11pkService.updateComment(new UpdateCommentRequest({
      comment: comment,
      updateMask: new FieldMask({
        paths: ['upvote_count'],
      }),
    })).subscribe(
      commentResp => {
        this.comment.upvoteCount = commentResp.upvoteCount;
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
      text: text,
    });
    this.san11pkService.createReply(new CreateReplyRequest({
      parent: this.comment.name,
      reply: reply,
    })).subscribe(
      reply => {
        this.notificationService.success('评论添加 成功!');
        this.hideReplyEnter = true;
        this.comment.replies.push(reply);
        this.replyCreateEvent.emit();
      },
      error => {
        this.notificationService.warn('failed' + error.statusMessage);
      }
    );
  }

  getCommentAge() {
    return getAge(this.comment.createTime);
  }

  onReplyDelete(event) {
    this.commentDeleteEvent.emit();
  }

  mouseEnter() {
    if (!isAdmin() && this.authorId != this.comment.authorId) {
      return;
    }
    this.hideControl = false;
  }

  mouseLeave() {
    this.hideControl = true;
  }
}
