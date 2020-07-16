import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = {
    username: '',
    password: '',
    is_anonymous: true,
    is_authenticated: false
  };

  constructor(private http: HttpClient) {
  }

  getUser(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/products/user/');
  }

  loginUser(): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/products/jwt-token/', {
      username: this.user.username,
      password: this.user.password
    });
  }

  logoutUser(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/products/user/logout/');
  }

  refreshToken(): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/products/jwt-token-refresh/', {
      refresh: localStorage.getItem('refresh-token')
    });
  }

  saveTokens(tokens): void {
    localStorage.setItem('access-token', tokens.access);
    localStorage.setItem('refresh-token', tokens.refresh);
  }

  removeTokens(): void {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }
}
