import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { NotificationService } from "../../common/notification.service";
import { saveUser } from "../../utils/user_util";
import { MatDialog } from '@angular/material/dialog';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SignUpRequest, User } from '../../../proto/san11-platform.pb';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  Roles: any = ['Admin', 'Author', 'Reader'];
  isEmailVerified = false;

  constructor(
    private notificationService: NotificationService,
    private san11PlatformServiceService: San11PlatformServiceService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {

  }

  onRegister(registerForm) {
    if (!registerForm.valid) {
      this.notificationService.warn('信息尚不完整');
      return;
    }

    if (!this.isEmailVerified) {
      this.dialog.open(VerifyEmailComponent, {
        data: {
          email: registerForm.value.email
        }
      }).afterClosed().subscribe(
        data => {
          if (data != undefined) {
            console.log(data);
          }
        }
      );
    }
  }

  register(username: string, email: string, password: string, verificationCode: string) {
    const request = new SignUpRequest({
      user: new User({
        username: username,
        email: email,
        imageUrl: null
      }),
      password: password
    });

    this.san11PlatformServiceService.signUp(request).subscribe(
      resp => {
        this.notificationService.success('注册成功');

        localStorage.setItem('sid', resp.sid);
        saveUser(resp.user);

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
