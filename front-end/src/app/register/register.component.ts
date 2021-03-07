import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { San11PlatformServiceService } from '../san11-platform-service.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  Roles: any = ['Admin', 'Author', 'Reader'];

  constructor(private _snackBar: MatSnackBar,
    private san11PlatformServiceService: San11PlatformServiceService,
    private router: Router) { }

  ngOnInit(): void {

  }

  onRegister(registerForm) {

    this.san11PlatformServiceService.signUp(registerForm.value).subscribe(
      value => {

        this._snackBar.open("注册成功", 'Done', {
          duration: 10000,
        });

          localStorage.setItem('sid', registerForm.value.sid)
          localStorage.setItem('username', value.user.username)
          localStorage.setItem('userId', value.user.userId)

          this.router.navigate(['/']);
      },
      error => {
        this._snackBar.open(error.statusMessage, 'Done', {
          duration: 10000,
        });
      }
    );
  }


}
