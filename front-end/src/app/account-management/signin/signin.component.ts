import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { NotificationService } from "../../common/notification.service";


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private san11PlatformServiceService: San11PlatformServiceService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSignIn(signInForm: NgForm) {

    this.san11PlatformServiceService.signIn(signInForm.value).subscribe(
      value => {

        this.notificationService.success('登陆成功');

        localStorage.setItem('username', signInForm.value.username);

        localStorage.setItem('sid', value.sid);
        localStorage.setItem('userId', value.user.userId);
        localStorage.setItem('userType', value.user.userType);
        if (value.user.imageUrl != '') {
          localStorage.setItem('userImageUrl', value.user.imageUrl);
        }

        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error => {
        this.notificationService.warn(error.statusMessage);
      }
    );


  }

}
