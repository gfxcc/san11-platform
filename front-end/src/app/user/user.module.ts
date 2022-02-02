import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from "primeng/card";
import { TimelineModule } from "primeng/timeline";
import { AngularMaterialModule } from '../angular-material.module';
import { SharedModule } from '../shared/shared.module';
import { AboutComponent } from './about/about.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { HomeComponent } from './home/home.component';
import { PublishedPackagesComponent } from './published-packages/published-packages.component';
import { TimelineComponent } from './timeline/timeline.component';
import { UserRoutingModule } from './user-routing.module';



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
    SharedModule,
    AngularMaterialModule,
    UserRoutingModule,
    FormsModule,
    TimelineModule,
    CardModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
