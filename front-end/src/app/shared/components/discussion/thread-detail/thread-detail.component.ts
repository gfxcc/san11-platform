import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common/notification.service';
import { MyUploadAdapter } from 'src/app/service/cke-upload-adapter';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { UploadService } from 'src/app/service/upload.service';
import { getFullUrl } from 'src/app/utils/resrouce_util';
import { getAge } from 'src/app/utils/time_util';
import { getUserUrl, isAdmin, loadUser } from 'src/app/utils/user_util';
import { Comment, DeleteThreadRequest, FieldMask, GetUserRequest, ResourceState, Thread, UpdateThreadRequest, User } from 'src/proto/san11-platform.pb';
import * as Editor from "../../../../common/components/ckeditor/ckeditor";



export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.css']
})
export class ThreadDetailComponent implements OnInit {
  thread: Thread;
  user: User;

  userImage: string;
  hideUserImage: boolean = true;

  rootComment: Comment;


  descEditor = Editor;
  descEditor_data: string;
  descEditor_element;
  descEditor_updated = false;
  descEditor_disabled = true;
  descEditor_config;
  userFeeds;

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
  ];


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
        this.thread = data.thread;

        this.rootComment = new Comment({
          name: this.thread.name,
          text: this.thread.content,
          createTime: this.thread.createTime,
          updateTime: this.thread.updateTime,
          upvoteCount: this.thread.likeCount,
        })

        this.san11pkService.getUser(new GetUserRequest({
          name: `users/${this.thread.authorId}`,
        })).subscribe(
          user => {
            this.userImage = getFullUrl(user.imageUrl);
            this.user = user;
          },
          error => {
            this.userImage = '../../../../assets/images/zhuge.jpg';
            this.notificationService.warn('获取用户数据失败: ' + error.statusMessage);
          }
        );

        this.configDescEditor();
        this.configTags();
      }
    );
  }

  configTags() {
    this.removable = this.isAdmin() || this.isAuthor();
  }

  configDescEditor() {
    this.descEditor_data = this.thread.content;
    this.descEditor_disabled = !this.isAuthor();
    if (!this.descEditor_disabled) {
      this.preloadUserFeeds();
    }
    this.descEditor_config = {
      placeholder: `
      ...编辑帖子
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

  onDescEditorReady(event) {
    this.descEditor_element = event;
    event.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, this.san11pkService, this.uploadService, this.thread.name);
    };
  }

  onDescEditorChange(event) {
    this.descEditor_updated = true;
  }

  preloadUserFeeds() {
    this.san11pkService.listUsers().subscribe(
      resp => {
        this.userFeeds = resp.users.map((user: User) => ({
          id: `@${user.username}`,
          userId: user.userId,
          username: user.username,
          link: getUserUrl(user),
          userAvatar: getFullUrl(user.imageUrl)
        }));
      },
      error => {
        console.log('Failed to load user feeds');
      }
    );
  }

  getUsernameFeedItems(queryText: string) {
    return new Promise(resolve => {
      setTimeout(() => {
        const itemsToDisplay = this.userFeeds
          // Filter out the full list of all items to only those matching the query text.
          .filter(isItemMatching)
          // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
          .slice(0, 10);

        resolve(itemsToDisplay);
      }, 100);
    });

    function isItemMatching(item) {
      // Make the search case-insensitive.
      const searchString = queryText.toLowerCase();

      // Include an item in the search results if the name or username includes the current user input.
      return (
        item.username.toLowerCase().includes(searchString) ||
        item.userId.toLowerCase().includes(searchString)
      );
    }
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


  togglePin() {
    this.san11pkService.updateThread(new UpdateThreadRequest({
      thread: new Thread({
        name: this.thread.name,
        pinned: !this.thread.pinned,
      }),
      updateMask: new FieldMask({
        paths: ['pinned']
      }),
    })).subscribe(
      (resp: Thread) => {
        this.notificationService.success(resp.pinned ? '已置顶' : '已取消置顶');
        this.thread = resp;
      },
      error => {
        this.notificationService.warn(`置顶失败 ${error.statusMessage}.`);
      }
    );
  }

  getAge() {
    return getAge(this.thread.createTime);
  }

  onDelete() {
    if (!confirm(`确定要删除 ${this.thread.subject} 吗？`)) {
      return;
    }

    this.san11pkService.deleteThread(new DeleteThreadRequest({
      name: this.thread.name
    })).subscribe(
      (resp: Thread) => {
        this.notificationService.success('删除成功');
        this.router.navigate(['discussion']);
      },
      error => {
        this.notificationService.warn(`删除失败: ${error.statusMessage}`);
      }
    );
  }

  onFlipState() {
    const flippedState = this.thread.state === ResourceState.NORMAL ? ResourceState.HIDDEN : ResourceState.NORMAL;
    this.san11pkService.updateThread(new UpdateThreadRequest({
      thread: new Thread({
        name: this.thread.name,
        state: flippedState,
      }),
      updateMask: new FieldMask({
        paths: ['state'],
      })
    })).subscribe(
      (resp: Thread) => {
        this.thread.state = flippedState;
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

    if (updateContent != undefined) {
      this.san11pkService.updateThread(new UpdateThreadRequest({
        thread: new Thread({
          name: this.thread.name,
          content: updateContent,
        }),
        updateMask: new FieldMask({
          paths: ['content']
        })
      })).subscribe(
        (resp: Thread) => {
          this.thread = resp;
          this.notificationService.success(`更新成功`);
        },
        error => {
          this.notificationService.warn(`更新失败: ${error.statusMessage}`);
        }
      );
    }
  }

  // utils
  isAdmin() {
    return isAdmin();
  }

  isAuthor() {
    return this.thread.authorId === loadUser().userId;
  }

  isDiscussionAdmin() {
    return false;
    // let namePattern = /.*\/(?<packageId>[0-9]+)\/threads\/.+/;
    // const match = this.thread.name.match(namePattern);
    // if (!match) {
    //   return false;
    // }
    // this.san11pkService.getPackage(match[1]).subscribe(
    //   (resp: Package) => {
    //     if (resp.authorId === loadUser().userId) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   },
    //   (error) => {
    //     return false;
    //   }
    // );
  }

  // chips
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (!value) {
      return;
    }

    // Add our fruit
    this.san11pkService.updateThread(new UpdateThreadRequest({
      thread: new Thread({
        name: this.thread.name,
        tags: this.thread.tags.concat(value),
      }),
      updateMask: new FieldMask({ paths: ['tags'] }),
    })).subscribe(
      (thread: Thread) => {
        this.thread.tags = thread.tags;
      },
      error => {
        this.notificationService.warn(`更新标签失败: ${error.statusMessage}`);
      }
    );

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.thread.tags.indexOf(tag);
    if (index < 0) {
      return;
    }

    let updated_tags = Array.from(this.thread.tags);
    updated_tags.splice(index, 1);
    this.san11pkService.updateThread(new UpdateThreadRequest({
      thread: new Thread({
        name: this.thread.name,
        tags: updated_tags,
      }),
      updateMask: new FieldMask({ paths: ['tags'] }),
    })).subscribe(
      (thread: Thread) => {
        this.thread.tags = thread.tags;
      },
      error => {
        this.notificationService.warn(`更新标签失败: ${error.statusMessage}`);
      }
    );
  }

}
