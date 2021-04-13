import { ViewChild, ElementRef, Input, Component, OnInit } from '@angular/core';
import { Package, Comment, Reply } from "../../../../proto/san11-platform.pb";

import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { NotificationService } from "../../../common/notification.service";
import { getFullUrl } from "../../../utils/resrouce_util";
import { getPackageUrl } from '../../../utils/package_util';


@Component({
  selector: 'app-comment-board',
  templateUrl: './comment-board.component.html',
  styleUrls: ['./comment-board.component.css']
})
export class CommentBoardComponent implements OnInit {
  @Input() package: Package;

  @ViewChild('commentForm') commentFormElement: ElementRef

  hideAuthorImage = true;

  authorId: string;
  authorImage: string;

  comments: Comment[] = [];
  commentCount: string;

  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) {

    this.authorId = localStorage.getItem('userId');
    if (this.authorId != null) {
      const localAuthorImage = localStorage.getItem('userImageUrl');
      console.log('hi');
      console.log(localAuthorImage);
      if (localAuthorImage === null) {
        this.san11pkService.getUser(this.authorId).subscribe(
          user => {
            console.log(user.imageUrl);
            if (user.imageUrl === '') {
              this.authorImage = '../../../assets/images/zhuge.jpg';
            } else {
              this.authorImage = getFullUrl(user.imageUrl);
            }
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

    this.loadComments();
  }

  loadComments() {
    this.san11pkService.listComments(getPackageUrl(this.package)).subscribe(
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
      packageId: this.package.packageId,
      authorId: this.authorId,
      text: text,
    });
    this.san11pkService.createComment(comment).subscribe(
      comment => {
        this.notificationService.success('评论添加 成功!');
        this.comments.splice(0, 0, comment);
      },
      error => {
        this.notificationService.warn('failed' + error.statusMessage);
      }
    );
  }

  onCommentDelete(event) {
    console.log('in onCommentDelete');
    this.loadComments();
  }
}
