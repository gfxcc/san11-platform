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
      { path: '', redirectTo: 'notifications', pathMatch: 'prefix' },
      {
        path: 'notifications',
        component: NotificationsComponent,
        resolve: { user: UserResolver },
      },
      {
        path: 'account',
        component: AccountInfoComponent,
        resolve: { user: UserResolver },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
