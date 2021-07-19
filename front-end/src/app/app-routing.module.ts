import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './account-management/signin/signin.component'
import { RegisterComponent } from './account-management/register/register.component'
import { CreatePackageComponent } from './package-management/create-package/create-package.component'

import { MessageBoardComponent } from "./dashboards/message-board/message-board.component";
import { DashboardComponent } from './dashboards/dashboard/dashboard.component'
import { PackageDetailComponent } from "./package-management/package-detail/package-detail.component";
import { PackageResolverService } from "./package-management/package-detail/package-resolver.service";
import { AdminMessageBoardComponent } from './website-management/admin-message-board/admin-message-board.component';
import { CreateNewComponent } from './shared/components/create-new/create-new.component';



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

