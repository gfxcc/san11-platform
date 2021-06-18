import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { NotificationService } from "../../common/notification.service";
import { saveUser } from '../../utils/user_util';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private san11PlatformServiceService: San11PlatformServiceService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSignIn(signInForm: NgForm) {

    this.san11PlatformServiceService.signIn(signInForm.value).subscribe(
      resp => {

        this.notificationService.success('登陆成功');

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

  onForgetPasswordClick() {
    confirm('忘记密码了？ 用 注册邮箱 给站主发个邮件吧 yong_stevens@outlook.com')
  }
}
