import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { Article, GetArticleRequest } from 'src/proto/san11-platform.pb';

@Injectable({
  providedIn: 'root'
})
export class ArticleResolverService {

  constructor(
    private san11pkService: San11PlatformServiceService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Article> | Promise<Article> | Article {
    return this.san11pkService.getArticle(new GetArticleRequest({
      name: `articles/${route.params['articleId']}`
    }));
  }
}
