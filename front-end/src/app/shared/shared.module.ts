import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserCardComponent } from './components/user-card/user-card.component'
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AngularMaterialModule } from '../angular-material.module';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateNewComponent } from './components/create-new/create-new.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommentBoardComponent } from './components/comment-board/comment-board.component';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { ReplyCardComponent } from './components/comment-card/reply-card/reply-card.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TextInputDialogComponent } from './components/text-input-dialog/text-input-dialog.component';
import { DiscussionComponent } from './components/discussion/discussion.component';
import { MatCardModule } from '@angular/material/card';
import { ForumRoutingModule } from '../forum/forum-routing.module';
import { ThreadCardComponent } from './components/discussion/thread-card/thread-card.component';
import { ThreadDetailComponent } from './components/discussion/thread-detail/thread-detail.component';
import { CreateThreadComponent } from './components/discussion/create-thread/create-thread.component';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { VirtualScrollerModule } from 'primeng/virtualscroller';



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
  ]
})
export class SharedModule { }
