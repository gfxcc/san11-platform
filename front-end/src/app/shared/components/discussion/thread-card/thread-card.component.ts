import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { getFullUrl } from 'src/app/utils/resrouce_util';
import { getAge } from 'src/app/utils/time_util';
import { isAdmin, loadUser } from 'src/app/utils/user_util';
import { GetUserRequest, ResourceState, Thread, User } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-thread-card',
  templateUrl: './thread-card.component.html',
  styleUrls: ['./thread-card.component.css']
})
export class ThreadCardComponent implements OnInit {
  @Input() thread: Thread;
  coverImage: string = null;
  user: User;
  latestCommenter: User;
  notMobile = !window.matchMedia('(max-width: 40rem)').matches;

  constructor(
    private notificationService: NotificationService,
    private san11pkService: San11PlatformServiceService,
  ) {
  }

  ngOnInit(): void {
    this.san11pkService.getUser(new GetUserRequest({
      name: `users/${this.thread.authorId}`,
    })).subscribe(
      (resp: User) => {
        this.user = resp;
      },
      error => {
        this.notificationService.warn(`获取用户数据失败: ${error.statusMessage}`);
      }
    );

    if (this.thread.latestCommenterId != '0') {
      this.san11pkService.getUser(new GetUserRequest({
        name: `users/${this.thread.latestCommenterId}`,
      })).subscribe(
        (resp: User) => {
          this.latestCommenter = resp;
        },
        error => {
          console.log(`Failed to get user info: ${error.statusMessage}`);
        }
      );
    }
  }

  getThreadAge() {
    return getAge(this.thread.createTime);
  }

  getLatestCommentedAge() {
    return getAge(this.thread.latestCommentedTime);
  }

  getLatestCommenterName() {

  }

  getUserAvatar(): string {
    return getFullUrl(this.user?.imageUrl);
  }

  getCoverImage(): string {
    if (this.coverImage) {
      return this.coverImage;
    }

    let regexImageSrc = /<img src="(?<imageSrc>[a-zA-Z0-9\/\-_:\.]+)">/;
    let match = regexImageSrc.exec(this.thread.content);
    if (match) {
      this.coverImage = match.groups.imageSrc;
    }
    return this.coverImage;
  }


  isAdmin() {
    return isAdmin();
  }

  isAuthor() {
    return loadUser().userId === this.thread.authorId;
  }

  getStatusName() {
    return ResourceState[this.thread.state];
  }

}
