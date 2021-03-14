import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent} from './account-management/signin/signin.component'
import { RegisterComponent} from './account-management/register/register.component'
import { SirePackageDashboardComponent } from './dashboards/sire-package-dashboard/sire-package-dashboard.component';
import { PackageCardComponent } from './package-management/package-card/package-card.component';
import { PlayerPackageDashboardComponent } from './dashboards/player-package-dashboard/player-package-dashboard.component';
import { ModMakerPackageDashboardComponent } from './dashboards/mod-maker-package-dashboard/mod-maker-package-dashboard.component';
import { CreatePackageComponent } from './package-management/create-package/create-package.component'

import { DashboardComponent } from './dashboards/dashboard/dashboard.component'



const routes: Routes = [
  { path: '', redirectTo: '/categories/1', pathMatch: 'full' },

  { path: 'signin', component: SigninComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'categories/:id', component: DashboardComponent },

  { path: 'app-create-package', component: CreatePackageComponent },

  // deprecated links
  { path: 'sire-packages', redirectTo: '/' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

