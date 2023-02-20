import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';

import { TimelineModule } from 'primeng/timeline';
import { AngularMaterialModule } from '../angular-material.module';
import { SharedModule } from '../shared/shared.module';
import { CollectionsComponent } from './collections/collections.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { PersonalRoutingModule } from './personal-routing.module';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';


@NgModule({
  declarations: [
    HomeComponent,
    SubscriptionsComponent,
    CollectionsComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TimelineModule,
    AngularMaterialModule,
    PersonalRoutingModule,
    CardModule,
  ]
})
export class PersonalModule { }
