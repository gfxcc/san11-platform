import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboards/dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { HomeComponent } from './home/home.component';
import { UserResolver } from "./home/user.resolver";
import { TimelineComponent } from "./timeline/timeline.component";
import { PublishedPackagesComponent } from './published-packages/published-packages.component';
import { ArticleListComponent } from '../forum/article/article-list/article-list.component';

const routes: Routes = [
  {
    path: 'users/:userId',
    component: HomeComponent,
    resolve: { user: UserResolver },
    children: [
      { path: '', redirectTo: 'publishedPackages', pathMatch: 'prefix' },
      {
        path: 'publishedPackages',
        component: DashboardComponent
      },
      {
        path: 'articles',
        component: ArticleListComponent,
      },
      {
        path: 'timeline',
        component: TimelineComponent
      },
      {
        path: 'accountInfo',
        component: AccountInfoComponent,
        resolve: { user: UserResolver },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
