import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldMask } from '@ngx-grpc/well-known-types';
import { NotificationService } from 'src/app/common/notification.service';
import { InteractionService } from 'src/app/common/interaction.service';
import { EditorService } from 'src/app/service/editor.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { UploadService } from 'src/app/service/upload.service';
import { getAge } from 'src/app/utils/time_util';
import { isAdmin, loadUser } from 'src/app/utils/user_util';
import { Article, DeleteArticleRequest, GetUserRequest, ResourceState, UpdateArticleRequest, User } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  @ViewChild('articleSubjectElement') articleSubjectElement: ElementRef

  article: Article;
  user: User;

  descEditor_updated = false;
  editing = false;
  editingTarget: 'title' | 'content' | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private interactionService: InteractionService,
    private uploadService: UploadService,
    public editorService: EditorService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => {
        this.article = data.article;
        this.loadUser();
      }
    );

    this.editorService.configEditor(!this.isAuthor(), this.article.name);
  }

  ngAfterViewInit(): void {

  }

  startEditing(focusTarget: 'title' | 'content' = 'title'): void {
    this.editing = true;
    this.editingTarget = focusTarget;
    this.editorService.setDisabled(false);
    this.articleSubjectElement.nativeElement.contentEditable = focusTarget === 'title' ? 'true' : 'false';

    if (focusTarget === 'title') {
      this.articleSubjectElement.nativeElement.focus();
      return;
    }

    setTimeout(() => this.editorService.focus());
  }

  onTitleClick(): void {
    if (!this.isAuthor()) {
      return;
    }
    this.startEditing('title');
  }

  onContentClick(): void {
    if (!this.isAuthor()) {
      return;
    }
    this.startEditing('content');
  }

  onTitleEnter(event: KeyboardEvent): void {
    if (!this.isAuthor()) {
      return;
    }

    event.preventDefault();
    if (!this.editing) {
      this.startEditing('title');
    }
  }

  onTitleChange(): void {
    if (this.editing) {
      this.descEditor_updated = true;
    }
  }

  cancelEditing(): void {
    this.editing = false;
    this.editingTarget = null;
    this.descEditor_updated = false;
    this.editorService.setDisabled(true);
    this.articleSubjectElement.nativeElement.contentEditable = 'false';
    this.articleSubjectElement.nativeElement.innerText = this.article.subject;
    this.editorService.setData(this.article.content);
  }

  @HostListener('document:keydown.meta.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (!this.descEditor_updated) {
      return;
    }
    // check if cmd+enter is pressed
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      // trigger button click event
      this.onUpdate();
    }
  }

  onDescEditorChange(event) {
    this.descEditor_updated = true;
  }

  loadUser() {
    this.san11pkService.getUser(new GetUserRequest({
      name: `users/${this.article.authorId}`,
    })).subscribe(
      (resp: User) => {
        this.user = resp;
      },
      error => {
        this.notificationService.warn(`获取用户失败: ${error.statusMessage}`);
      }
    );
  }

  onDelete() {
    this.interactionService.confirm({
      title: '删除文章',
      message: `确定要删除“${this.article.subject}”吗？此操作不可撤销。`,
      confirmText: '删除文章',
      danger: true,
    }).subscribe(confirmed => confirmed && this.san11pkService.deleteArticle(new DeleteArticleRequest({
      name: this.article.name
    })).subscribe(
      (resp: Article) => {
        this.notificationService.success('删除成功');
        this.router.navigate(['articles']);
      },
      error => {
        this.notificationService.warn(`删除失败: ${error.statusMessage}`);
      }
    ));
  }

  onFlipState() {
    const flippedState = this.article.state === ResourceState.NORMAL ? ResourceState.HIDDEN : ResourceState.NORMAL;
    this.san11pkService.updateArticle(new UpdateArticleRequest({
      article: new Article({
        name: this.article.name,
        state: flippedState,
      }),
      updateMask: new FieldMask({
        paths: ['state'],
      })
    })).subscribe(
      (resp: Article) => {
        this.article.state = flippedState;
        const stateText = flippedState === ResourceState.NORMAL ? '发布' : '隐藏';
        this.notificationService.success(`${stateText} 成功`);
      },
      error => {
        this.notificationService.warn(`更新状态失败: ${error.statusMessage}`);
      }
    );
  }

  onUpdate() {
    const updateContent = this.editorService.getData();
    const updatedSubject = this.articleSubjectElement.nativeElement.textContent?.trim() || this.article.subject;

    if (updateContent != undefined) {
      this.san11pkService.updateArticle(new UpdateArticleRequest({
        article: new Article({
          name: this.article.name,
          subject: updatedSubject,
          content: updateContent,
        }),
        updateMask: new FieldMask({
          paths: ['content', 'subject']
        })
      })).subscribe({
        next: (resp: Article) => {
          this.article = resp;
          this.editing = false;
          this.editingTarget = null;
          this.editorService.setDisabled(true);
          this.articleSubjectElement.nativeElement.contentEditable = 'false';
        },
        error: error => {
          this.notificationService.warn(`更新失败: ${error.statusMessage}`);
        },
        complete: () => {
          this.descEditor_updated = false;
          this.notificationService.success(`更新成功`);
        }
      });
    }
  }

  getArticleAge() {
    return getAge(this.article.createTime);
  }

  getArticleCreateTime() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this.article.createTime.toDate().toLocaleString("en-US", { timeZone: tz });
  }

  getArticleUpdateTime() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this.article.updateTime.toDate().toLocaleString("en-US", { timeZone: tz });
  }

  getArticleStatusLabel(): string {
    return this.getArticleStatus().label;
  }

  getArticleStatusIcon(): string {
    return this.getArticleStatus().icon;
  }

  getArticleStatusTone(): string {
    return this.getArticleStatus().tone;
  }

  getArticleStatusDescription(): string {
    return this.getArticleStatus().description;
  }

  private getArticleStatus() {
    switch (this.article?.state) {
      case ResourceState.NORMAL:
        return {
          label: '已发布',
          icon: 'visibility',
          tone: 'normal',
          description: '文章正在公开展示，所有用户都可以访问。',
        };
      case ResourceState.UNDER_REVIEW:
        return {
          label: '待审核',
          icon: 'hourglass_top',
          tone: 'review',
          description: '文章尚未公开，需要管理员处理。',
        };
      case ResourceState.HIDDEN:
        return {
          label: '已隐藏',
          icon: 'visibility_off',
          tone: 'hidden',
          description: '文章已停止公开展示，作者和管理员仍可访问。',
        };
      case ResourceState.SCHEDULED_DELETE:
        return {
          label: '待删除',
          icon: 'event_busy',
          tone: 'danger',
          description: '文章已进入删除流程，请谨慎处理。',
        };
      case ResourceState.DELETED:
        return {
          label: '已删除',
          icon: 'delete_outline',
          tone: 'danger',
          description: '文章已删除，不再面向普通用户展示。',
        };
      default:
        return {
          label: '未知状态',
          icon: 'help_outline',
          tone: 'hidden',
          description: '当前文章状态未明确标记。',
        };
    }
  }


  // utils
  isAdmin() {
    return isAdmin();
  }

  isAuthor() {
    return this.article.authorId === loadUser()?.userId;
  }
}
