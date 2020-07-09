import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  productsRootUrl = 'http://127.0.0.1:8000/products/api/products/';
  constructor() { }
}
