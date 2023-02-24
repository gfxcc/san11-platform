import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
/* Angular Flex Layout */
import { FlexLayoutModule } from "@angular/flex-layout";
/* FormsModule */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { GalleryModule } from 'ng-gallery';
import { TimelineModule } from 'primeng/timeline';
import { RegisterComponent } from './account-management/register/register.component';
import { SigninComponent } from './account-management/signin/signin.component';
import { BasicInfoComponent } from './account-management/user-detail/basic-info/basic-info.component';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingComponent } from './common/components/loading/loading.component';
import { TextDialogComponent } from './common/components/text-dialog/text-dialog.component';
import { TextInputDialogComponent } from './common/components/text-input-dialog/text-input-dialog.component';
import { GlobalConstants } from './common/global-constants';
import { ForumModule } from './forum/forum.module';
import { AuthorDialog, CreatePackageComponent } from './package-management/create-package/create-package.component';
import { PackageDetailComponent } from "./package-management/package-detail/package-detail.component";
import { CreateNewVersionComponent } from "./package-management/version-management/create-new-version/create-new-version.component";
import { BranchComponent } from './package-management/version-management/version-panel/branch/branch.component';
import { VersionPanelComponent } from './package-management/version-management/version-panel/version-panel.component';
import { PersonalModule } from './personal/personal.module';
import { SettingsModule } from './settings/settings.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from "./user/user.module";
import { AdminMessageBoardComponent } from './website-management/admin-message-board/admin-message-board.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    RegisterComponent,
    CreatePackageComponent,
    AuthorDialog,
    LoadingComponent,
    PackageDetailComponent,
    VersionPanelComponent,
    BranchComponent,
    CreateNewVersionComponent,
    TextDialogComponent,
    TextInputDialogComponent,
    AdminMessageBoardComponent,
    BasicInfoComponent,
  ],
  imports: [
    GrpcCoreModule.forRoot(),
    GrpcWebClientModule.forRoot({
      settings: { host: GlobalConstants.san11ServerUrl },
    }),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GalleryModule,
    CKEditorModule,
    SharedModule,
    UserModule,
    ForumModule,
    PersonalModule,
    TimelineModule,
    SettingsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
