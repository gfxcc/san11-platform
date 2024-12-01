import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedModule } from '../shared/shared.module';
import { ArticleCardComponent } from './article/article-card/article-card.component';
import { ArticleDetailComponent } from './article/article-detail/article-detail.component';
import { ArticleListComponent } from './article/article-list/article-list.component';
import { ProductService } from './article/article-list/productservice';
import { ForumRoutingModule } from './forum-routing.module';
import { GeneralDiscussionComponent } from './general-discussion/general-discussion.component';



@NgModule({
  declarations: [
    ArticleListComponent,
    ArticleDetailComponent,
    ArticleCardComponent,
    GeneralDiscussionComponent,
  ],
  imports: [
    CommonModule,
    ForumRoutingModule,
    ReactiveFormsModule,
    // FormsModule,
    DataViewModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    MatInputModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    CKEditorModule,
    SharedModule,
    MatDividerModule,
    SkeletonModule,
  ],
  providers: [ProductService]
})
export class ForumModule { }
