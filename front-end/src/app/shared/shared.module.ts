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



@NgModule({
  declarations: [SidebarComponent, HeaderComponent, UserCardComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    AngularMaterialModule,
    FormsModule,
  ],
  exports: [
    SidebarComponent,
    HeaderComponent,
  ]
})
export class SharedModule { }
