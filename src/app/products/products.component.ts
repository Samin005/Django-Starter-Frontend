import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ProductsService} from './products.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  authHeader = new HttpHeaders();
  products: any = [];

  constructor(private http: HttpClient,
              public productsService: ProductsService,
              public authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.http.get(this.productsService.productsApiRootUrl)
      .subscribe(products => {
        this.products = products;
      });
    if (localStorage.getItem('refresh-token') !== null) {
      this.getCurrentUser();
    }
  }

  selectProduct(productURL: string): void {
    let productID = productURL.replace(this.productsService.productsApiRootUrl, '');
    productID = productID.replace('/', '');
    this.router.navigate([productID], {relativeTo: this.activatedRoute})
      .catch(error => console.log(error));
  }

  login(): void {
    this.authService.user.username = 'john';
    this.authService.user.password = 'johnpassword';
    this.authService.loginUser().subscribe((tokens: any) => {
      this.authService.saveTokens(tokens);
      console.log(tokens);
      this.getCurrentUser();
    }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
  }

  getCurrentUser(): void {
    this.authService.getUser()
      .subscribe(currentUser => {
        this.authService.user = currentUser as any;
        console.log(currentUser);
      }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
  }

  logout(): void {
    this.authService.logoutUser().subscribe(currentUser => {
      this.authService.user = currentUser as any;
      console.log(currentUser);
      this.authService.removeTokens();
    }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
  }

  loginUsingJWT(): void {
    this.authService.user.username = 'john';
    this.authService.user.password = 'johnpassword';
    this.http.post('http://127.0.0.1:8000/products/jwt-token/', {
      username: this.authService.user.username,
      password: this.authService.user.password
    }, {headers: this.authHeader}).subscribe((response: any) => {
      localStorage.setItem('access-token', response.access);
      localStorage.setItem('refresh-token', response.refresh);
      console.log(response);
      this.updateAuthHeaderForJWT();
      this.http.get('http://127.0.0.1:8000/products/user/', {headers: this.authHeader})
        .subscribe(currentUser => {
          this.authService.user = currentUser as any;
          console.log(currentUser);
        }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
    }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
  }

  updateAuthHeaderForJWT(): void {
    this.authHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access-token')
    });
  }

  refreshToken(): void {
    this.authHeader = new HttpHeaders();
    this.http.post('http://127.0.0.1:8000/products/jwt-token-refresh/', {
      refresh: localStorage.getItem('refresh-token')
    }, {headers: this.authHeader})
      .subscribe((newToken: any) => {
        console.log(newToken);
        localStorage.setItem('access-token', newToken.access);
      }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
  }

  loginUsingAuthToken(): void {
    this.authService.user.username = 'john';
    this.authService.user.password = 'johnpassword';
    this.http.post('http://127.0.0.1:8000/products/auth-token/', {
      username: this.authService.user.username,
      password: this.authService.user.password
    }, {headers: this.authHeader}).subscribe((response: any) => {
      console.log(response);
      this.updateAuthHeaderForAuthToken(response.token);
      this.http.get('http://127.0.0.1:8000/products/user/', {headers: this.authHeader})
        .subscribe(currentUser => {
          this.authService.user = currentUser as any;
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

  logoutJWT(): void {
    this.http.get('http://127.0.0.1:8000/products/user/logout/')
      .subscribe(currentUser => {
        this.authService.user = currentUser as any;
        console.log(currentUser);
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
      }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
    this.authHeader = new HttpHeaders();
  }

  loginUsingBasicAuth(): void {
    this.authService.user.username = 'john';
    this.authService.user.password = 'johnpassword';
    this.updateAuthHeaderForBasicAuth();
    this.http.post(this.productsService.productsRootUrl + 'user/', {
      username: this.authService.user.username,
      password: this.authService.user.password
    }, {headers: this.authHeader}).subscribe(currentUser => {
      this.authService.user = currentUser as any;
      console.log(currentUser);
    }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
  }

  updateAuthHeaderForBasicAuth(): void {
    this.authHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(this.authService.user.username + ':' + this.authService.user.password)
    });
  }

  getUsers(): void {
    // this.updateAuthHeaderForJWT();
    this.http.get('http://127.0.0.1:8000/products/api/user/', {headers: this.authHeader})
      .subscribe(users => {
        console.log(users);
      }, (errorResponse: HttpErrorResponse) => console.log(errorResponse.error));
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
