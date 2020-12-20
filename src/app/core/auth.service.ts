import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from './web-request.service';
import { shareReplay, tap } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webRequestService: WebRequestService, private router: Router, private http: HttpClient) { }

  signup(email: string, password: string) {
    // Using rxjs' .pipe() to combine multiple functions into one
    return this.webRequestService.signup(email, password).pipe(
      // Using shareReplay() to avoid having mutliple subscribers run the login() method
      shareReplay(),
      // Using tap() to use the observed data without changing anything
      tap((res: HttpResponse<any>) => {
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      })
    );
  }

  login(email: string, password: string) {
    return this.webRequestService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        console.log("src:app:core:auth.service.ts - LOGGED IN");
      })
    );
  }

  logout() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken);
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccesToken() {
    return this.http.get(`${this.webRequestService.ROOT_URL}/users/refresh-access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId()
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token'));
      })
    );
  }
}
