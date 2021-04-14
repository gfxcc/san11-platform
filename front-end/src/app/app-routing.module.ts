import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './account-management/signin/signin.component'
import { RegisterComponent } from './account-management/register/register.component'
import { PackageCardComponent } from './package-management/package-card/package-card.component';
import { CreatePackageComponent } from './package-management/create-package/create-package.component'

import { MessageBoardComponent } from "./dashboards/message-board/message-board.component";
import { DashboardComponent } from './dashboards/dashboard/dashboard.component'
import { PackageDetailComponent } from "./package-management/package-detail/package-detail.component";
import { PackageResolverService } from "./package-management/package-detail/package-resolver.service";
import { UserDetailComponent } from './account-management/user-detail/user-detail.component';
import { UserResolverService } from "./account-management/user-detail/user-resolver.service";



const routes: Routes = [
  { path: '', redirectTo: '/categories/1', pathMatch: 'full' },

  { path: 'signin', component: SigninComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'app-create-package', component: CreatePackageComponent },
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
    path: 'users/:userId',
    component: UserDetailComponent,
    resolve: { user: UserResolverService }
  },

  {
    path: 'message-board',
    component: MessageBoardComponent
  },


  // deprecated links
  { path: 'sire-packages', redirectTo: '/categories/1' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

