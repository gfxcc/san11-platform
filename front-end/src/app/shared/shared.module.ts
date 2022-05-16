import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { AngularMaterialModule } from '../angular-material.module';
import { ForumRoutingModule } from '../forum/forum-routing.module';
import { CommentBoardComponent } from './components/comment-board/comment-board.component';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { ReplyCardComponent } from './components/comment-card/reply-card/reply-card.component';
import { CreateNewComponent } from './components/create-new/create-new.component';
import { CreateThreadComponent } from './components/discussion/create-thread/create-thread.component';
import { DiscussionComponent } from './components/discussion/discussion.component';
import { ThreadCardComponent } from './components/discussion/thread-card/thread-card.component';
import { ThreadDetailComponent } from './components/discussion/thread-detail/thread-detail.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TextInputDialogComponent } from './components/text-input-dialog/text-input-dialog.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { UserInfoWithSubButtonComponent } from './components/user-info-with-sub-button/user-info-with-sub-button.component';
import { FullUrlPipe } from './pipes/full-url.pipe';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';



@NgModule({
  declarations: [SidebarComponent,
    HeaderComponent,
    UserCardComponent,
    CommentBoardComponent,
    CommentCardComponent,
    ReplyCardComponent,
    CreateNewComponent,
    TextInputDialogComponent,
    DiscussionComponent,
    ThreadCardComponent,
    ThreadDetailComponent,
    CreateThreadComponent,
    UserInfoWithSubButtonComponent,
    FullUrlPipe,
    NotificationCardComponent,
  ],
  imports: [
    CommonModule,
    ForumRoutingModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
    AngularMaterialModule,
    FormsModule,
    CKEditorModule,
    VirtualScrollerModule,
    TableModule,
    SkeletonModule,
  ],
  exports: [
    SidebarComponent,
    HeaderComponent,
    CommentBoardComponent,
    CommentCardComponent,
    DiscussionComponent,
    UserInfoWithSubButtonComponent,
    // Pipes
    FullUrlPipe,
  ]
})
export class SharedModule { }
