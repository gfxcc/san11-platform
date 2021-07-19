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
import { FormsModule } from '@angular/forms';
import { CreateNewComponent } from './components/create-new/create-new.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommentBoardComponent } from './components/comment-board/comment-board.component';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { ReplyCardComponent } from './components/comment-card/reply-card/reply-card.component';



@NgModule({
  declarations: [SidebarComponent, HeaderComponent, UserCardComponent, CommentBoardComponent, CommentCardComponent, ReplyCardComponent, CreateNewComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
    AngularMaterialModule,
    FormsModule,
  ],
  exports: [
    SidebarComponent,
    HeaderComponent,
    CommentBoardComponent,
    CommentCardComponent,
  ]
})
export class SharedModule { }
