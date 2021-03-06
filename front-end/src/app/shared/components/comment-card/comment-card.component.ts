import { Output, EventEmitter, Component, OnInit, Input, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Comment, CreateReplyRequest, DeleteCommentRequest, FieldMask, UpdateCommentRequest, User } from "../../../../proto/san11-platform.pb";

import { GetUserRequest } from "../../../../proto/san11-platform.pb";
import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { NotificationService } from "../../../common/notification.service";
import { getFullUrl } from '../../../utils/resrouce_util';
import { Reply } from "../../../../proto/san11-platform.pb";
import { isAdmin } from '../../../utils/user_util'

import { increment } from '../../../utils/number_util';
import { getAge } from 'src/app/utils/time_util';


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

  constructor(
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) {
    this.authorId = localStorage.getItem('userId');
    if (this.authorId != null) {
      const localAuthorImage = localStorage.getItem('userImageUrl');
      if (localAuthorImage === null) {
        this.san11pkService.getUser(new GetUserRequest({ userId: this.authorId })).subscribe(
          user => {
            this.authorImage = getFullUrl(user.imageUrl);
          },
          error => {
            this.authorImage = '../../../../assets/images/zhuge.jpg';
            this.notificationService.warn('????????????????????????: ' + error.statusMessage);
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
    this.san11pkService.getUser(new GetUserRequest({ userId: this.comment.authorId })).subscribe(
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
    if (!confirm('????????????????????? ' + this.comment.text + ' ????')) {
      return;
    }

    this.san11pkService.deleteComment(new DeleteCommentRequest({
      name: this.comment.name,
    })).subscribe(
      empty => {
        this.notificationService.success('???????????? ??????!');
        this.commentDeleteEvent.emit();
      },
      error => {
        this.notificationService.warn('???????????? ??????: ' + error.statusMessage);
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
      this.notificationService.warn('?????????');
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
        this.notificationService.success('???????????? ??????!');
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

  textAreaAdjust(textArea) {
    textArea.target.style.height = "0px";
    textArea.target.style.height = (textArea.target.scrollHeight + 25) + "px";
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
