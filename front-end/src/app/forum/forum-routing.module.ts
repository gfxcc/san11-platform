import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleDetailComponent } from './article/article-detail/article-detail.component';
import { ArticleResolverService } from './article/article-detail/article-resolver.service';
import { ArticleListComponent } from './article/article-list/article-list.component';
import { CreateThreadComponent } from './discussion/create-thread/create-thread.component';
import { DiscussionComponent } from './discussion/discussion.component';

const routes: Routes = [
  {
    path: 'discussion',
    component: DiscussionComponent,
  },
  {
    path: 'discussion/create',
    component: CreateThreadComponent,
  },
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
