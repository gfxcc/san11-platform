import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from '../forum/article/article-list/article-list.component';
import { DashboardComponent } from '../shared/components/dashboards/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { UserResolver } from "./home/user.resolver";
import { InboxComponent } from './inbox/inbox.component';
import { TimelineComponent } from "./timeline/timeline.component";

const routes: Routes = [
  {
    path: 'users/:userId',
    component: HomeComponent,
    resolve: { user: UserResolver },
    children: [
      { path: '', redirectTo: 'publishedPackages', pathMatch: 'prefix' },
      {
        path: 'publishedPackages',
        component: DashboardComponent,
      },
      {
        path: 'articles',
        component: ArticleListComponent,
      },
      {
        path: 'timeline',
        component: TimelineComponent,
      },
      {
        path: 'inbox',
        component: InboxComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
