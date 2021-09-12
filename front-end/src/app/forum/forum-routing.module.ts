import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleDetailComponent } from './article/article-detail/article-detail.component';
import { ArticleResolverService } from './article/article-detail/article-resolver.service';
import { ArticleListComponent } from './article/article-list/article-list.component';
import { CreateThreadComponent } from './discussion/create-thread/create-thread.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { ThreadDetailComponent } from './discussion/thread-detail/thread-detail.component';
import { ThreadResolverService } from './discussion/thread-detail/thread-resolver.service';

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
    path: 'discussion/threads/:threadId',
    component: ThreadDetailComponent,
    resolve: { thread: ThreadResolverService },
  },
  {
    path: 'discussion/threads/:threadId/comments/:commentId',
    component: ThreadDetailComponent,
    resolve: { thread: ThreadResolverService },
  },
  {
    path: 'discussion/threads/:threadId/comments/:commentId/replies/:replyId',
    component: ThreadDetailComponent,
    resolve: { thread: ThreadResolverService },
  },
  {
    path: 'articles',
    component: ArticleListComponent,
  },
  {
    path: 'articles/:articleId',
    component: ArticleDetailComponent,
    resolve: { article: ArticleResolverService },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }
