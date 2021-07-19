import { ViewChild, ElementRef, Input, Component, OnInit } from '@angular/core';
import { Package, Comment, Reply } from "../../../../proto/san11-platform.pb";

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
    if (this.package) {
      this.resourceOwnerId = this.package.authorId;
    }
    this.loadComments();
  }

  loadComments() {
    this.san11pkService.listComments(this.parent).subscribe(
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
      parent: this.parent,
      authorId: this.authorId,
      text: text,
    });
    this.san11pkService.createComment(comment).subscribe(
      comment => {
        this.notificationService.success('评论添加 成功!');
        this.comments.splice(0, 0, comment);
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
