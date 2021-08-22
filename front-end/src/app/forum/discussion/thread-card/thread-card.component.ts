import { Component, Input, OnInit, Optional } from '@angular/core';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { getFullUrl } from 'src/app/utils/resrouce_util';
import { getAge } from 'src/app/utils/time_util';
import { loadUser } from 'src/app/utils/user_util';
import { Thread, GetUserRequest, Package, ResourceState, User } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-thread-card',
  templateUrl: './thread-card.component.html',
  styleUrls: ['./thread-card.component.css']
})
export class ThreadCardComponent implements OnInit {

  @Input() thread: Thread;
  coverImage: string = null;
  user: User;

  constructor(
    private notificationService: NotificationService,
    private san11pkService: San11PlatformServiceService,
  ) {
  }

  ngOnInit(): void {
    this.san11pkService.getUser(new GetUserRequest({
      userId: this.thread.authorId
    })).subscribe(
      (resp: User) => {
        this.user = resp;
      },
      error => {
        this.notificationService.warn(`获取用户数据失败: ${error.statusMessage}`);
      }
    );
  }

  getThreadAge() {
    return getAge(this.thread.createTime);
  }

  getUserAvatar(): string {
    return getFullUrl(this.user?.imageUrl);
  }

  getContentReview() {
    let plainText = this.getPlainText(this.thread.content);
    return plainText;
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

  getPlainText(strSrc: string): string {
    var resultStr = "";

    // Ignore the <p> tag if it is in very start of the text
    if (strSrc.indexOf('<p>') == 0)
      resultStr = strSrc.substring(3);
    else
      resultStr = strSrc;

    // Replace <p> with two newlines
    resultStr = resultStr.replace(/<p>/gi, "\r\n\r\n");
    // Replace <br /> with one newline
    resultStr = resultStr.replace(/<br \/>/gi, "\r\n");
    resultStr = resultStr.replace(/<br>/gi, "\r\n");

    //-+-+-+-+-+-+-+-+-+-+-+
    // Strip off other HTML tags.
    //-+-+-+-+-+-+-+-+-+-+-+

    return resultStr.replace(/<[^<|>]+?>/gi, '');
  }


  isAdmin() {
    return loadUser().userType === 'admin';
  }

  isAuthor() {
    return loadUser().userId === this.thread.authorId;
  }

  getStatusName() {
    return ResourceState[this.thread.state];
  }
}
