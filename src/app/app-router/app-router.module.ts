import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchComponent } from '../search/search.component';
import { ResultComponent } from '../result/result.component';
import { AppComponent } from '../app.component';

const routes: Routes = [
  { 
    path: '', 
    component: AppComponent 
  },
  { 
    path: 'search/:location',
    component: ResultComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRouterModule { }
