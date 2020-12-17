import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  invalid: boolean;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.invalid = false;
  }

  signup(email: string, password: string) {
    this.authService.signup(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200) {
        this.router.navigate(['/board']);
        this.invalid = false;
      }

      console.log("src:app:pages:login:signup.component.ts -");
      console.log(res);
    }, () => {
      this.invalid = true;
    });
  }
}
