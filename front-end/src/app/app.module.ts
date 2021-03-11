import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SirePackageDashboardComponent } from './sire-package-dashboard/sire-package-dashboard.component';
import { PackageCardComponent, DeleteDialog } from './package-card/package-card.component';
import { PlayerPackageDashboardComponent } from './player-package-dashboard/player-package-dashboard.component';
import { ModMakerPackageDashboardComponent } from './mod-maker-package-dashboard/mod-maker-package-dashboard.component';

import { AngularMaterialModule } from './angular-material.module';
/* Angular Flex Layout */
import { FlexLayoutModule } from "@angular/flex-layout";
/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { CreatePackageComponent } from './create-package/create-package.component';


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
  ],
  imports: [
    GrpcCoreModule.forRoot(),
    GrpcWebClientModule.forRoot({
      settings: { host: 'http://0.0.0.0:8090' },
    }),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
