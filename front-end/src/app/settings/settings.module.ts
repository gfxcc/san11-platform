import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { AccountInfoComponent } from './account-info/account-info.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { SwitchComponent } from './shared-componants/switch/switch.component';


@NgModule({
  declarations: [
    SettingsComponent,
    AccountInfoComponent,
    NotificationsComponent,
    SwitchComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SettingsModule { }
