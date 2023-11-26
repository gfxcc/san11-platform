import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common/notification.service';
import { EditorService } from 'src/app/service/editor.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { UploadService } from 'src/app/service/upload.service';
import { getAge } from 'src/app/utils/time_util';
import { isAdmin, loadUser } from 'src/app/utils/user_util';
import { Comment, DeleteThreadRequest, FieldMask, GetUserRequest, ResourceState, Thread, UpdateThreadRequest, User } from 'src/proto/san11-platform.pb';

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

  hideUserImage: boolean = true;

  rootComment: Comment;

  descEditor_updated = false;
  descEditor_onFocus = false;

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private uploadService: UploadService,
    public editorService: EditorService,
  ) { }

  ngOnInit(): void {
    // TODO: use resolver to load data
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
        })).subscribe({
          next: (user: User) => {
            this.user = user;
          },
          error: error => {
            this.notificationService.warn('获取用户数据失败: ' + error.statusMessage);
          }
        });

        this.editorService.configEditor(!this.isAuthor(), this.thread.name);
        this.configTags();
      }
    );
  }

  @HostListener('document:keydown.meta.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (!this.descEditor_onFocus || !this.descEditor_updated) {
      return;
    }
    // check if cmd+enter is pressed
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      // trigger button click event
      this.onUpdate();
    }
  }

  configTags() {
    this.removable = this.isAdmin() || this.isAuthor();
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
    const updateContent = this.editorService.getData();

    if (updateContent != undefined) {
      this.san11pkService.updateThread(new UpdateThreadRequest({
        thread: new Thread({
          name: this.thread.name,
          content: updateContent,
        }),
        updateMask: new FieldMask({
          paths: ['content']
        })
      })).subscribe({
        next: (resp: Thread) => {
          this.thread = resp;
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
