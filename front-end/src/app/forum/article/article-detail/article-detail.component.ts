import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldMask } from '@ngx-grpc/well-known-types';
import { NotificationService } from 'src/app/common/notification.service';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
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

    if (this.isAuthor()) {
      this.articleSubjectElement.nativeElement.contentEditable = true;
    }

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
    if (!confirm(`确定要删除文章 ${this.article.subject} 吗？`)) {
      return;
    }
    this.san11pkService.deleteArticle(new DeleteArticleRequest({
      name: this.article.name
    })).subscribe(
      (resp: Article) => {
        this.notificationService.success('删除成功');
        this.router.navigate(['articles']);
      },
      error => {
        this.notificationService.warn(`删除失败: ${error.statusMessage}`);
      }
    );
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
    const updatedSubject = this.articleSubjectElement.nativeElement.innerHTML;

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


  // utils
  isAdmin() {
    return isAdmin();
  }

  isAuthor() {
    return this.article.authorId === loadUser().userId;
  }
}

