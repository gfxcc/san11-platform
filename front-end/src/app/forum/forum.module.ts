import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ForumRoutingModule } from './forum-routing.module';
import { ArticleListComponent } from './article/article-list/article-list.component';
import { ArticleDetailComponent } from './article/article-detail/article-detail.component';
import { DataViewModule } from 'primeng/dataview';
import { ProductService } from './article/article-list/productservice';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ArticleCardComponent } from './article/article-card/article-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { TableModule } from 'primeng/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { SkeletonModule } from 'primeng/skeleton';
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
  ],
  providers: [ProductService]
})
export class ForumModule { }
