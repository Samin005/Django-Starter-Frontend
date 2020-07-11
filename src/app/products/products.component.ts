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

  loginUsingAuthToken(): void {
    this.user.username = 'john';
    this.user.password = 'johnpassword';
    this.http.post('http://127.0.0.1:8000/products/auth-token/', {
      username: this.user.username,
      password: this.user.password
    }, {headers: this.authHeader}).subscribe((response: any) => {
      console.log(response);
      this.updateAuthHeaderForAuthToken(response.token);
      this.http.get('http://127.0.0.1:8000/products/user/', {headers: this.authHeader})
        .subscribe(currentUser => {
          this.user = currentUser as any;
          console.log(currentUser);
        }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
    }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
  }

  updateAuthHeaderForAuthToken(token): void {
    this.authHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
    });
  }

  logout(): void {
    this.http.get('http://127.0.0.1:8000/products/user/logout/', {headers: this.authHeader})
      .subscribe(currentUser => {
        this.user = currentUser as any;
        console.log(currentUser);
      }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
    this.authHeader = new HttpHeaders();
  }

  loginUsingBasicAuth(): void {
    this.user.username = 'john';
    this.user.password = 'johnpassword';
    this.updateAuthHeaderForBasicAuth();
    this.http.post(this.productsService.productsRootUrl + 'user/', {
      username: this.user.username,
      password: this.user.password
    }, {headers: this.authHeader}).subscribe(currentUser => {
      this.user = currentUser as any;
      console.log(currentUser);
    }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
  }

  updateAuthHeaderForBasicAuth(): void {
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
