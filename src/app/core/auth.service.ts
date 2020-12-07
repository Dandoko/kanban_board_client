import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from './web-request.service';
import { shareReplay, tap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webRequestService: WebRequestService, private router: Router) { }

  login(email: string, password: string) {
    // Using rxjs' .pipe() to combine multiple functions into one
    return this.webRequestService.login(email, password).pipe(
      // Using shareReplay() to avoid having mutliple subscribers run the login() method
      shareReplay(),
      // Using tap() to use the observed data
      tap((res: HttpResponse<any>) => {
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        console.log("LOGGED IN");
      })
    );
  }

  // Logout
  logout() {
    this.removeSession();

    // Redircts to the login page
    this.router.navigate(['/login']);
  }

  // Gets the access token
  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  // Sets the access token
  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken);
  }

  // Gets the refresh token
  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  // Setting the session properties in the local storage
  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  // Removes the session 
  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }
}
