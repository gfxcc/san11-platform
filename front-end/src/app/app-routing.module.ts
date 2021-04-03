import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './account-management/signin/signin.component'
import { RegisterComponent } from './account-management/register/register.component'
import { SirePackageDashboardComponent } from './dashboards/sire-package-dashboard/sire-package-dashboard.component';
import { PackageCardComponent } from './package-management/package-card/package-card.component';
import { PlayerPackageDashboardComponent } from './dashboards/player-package-dashboard/player-package-dashboard.component';
import { ModMakerPackageDashboardComponent } from './dashboards/mod-maker-package-dashboard/mod-maker-package-dashboard.component';
import { CreatePackageComponent } from './package-management/create-package/create-package.component'

import { DashboardComponent } from './dashboards/dashboard/dashboard.component'
import { PackageDetailComponent } from "./package-management/package-detail/package-detail.component";
import { UserDetailComponent } from './account-management/user-detail/user-detail.component';



const routes: Routes = [
  { path: '', redirectTo: '/categories/1', pathMatch: 'full' },

  { path: 'signin', component: SigninComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'app-create-package', component: CreatePackageComponent },
  {
    path: 'categories/:categoryId/packages/:packageId',
    component: DashboardComponent,
  },
  {
    path: 'categories/:categoryId',
    component: DashboardComponent,
  },

  {
    path: 'users/:userId',
    component: DashboardComponent
  },


  // deprecated links
  { path: 'sire-packages', redirectTo: '/categories/1' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

