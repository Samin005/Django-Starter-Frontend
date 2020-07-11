import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  productsRootUrl = 'http://127.0.0.1:8000/products/';
  productsApiRootUrl = this.productsRootUrl + 'api/products/';
  // productsGoogleLoginUrl = 'http://127.0.0.1:8000/products/accounts/google/login/';
  // productsLogoutUrl = 'http://127.0.0.1:8000/products/accounts/logout/';
  // productsSetRedirectUrl = 'http://127.0.0.1:8000/products/set-redirect-url/';
  constructor() { }
}
