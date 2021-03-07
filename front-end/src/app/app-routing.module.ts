import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent} from './signin/signin.component'
import { RegisterComponent} from './register/register.component'
import { SirePackageDashboardComponent } from './sire-package-dashboard/sire-package-dashboard.component';
import { PackageCardComponent } from './package-card/package-card.component';
import { PlayerPackageDashboardComponent } from './player-package-dashboard/player-package-dashboard.component';
import { ModMakerPackageDashboardComponent } from './mod-maker-package-dashboard/mod-maker-package-dashboard.component';
import { CreatePackageComponent } from './create-package/create-package.component'




const routes: Routes = [
  { path: '', redirectTo: '/sire-packages', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sire-packages', component: SirePackageDashboardComponent },
  { path: 'player-packages', component: PlayerPackageDashboardComponent },
  { path: 'mod-maker-packages', component: ModMakerPackageDashboardComponent },
  { path: 'app-create-package', component: CreatePackageComponent },

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

