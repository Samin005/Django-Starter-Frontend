import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ProductsService} from './products.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  user = {
    username: '',
    password: '',
    is_anonymous: true,
    is_authenticated: false
  };
  authHeader = new HttpHeaders();
  products: any = [];

  constructor(private http: HttpClient,
              public productsService: ProductsService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.http.get(this.productsService.productsApiRootUrl)
      .subscribe(products => {
        this.products = products;
      });
  }

  selectProduct(productURL: string): void {
    let productID = productURL.replace(this.productsService.productsApiRootUrl, '');
    productID = productID.replace('/', '');
    this.router.navigate([productID], {relativeTo: this.activatedRoute})
      .catch(error => console.log(error));
  }

  login(): void {
    this.user.username = 'samin';
    this.user.password = 'samin005';
    this.updateAuthHeader();
    this.http.get(this.productsService.productsRootUrl + 'user/', {
      headers: this.authHeader
    }).subscribe(currentUser => {
        this.user = currentUser as any;
        console.log(currentUser);
      }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
  }

  logout(): void {
    this.user = {
      username: '',
      password: '',
      is_anonymous: true,
      is_authenticated: false
    };
    this.updateAuthHeader();
  }

  updateAuthHeader(): void {
    this.authHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(this.user.username + ':' + this.user.password)
    });
  }

  // setRedirectUrl(): void {
  //   console.log(window.location.href);
  //   this.http.post(this.productsService.productsSetRedirectUrl, {current_url: window.location.href})
  //     .subscribe(response => {
  //       if ((response as any).success) {
  //         // window.location.href = this.productsService.productsGoogleLoginUrl;
  //         this.http.get(this.productsService.productsGoogleLoginUrl)
  //           .subscribe(res => console.log(res));
  //       }
  //     });
  // }

}
