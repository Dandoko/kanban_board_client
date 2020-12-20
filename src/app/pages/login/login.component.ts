import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  invalid: boolean;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.invalid = false;
  }

  login(email: string, password: string) {
    this.authService.login(email, password).subscribe((res: HttpResponse<any>) => {
      this.router.navigate(['/board']);
      this.invalid = false;

      console.log("src:app:pages:login:login.component.ts -");
      console.log(res);
    }, () => {
      this.invalid = true;
    });
  }
}
