import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './home/home.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AccountInfoComponent } from './account-info/account-info.component';
import { PublishedPackagesComponent } from './published-packages/published-packages.component';
import { AboutComponent } from './about/about.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelineModule } from "primeng/timeline";
import { CardModule } from "primeng/card";


@NgModule({
  declarations: [
    HomeComponent,
    AccountInfoComponent,
    PublishedPackagesComponent,
    AboutComponent,
    TimelineComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    UserRoutingModule,
    FormsModule,
    TimelineModule,
    CardModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
