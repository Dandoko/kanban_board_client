// Intercepts HTTP requests, adds the access token the request, and sends it the server

import { HttpHandler, HttpRequest, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { empty, Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebRequestInterceptorService implements HttpInterceptor {
  // Identifies if the access token is being refreshed
  isRefreshing: boolean;
  // Using a subject to retry the refreshing access token when the token has already been refreshed
  accessTokenRefreshed: Subject<any> = new Subject();

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Handles the request
    request = this.addAccessTokenToHeader(request);

    // Handles the response
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("src:app:core:web-request-interceptor.service.ts -");
        console.log(error);

        // If unauthorized
        if (error.status === 401) {
          return this.refreshAccessToken()
            .pipe(
              // switchMap() is an rxjs operator
              switchMap(() => {
                request = this.addAccessTokenToHeader(request);
                return next.handle(request);
              }),
              // If the access token is not refreshed
              catchError((err: any) => {
                console.log(err);
                this.authService.logout();
                // Returns an empty observable
                return empty();
              })
            )
        }

        return throwError(error);
      })
    );
  }

  // Refreshes the access token
  refreshAccessToken() {
    if (this.isRefreshing) {
      return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(() => {
          observer.next();
          observer.complete();
        });
      });
    }
    else {
      this.isRefreshing = true;
      return this.authService.getNewAccesToken().pipe(
        tap(() => {
          this.isRefreshing = false;
          this.accessTokenRefreshed.next();
          console.log("src:app:core:web-request-interceptor.service.ts - Access Token Refreshed");
        })
      )
    }
  }

  // Adds the access token to the header of the request
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
