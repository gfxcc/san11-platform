import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserResolver } from '../shared/resolvers/user.resolver';
import { AccountInfoComponent } from './account-info/account-info.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'account', pathMatch: 'prefix' },
      {
        path: 'account',
        component: AccountInfoComponent,
        resolve: { user: UserResolver },
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
