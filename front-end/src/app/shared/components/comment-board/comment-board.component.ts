import { ViewChild, ElementRef, Input, Component, OnInit } from '@angular/core';
import { Package, Comment, Reply, CreateCommentRequest, ListCommentsRequest } from "../../../../proto/san11-platform.pb";

import { GetUserRequest } from "../../../../proto/san11-platform.pb";
import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { NotificationService } from "../../../common/notification.service";
import { getFullUrl } from "../../../utils/resrouce_util";
import { getPackageUrl } from '../../../utils/package_util';
import { decrement, increment } from "../../../utils/number_util";


@Component({
  selector: 'app-comment-board',
  templateUrl: './comment-board.component.html',
  styleUrls: ['./comment-board.component.css']
})
export class CommentBoardComponent implements OnInit {
  @Input() package: Package;
  @Input() parent: string;
  @Input() commentsOrder: string;
  @Input() inputPlaceHolder = '输入评论';
  @Input() disableInput = false;

  @ViewChild('commentForm') commentFormElement: ElementRef

  hideAuthorImage = true;

  authorId: string;
  authorImage: string;

  comments: Comment[] = [];
  commentCount: string;

  resourceOwnerId: string;

  constructor(
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
            this.authorImage = '../../../assets/images/zhuge.jpg';
            this.notificationService.warn('获取用户数据失败: ' + error.statusMessage);
          }
        );
      } else {
        this.authorImage = getFullUrl(localAuthorImage);
      }
    } else {
      this.authorImage = '../../../assets/images/zhuge.jpg';
    }

  }

  ngOnInit(): void {
    if (this.inputPlaceHolder)
    if (this.package) {
      this.resourceOwnerId = this.package.authorId;
    }
    this.loadComments();
  }

  loadComments() {
    this.san11pkService.listComments(new ListCommentsRequest({
      parent: this.parent,
      orderBy: this.commentsOrder ? this.commentsOrder : 'create_time desc',
    })).subscribe(
      resp => {
        this.comments = resp.comments;
        this.commentCount = this.computeCommentCount(this.comments);
      },
      error => {
        this.notificationService.warn('获取评论列表失败: ' + error.statusMessage);
      }
    );
  }

  computeCommentCount(comments: Comment[]): string {
    let cnt = comments.length;
    comments.forEach(comment => {
      cnt += comment.replies.length;
    });
    return cnt.toString();
  }

  onCreateComment(value) {
    if (this.authorId === null) {
      this.notificationService.warn('请登录');
      return;
    }
    const text = value.input;

    const comment = new Comment({
      text: text,
    });
    this.san11pkService.createComment(new CreateCommentRequest({
      parent: this.parent,
      comment: comment,
    })).subscribe(
      comment => {
        this.notificationService.success('评论添加 成功!');
        if (this.commentsOrder) {
          this.comments.push(comment);
        } else {
          this.comments.splice(0, 0, comment);
        }
        this.commentCount = increment(this.commentCount);
      },
      error => {
        this.notificationService.warn('failed' + error.statusMessage);
      }
    );
  }


  textAreaAdjust(textArea) {
    textArea.target.style.height = "0px";
    textArea.target.style.height = (textArea.target.scrollHeight + 25) + "px";
  }

  onCommentDelete(event) {
    this.loadComments();
  }

  onReplyCreate(event) {
    this.commentCount = increment(this.commentCount);
  }
}
