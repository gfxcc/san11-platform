import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { NotificationService } from "../../common/notification.service";
import { saveUser } from "../../utils/user_util";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  Roles: any = ['Admin', 'Author', 'Reader'];

  constructor(
    private notificationService: NotificationService,
    private san11PlatformServiceService: San11PlatformServiceService,
    private router: Router) { }

  ngOnInit(): void {

  }

  onRegister(registerForm) {

    this.san11PlatformServiceService.signUp(registerForm.value).subscribe(
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
