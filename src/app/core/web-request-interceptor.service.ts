// Appends the access token to the header

import { HttpHandler, HttpRequest, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebRequestInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Handles the request
    request = this.addAccessTokenToHeader(request);

    // Handles the response
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("src:app:core:web-request-interceptor.service.ts -");
        console.log(error);
        return throwError(error);
      })
    );
  }

  addAccessTokenToHeader(request: HttpRequest<any>) {
    // Get the access header
    const accessToken = this.authService.getAccessToken();

    if (accessToken) {
      // Append the access token to the request header
      return request.clone({
        setHeaders: {
          'x-access-token': accessToken
        }
      });
    }

    return request;
  }
}
