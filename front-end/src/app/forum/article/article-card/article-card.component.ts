import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { getFullUrl } from 'src/app/utils/resrouce_util';
import { getAge } from 'src/app/utils/time_util';
import { isAdmin, loadUser } from 'src/app/utils/user_util';
import { Article, GetUserRequest, ResourceState, User } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {
  @Input() article: Article;
  user: User;

  constructor(
    private notificationService: NotificationService,
    private san11pkService: San11PlatformServiceService,
  ) {
  }

  ngOnInit(): void {
    this.san11pkService.getUser(new GetUserRequest({
      name: `users/${this.article.authorId}`,
    })).subscribe(
      (resp: User) => {
        this.user = resp;
      }, 
      error => {
        this.notificationService.warn(`获取用户数据失败: ${error.statusMessage}`);
      }
    );
  }

  getArticleAge() {
    return getAge(this.article.createTime);
  }

  getUserAvatar(): string {
    return getFullUrl(this.user?.imageUrl);
  }

  getContentReview() {
    let plainText = this.getPlainText(this.article.content);
    return plainText;
  }

  getCoverImage(): string {
    let regexImageSrc = /<img src="(?<imageSrc>[a-zA-Z0-9\/\-_:\.]+)">/;
    let match = regexImageSrc.exec(this.article.content);
    if (match) {
      return match.groups.imageSrc;
    } else {
      return 'https://storage.googleapis.com/san11-resources/static/san11-cover.jpeg';
    }
  }

  getPlainText(strSrc: string): string {
    var resultStr = "";

    // Ignore the <p> tag if it is in very start of the text
    if(strSrc.indexOf('<p>') == 0)
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

    return  resultStr.replace( /<[^<|>]+?>/gi,'' );
}


isAdmin() {
  return isAdmin();
}

isAuthor() {
  return loadUser().userId === this.article.authorId;
}

getStatusName() {
  return ResourceState[this.article.state];
}

}
