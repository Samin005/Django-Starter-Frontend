import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ProductsService} from './products.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any = [];

  constructor(private http: HttpClient,
              private productsService: ProductsService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.http.get(this.productsService.productsRootUrl)
      .subscribe(products => {
        this.products = products;
        console.log(products);
      });
  }

  selectProduct(productURL: string): void {
    let productID = productURL.replace(this.productsService.productsRootUrl, '');
    productID = productID.replace('/', '');
    this.router.navigate([productID], {relativeTo: this.activatedRoute})
      .catch(error => console.log(error));
  }

}
