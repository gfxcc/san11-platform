import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldMask } from '@ngx-grpc/well-known-types';
import { NotificationService } from 'src/app/common/notification.service';
import { MyUploadAdapter } from 'src/app/service/cke-upload-adapter';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { UploadService } from 'src/app/service/upload.service';
import { getPackageUrl } from 'src/app/utils/package_util';
import { getFullUrl } from 'src/app/utils/resrouce_util';
import { getAge } from 'src/app/utils/time_util';
import { isAdmin, loadUser } from 'src/app/utils/user_util';
import { Article, DeleteArticleRequest, GetUserRequest, ResourceState, UpdateArticleRequest, User } from 'src/proto/san11-platform.pb';
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

  configDescEditor() {
    this.descEditor_data = this.article.content;
    this.descEditor_disabled = !this.isAuthor();
    this.descEditor_config = {
      placeholder: `
      ...???
      ...???
      ...???
      ...???
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
      // mention: {
      //   feeds: [
      //     {
      //       marker: '@',
      //       feed: this.getUsernameFeedItems.bind(this),
      //       minimumCharacters: 1,
      //     }
      //   ]
      // },
      licenseKey: '',
    };
  }

  getUserAvatar(): string {
    return getFullUrl(this.user?.imageUrl);
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
      userId: this.article.authorId
    })).subscribe(
      (resp: User) => {
        this.user = resp;
      },
      error => {
        this.notificationService.warn(`??????????????????: ${error.statusMessage}`);
      }
    );
  }
   
  onDelete() {
    if (!confirm(`????????????????????? ${this.article.subject} ??????`)) {
      return;
    }
    this.san11pkService.deleteArticle(new DeleteArticleRequest({
      name: this.article.name
    })).subscribe(
      (resp: Article) => {
        this.notificationService.success('????????????');
        this.router.navigate(['articles']);
      },
      error => {
        this.notificationService.warn(`????????????: ${error.statusMessage}`);
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
        const stateText = flippedState === ResourceState.NORMAL ? '??????' : '??????';
        this.notificationService.success(`${stateText} ??????`);
      },
      error => {
        this.notificationService.warn(`??????????????????: ${error.statusMessage}`);
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
      })).subscribe(
        (resp: Article) => {
          this.article = resp;
          this.notificationService.success(`????????????`);
        },
        error => {
          this.notificationService.warn(`????????????: ${error.statusMessage}`);
        }
      );
    }
  }

  getArticleAge() {
    return getAge(this.article.createTime);
  }

  getArticleCreateTime() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this.article.createTime.toDate().toLocaleString("en-US", {timeZone: tz});
  }

  
  // utils
  isAdmin() {
    return isAdmin();
  }

  isAuthor() {
    return this.article.authorId === loadUser().userId;
  }
}

