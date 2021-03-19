import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SirePackageDashboardComponent } from './dashboards/sire-package-dashboard/sire-package-dashboard.component';
import { PackageCardComponent, DeleteDialog } from './package-management/package-card/package-card.component';
import { PlayerPackageDashboardComponent } from './dashboards/player-package-dashboard/player-package-dashboard.component';
import { ModMakerPackageDashboardComponent } from './dashboards/mod-maker-package-dashboard/mod-maker-package-dashboard.component';

import { AngularMaterialModule } from './angular-material.module';
/* Angular Flex Layout */
import { FlexLayoutModule } from "@angular/flex-layout";
/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { SigninComponent } from './account-management/signin/signin.component';
import { RegisterComponent } from './account-management/register/register.component';
import { CreatePackageComponent, AuthorDialog } from './package-management/create-package/create-package.component';

import { GlobalConstants } from './common/global-constants';
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
import { LoadingComponent } from './common/components/loading/loading.component'
import { PackageDetailComponent } from "./package-management/package-detail/package-detail.component";

import { GalleryModule } from  'ng-gallery';


@NgModule({
  declarations: [
    AppComponent,
    SirePackageDashboardComponent,
    PackageCardComponent,
    PlayerPackageDashboardComponent,
    ModMakerPackageDashboardComponent,
    SigninComponent,
    RegisterComponent,
    CreatePackageComponent,
    DeleteDialog,
    AuthorDialog,
    DashboardComponent,
    LoadingComponent,
    PackageDetailComponent
  ],
  imports: [
    GrpcCoreModule.forRoot(),
    GrpcWebClientModule.forRoot({
      settings: { host:  GlobalConstants.san11ServerUrl },
    }),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GalleryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
