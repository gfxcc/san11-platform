import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { NotificationService } from "../../common/notification.service";


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
      value => {
        this.notificationService.success('注册成功');

        localStorage.setItem('username', value.user.username);
        localStorage.setItem('sid', value.sid);
        localStorage.setItem('userId', value.user.userId);
        localStorage.setItem('userType', value.user.userType);

        this.router.navigate(['/']);
      },
      error => {
        this.notificationService.warn(error.statusMessage);
      }
    );
  }


}
