import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './account-management/register/register.component';
import { SigninComponent } from './account-management/signin/signin.component';
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
import { MessageBoardComponent } from "./dashboards/message-board/message-board.component";
import { PackageDetailComponent } from "./package-management/package-detail/package-detail.component";
import { PackageResolverService } from "./package-management/package-detail/package-resolver.service";
import { CreateNewComponent } from './shared/components/create-new/create-new.component';
import { ThreadDetailComponent } from './shared/components/discussion/thread-detail/thread-detail.component';
import { ThreadResolverService } from './shared/components/discussion/thread-detail/thread-resolver.service';
import { AdminMessageBoardComponent } from './website-management/admin-message-board/admin-message-board.component';





const routes: Routes = [
  { path: '', redirectTo: '/categories/1', pathMatch: 'full' },

  { path: 'search', component: DashboardComponent },

  { path: 'signin', component: SigninComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'createNew', component: CreateNewComponent },
  {
    path: 'categories/:categoryId/packages/:packageId',
    component: PackageDetailComponent,
    resolve: { package: PackageResolverService }
  },
  {
    path: 'categories/:categoryId/packages/:packageId/threads/:threadId',
    component: ThreadDetailComponent,
    resolve: { thread: ThreadResolverService },
    children: [
      {
        path: 'comments/:commentId',
        component: ThreadDetailComponent,
        resolve: { thread: ThreadResolverService },
        children: [
          {
            path: 'replies/:replyId',
            component: ThreadDetailComponent,
            resolve: { thread: ThreadResolverService },
          }
        ],
      },
    ],
  },
  {
    path: 'categories/:categoryId',
    component: DashboardComponent,
  },

  {
    path: 'message-board',
    component: MessageBoardComponent
  },

  {
    path: 'admin-message-board',
    component: AdminMessageBoardComponent
  },


  // deprecated links
  { path: 'sire-packages', redirectTo: '/categories/1' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

