import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

import { San11PlatformServiceService } from '../san11-platform-service.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar,
    private san11PlatformServiceService: San11PlatformServiceService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSignIn(signInForm: NgForm) {

    this.san11PlatformServiceService.signIn(signInForm.value).subscribe(
      value => {

        this._snackBar.open("登陆成功", 'Done', {
          duration: 10000,
        });

        localStorage.setItem('username', signInForm.value.username)

        localStorage.setItem('sid', value.sid)
        localStorage.setItem('userId', value.user.userId)
        localStorage.setItem('userType', value.user.userType)

        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error => {
        this._snackBar.open(error.statusMessage, 'Done', {
          duration: 10000,
        });
      }
    );


  }

}
