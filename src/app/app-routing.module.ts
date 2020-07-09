import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProductsComponent} from './products/products.component';
import {HomeComponent} from './home/home.component';
import {PollsComponent} from './polls/polls.component';
import {ProductDetailsComponent} from './products/product-details/product-details.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'products', component: ProductsComponent, children: [
    {path: ':id', component: ProductDetailsComponent}
    ]},
  {path: 'polls', component: PollsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
