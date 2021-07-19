import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleDetailComponent } from './article/article-detail/article-detail.component';
import { ArticleResolverService } from './article/article-detail/article-resolver.service';
import { ArticleListComponent } from './article/article-list/article-list.component';

const routes: Routes = [
  {
    path: 'articles',
    component: ArticleListComponent,
  },
  {
    path: 'articles/:articleId',
    component: ArticleDetailComponent,
    resolve: { article: ArticleResolverService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }
