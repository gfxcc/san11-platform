import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@NgModule({
  declarations: [
    ArticleListComponent,
    ArticleDetailComponent,
    ArticleCardComponent
  ],
  imports: [
    CommonModule,
    ForumRoutingModule,
    // FormsModule,
    DataViewModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    CKEditorModule,
    SharedModule,
  ],
  providers: [ProductService]
})
export class ForumModule { }
