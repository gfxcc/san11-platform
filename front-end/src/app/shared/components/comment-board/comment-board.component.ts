import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { MyUploadAdapter } from 'src/app/service/cke-upload-adapter';
import { UploadService } from 'src/app/service/upload.service';
import { getUserUri, signedIn } from 'src/app/utils/user_util';
import { Comment, CreateCommentRequest, GetUserRequest, ListCommentsRequest, ListCommentsResponse, ListUsersRequest, Package, User } from "../../../../proto/san11-platform.pb";
import * as Editor from "../../../common/components/ckeditor/ckeditor";
import { NotificationService } from "../../../common/notification.service";
import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { increment } from "../../../utils/number_util";


@Component({
  selector: 'app-comment-board',
  templateUrl: './comment-board.component.html',
  styleUrls: ['./comment-board.component.css']
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

  sendCommentLoading = false;

  descEditor = Editor;
  descEditor_data: string;
  descEditor_element;
  descEditor_updated = false;
  descEditor_disabled = true;
  descEditor_config;
  descEditor_onFocus = false;
  userFeeds;

  private destroy$ = new Subject<void>();

  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private uploadService: UploadService,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private renderer: Renderer2,
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
    this.configDescEditor();
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
        this.renderer.setProperty(targetElement, 'scrollTop', 0);
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        targetElement.classList.add('highlighted');
      }
    }
  }

  configDescEditor() {
    this.descEditor_data = this.disableInput ? this.inputPlaceHolder : '';
    this.descEditor_disabled = this.disableInput;
    this.descEditor_config = {
      placeholder: this.inputPlaceHolder,
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
          },
          // {
          //   marker: '#',
          //   feed: [
          //     '#american', '#asian', '#baking', '#breakfast', '#cake', '#caribbean',
          //     '#chinese', '#chocolate', '#cooking', '#dairy', '#delicious', '#delish',
          //     '#dessert', '#desserts', '#dinner', '#eat', '#eating', '#eggs', '#fish',
          //     '#food', '#foodgasm', '#foodie', '#foodporn', '#foods', '#french', '#fresh',
          //     '#fusion', '#glutenfree', '#greek', '#grilling', '#halal', '#homemade',
          //     '#hot', '#hungry', '#icecream', '#indian', '#italian', '#japanese', '#keto',
          //     '#korean', '#lactosefree', '#lunch', '#meat', '#mediterranean', '#mexican',
          //     '#moroccan', '#nom', '#nomnom', '#paleo', '#poultry', '#snack', '#spanish',
          //     '#sugarfree', '#sweet', '#sweettooth', '#tasty', '#thai', '#vegan',
          //     '#vegetarian', '#vietnamese', '#yum', '#yummy'
          //   ]
          // }
        ]
      },
      licenseKey: '',
    };
  }
  onDescEditorReady(event) {
    this.descEditor_element = event;
    event.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, this.san11pkService, this.uploadService, this.parent);
    };
  }


  onDescEditorChange(event) {
    this.descEditor_updated = true;
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

  MentionCustomization(editor) {
    // The upcast converter will convert view <a class="mention" href="" data-user-id="">
    // elements to the model 'mention' text attribute.
    editor.conversion.for('upcast').elementToAttribute({
      view: {
        name: 'a',
        key: 'data-mention',
        classes: 'mention',
        attributes: {
          href: true,
          'data-user-id': true
        }
      },
      model: {
        key: 'mention',
        value: viewItem => {
          // The mention feature expects that the mention attribute value
          // in the model is a plain object with a set of additional attributes.
          // In order to create a proper object use the toMentionAttribute() helper method:
          const mentionAttribute = editor.plugins.get('Mention').toMentionAttribute(viewItem, {
            // Add any other properties that you need.
            link: viewItem.getAttribute('href'),
            userId: viewItem.getAttribute('data-user-id')
          });

          return mentionAttribute;
        }
      },
      converterPriority: 'high'
    });
  }


  loadComments(order?: string) {
    if (order === this.commentsOrder) {
      return;
    }
    // Set order if it is specified.
    if (order) {
      this.commentsOrder = order;
    }

    this.san11pkService.listComments(new ListCommentsRequest({
      parent: this.parent,
      orderBy: this.commentsOrder,
    })).subscribe({
      next: (resp: ListCommentsResponse) => {
        this.comments = resp.comments;
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
    this.sendCommentLoading = true;

    const text = this.descEditor_element.getData();
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
        this.descEditor_element.setData('');
        this.descEditor_onFocus = false;
        this.sendCommentLoading = false;
      }
    });
  }

  onCancel() {
    this.descEditor_element.setData('');
    this.hideCommentEditor = true;
  }

  onCommentDelete(event) {
    this.loadComments();
  }

  onReplyCreate(event) {
    this.commentCount = increment(this.commentCount);
  }

}
