import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { Article, ListArticlesRequest, ListArticlesResponse } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articles: Article[];

  constructor(
    private notificationService: NotificationService,
    private san11pkService: San11PlatformServiceService,
  ) { }

  ngOnInit(): void {
    this.loadArticle();
  }

  loadArticle() {
    this.san11pkService.listArticles(new ListArticlesRequest({
      parent: ''
    })).subscribe(
      (resp: ListArticlesResponse) => {
        this.articles = resp.articles;
      },
      error => {
        this.notificationService.warn(`Failed to list articles: ${error.statusMessage}`);
      }
    );
  }

}
