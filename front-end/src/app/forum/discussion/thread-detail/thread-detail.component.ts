import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common/notification.service';
import { MyUploadAdapter } from 'src/app/service/cke-upload-adapter';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { UploadService } from 'src/app/service/upload.service';
import { getFullUrl } from 'src/app/utils/resrouce_util';
import { getAge } from 'src/app/utils/time_util';
import { isAdmin, loadUser } from 'src/app/utils/user_util';
import { Comment, DeleteThreadRequest, FieldMask, GetUserRequest, ResourceState, Thread, UpdateThreadRequest, User } from 'src/proto/san11-platform.pb';

import * as Editor from "../../../common/components/ckeditor/ckeditor";

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

        this.san11pkService.getUser(new GetUserRequest({ userId: this.thread.authorId })).subscribe(
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
      }
    );
  }

  configDescEditor() {
    this.descEditor_data = this.thread.content;
    this.descEditor_disabled = !this.isAuthor();
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

  onDescEditorReady(event) {
    this.descEditor_element = event;
    event.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, this.san11pkService, this.uploadService, this.thread.name);
    };
  }

  onDescEditorChange(event) {
    this.descEditor_updated = true;
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

}
