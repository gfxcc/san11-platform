import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldMask } from '@ngx-grpc/well-known-types';
import { GlobalConstants } from 'src/app/common/global-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { MyUploadAdapter } from 'src/app/service/cke-upload-adapter';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { UploadService } from 'src/app/service/upload.service';
import { getAge } from 'src/app/utils/time_util';
import { getUserUri, isAdmin, loadUser } from 'src/app/utils/user_util';
import { Article, DeleteArticleRequest, GetUserRequest, ListUsersRequest, ResourceState, UpdateArticleRequest, User } from 'src/proto/san11-platform.pb';
import * as Editor from "../../../common/components/ckeditor/ckeditor";

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  @ViewChild('articleSubjectElement') articleSubjectElement: ElementRef

  article: Article;
  user: User;


  descEditor = Editor;
  descEditor_data: string;
  descEditor_element;
  descEditor_updated = false;
  descEditor_disabled = true;
  descEditor_config;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private uploadService: UploadService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => {
        this.article = data.article;
        this.loadUser();
      }
    );

    this.configDescEditor();
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


  configDescEditor() {
    this.descEditor_data = this.article.content;
    this.descEditor_disabled = !this.isAuthor();
    this.descEditor_config = {
      placeholder: `
      ...起
      ...承
      ...转
      ...合
      `,
      toolbar: {
        items: [
          'heading',
          '|',
          'fontColor',
          'bold',
          'italic',
          'underline',
          'blockQuote',
          'code',
          'link',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
          'horizontalLine',
          '|',
          'outdent',
          'indent',
          'alignment',
          '|',
          'imageUpload', // comment out this function as current implement will cause performance issue 
          'codeBlock',
          'insertTable',
          'undo',
          'redo'
        ]
      },
      language: 'zh-cn',
      image: {
        toolbar: [
          'imageStyle:full',
          'imageStyle:side',
        ]
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableCellProperties',
          'tableProperties'
        ]
      },
      mention: {
        feeds: [
          {
            marker: '@',
            feed: this.getUsernameFeedItems.bind(this),
            minimumCharacters: 1,
          }
        ]
      },
      licenseKey: '',
    };
  }

  getUsernameFeedItems(queryText: string) {
    return this.san11pkService.listUsers(new ListUsersRequest({
      pageSize: GlobalConstants.usernameFeedPageSize.toString(),
      filter: `username = "*${queryText}*"`
    })).toPromise().then(function (result) {
      return result.users.map(
        (user: User) => ({
          id: `@${user.username}`,
          userId: user.userId,
          username: user.username,
          link: getUserUri(user),
        })
      );
    });
  }

  onDescEditorReady(event) {
    this.descEditor_element = event;
    event.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, this.san11pkService, this.uploadService, this.article.name);
    };
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
    const updateContent = this.descEditor_element.getData();
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

