import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = localStorage.getItem('access-token');
    if (accessToken !== null) {
      request = this.tokenizedRequest(request, accessToken);
    }
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return this.refreshAccessToken(request, next);
      } else {
        throwError(error);
      }
    }));
  }

  tokenizedRequest(request: HttpRequest<unknown>, accesstoken: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + accesstoken
      }
    });
  }

  refreshAccessToken(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          localStorage.setItem('access-token', token.access);
          this.refreshTokenSubject.next(token.access);
          return next.handle(this.tokenizedRequest(request, token.access));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(access => {
          return next.handle(this.tokenizedRequest(request, access));
        }));
    }
  }
}
