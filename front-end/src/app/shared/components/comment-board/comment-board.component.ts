import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, delay, finalize } from 'rxjs';
import { ProgressService } from 'src/app/progress.service';
import { EditorService } from 'src/app/service/editor.service';
import { UploadService } from 'src/app/service/upload.service';
import { signedIn } from 'src/app/utils/user_util';
import { environment } from 'src/environments/environment';
import { Comment, CreateCommentRequest, GetUserRequest, ListCommentsRequest, ListCommentsResponse, Package, User } from "../../../../proto/san11-platform.pb";
import { NotificationService } from "../../../common/notification.service";
import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { increment } from "../../../utils/number_util";

const demoLoadingDelayMs = environment.production ? 0 : 450;

@Component({
  selector: 'app-comment-board',
  templateUrl: './comment-board.component.html',
  styleUrls: ['./comment-board.component.css'],
  providers: [EditorService],
})
export class CommentBoardComponent implements OnInit {
  @Input() package: Package;
  @Input() parent: string;
  @Input() commentsOrder: string = 'create_time';
  @Input() disableInput = false;
  @Input() inputPlaceHolder = '输入评论';
  @Input() resourceOwnerId: string;

  @ViewChild('commentForm') commentFormElement: ElementRef

  hideAuthorImage = true;
  hideCommentEditor = true;

  authorId: string;
  authorImage: string;

  comments: Comment[] = [];
  commentCount: string;
  commentsPageSize = 50;
  hasMoreComments = false;
  isLoadingComments = false;
  commentSkeletonRows = Array.from({ length: 3 });

  sendCommentLoading = false;

  descEditor_data: string;
  descEditor_element;
  descEditor_onFocus = false;
  descEditor_updated = false;

  private destroy$ = new Subject<void>();

  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private uploadService: UploadService,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public editorService: EditorService,
    private progressService: ProgressService,
  ) {

    this.authorId = localStorage.getItem('userId');
    if (this.authorId != null) {
      const localAuthorImage = localStorage.getItem('userImageUrl');
      if (localAuthorImage === null) {
        this.san11pkService.getUser(new GetUserRequest({
          name: `users/${this.authorId}`,
        })).subscribe({
          next: (user: User) => {
            this.authorImage = user.imageUrl;
          },
          error: error => {
            this.notificationService.warn('获取用户数据失败: ' + error.statusMessage);
          }
        });
      } else {
        this.authorImage = localAuthorImage;
      }
    } else {
      this.authorImage = 'static/images/avatars/zhuge.jpeg';
    }

  }

  ngOnInit(): void {
    if (!signedIn()) {
      this.disableInput = true;
      this.inputPlaceHolder = '请登录';
    }

    if (this.package) {
      this.resourceOwnerId = this.package.authorId;
    }

    this.loadComments();
    this.editorService.configEditor(this.disableInput, this.parent, this.inputPlaceHolder);
    this.descEditor_data = this.disableInput ? this.inputPlaceHolder : '';
  }

  @HostListener('document:keydown.meta.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (!this.descEditor_onFocus || !this.descEditor_updated) {
      return;
    }
    // check if cmd+enter is pressed
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      // trigger button click event
      this.onCreateComment();
    }
  }

  scrollToFragment() {
    const fragment = this.activatedRoute.snapshot.fragment;
    if (fragment) {
      const targetElement = this.elementRef.nativeElement.querySelector(`#${fragment}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        targetElement.classList.add('highlighted');
      }
    }
  }

  onDescEditorChange(event) {
    this.descEditor_updated = true;
  }

  loadComments(order?: string, append = false) {
    if (this.isLoadingComments) {
      return;
    }

    const isOrderChange = !!order && order !== this.commentsOrder;
    if (order && !isOrderChange && !append) {
      return;
    }
    if (isOrderChange) {
      this.commentsOrder = order;
    }
    const watermark = append && !isOrderChange ? this.comments.length : 0;
    const requestedPageSize = this.commentsPageSize + 1;

    this.isLoadingComments = true;
    this.progressService.loading();
    this.san11pkService.listComments(new ListCommentsRequest({
      parent: this.parent,
      pageSize: requestedPageSize.toString(),
      pageToken: `{ "watermark": "${watermark}" }`,
      orderBy: this.commentsOrder,
    }))
      .pipe(delay(demoLoadingDelayMs), finalize(() => {
        this.isLoadingComments = false;
        this.progressService.complete();
      }))
      .subscribe({
        next: (resp: ListCommentsResponse) => {
          const loadedComments = resp.comments.slice(0, this.commentsPageSize);
          this.comments = append && !isOrderChange
            ? [...this.comments, ...loadedComments]
            : loadedComments;
          this.hasMoreComments = resp.comments.length > this.commentsPageSize;
          this.commentCount = this.computeCommentCount(this.comments);

          setTimeout(() => {
            this.scrollToFragment();
          }, 0);
        },
        error: error => {
          this.notificationService.warn('获取评论列表失败: ' + error.statusMessage);
        }
      });
  }

  selectCommentOrder(order: string): void {
    this.loadComments(order);
  }

  loadMoreComments(): void {
    this.loadComments(undefined, true);
  }

  computeCommentCount(comments: Comment[]): string {
    let cnt = comments.length;
    comments.forEach(comment => {
      cnt += comment.replies.length;
    });
    return cnt.toString();
  }

  onCreateComment() {
    if (this.authorId === null) {
      this.notificationService.warn('请登录');
      return;
    }
    if (this.editorService.getData() === '') {
      return;
    }
    this.sendCommentLoading = true;

    const text = this.editorService.getData();
    const comment = new Comment({
      text: text,
    });
    this.san11pkService.createComment(new CreateCommentRequest({
      parent: this.parent,
      comment: comment,
    })).subscribe({
      next: (comment: Comment) => {
        if (this.commentsOrder === 'create_time') {
          this.comments.push(comment);
        } else {
          this.comments.splice(0, 0, comment);
        }
        this.commentCount = increment(this.commentCount);
      },
      error: error => {
        this.notificationService.warn(`创建失败: ${error.statusMessage}`);
        this.sendCommentLoading = false;
      },
      complete: () => {
        this.notificationService.success('评论添加 成功!');
        this.editorService.setData('');
        this.descEditor_onFocus = false;
        this.descEditor_updated = false;
        this.sendCommentLoading = false;
      }
    });
  }

  onCancel() {
    this.editorService.setData('');
    this.hideCommentEditor = true;
  }

  onCommentDelete(event) {
    this.loadComments();
  }

  onReplyCreate(event) {
    this.commentCount = increment(this.commentCount);
  }

}
