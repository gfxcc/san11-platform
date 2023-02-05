import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './collections/collections.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'subscriptions',
    component: SubscriptionsComponent,
  },
  {
    path: 'collections',
    component: CollectionsComponent,
  },
  {
    path: 'history',
    component: HistoryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
