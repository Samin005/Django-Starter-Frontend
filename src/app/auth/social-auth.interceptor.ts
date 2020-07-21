import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SocialAuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = localStorage.getItem('auth-token');
    if (authToken !== null) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', 'Token ' + authToken)
      });
      return next.handle(authRequest);
    } else {
      return next.handle(request);
    }
  }
}
