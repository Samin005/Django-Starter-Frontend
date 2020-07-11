import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ProductsService} from '../products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  currentProduct = {name: '', price: 0, image_url: ''};
  showLoading = true;
  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private productsService: ProductsService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.http.get(this.productsService.productsApiRootUrl + params.id)
        .subscribe(product => {
          this.currentProduct = product as any;
          this.showLoading = false;
        });
    });
  }

}
