import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldMask, SendVerificationCodeRequest, UpdatePasswordRequest, UpdateUserRequest, User, VerifyEmailRequest, VerifyEmailResponse } from '../../../proto/san11-platform.pb';
import { NewUserValidators } from "../../account-management/common/new-user-validator";
import { NotificationService } from '../../common/notification.service';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  PASSWORD_PLACEHOLDER = 'password-placeholder';
  user = new User();
  updatedUser = new User();
  basicInfoForm: FormGroup;
  emailVerificationForm: FormGroup;

  timeToResend: number;
  timeToResendText: string;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private san11pkService: San11PlatformServiceService,
  ) {
  }

  ngOnInit(): void {

    this.route.data.subscribe(
      (data) => {

        if (data.user) {
          this.user = data.user;

          this.basicInfoForm = this.formBuilder.group({
            username: [{ value: this.user.username, disabled: !this.iAmTheUser() },
            [
              Validators.required,
              Validators.minLength(4),
              Validators.maxLength(32),
              Validators.pattern(/^[^\s]*$/)],
            [
              NewUserValidators.username(this.san11pkService, this.user.username),
            ]],
            email: [{ value: this.user.email, disabled: !this.iAmTheUser() },
            [
              Validators.required, Validators.email,
            ],
            [
              NewUserValidators.email(this.san11pkService, this.user.email),
            ]],
            password: [{ value: this.PASSWORD_PLACEHOLDER, disabled: !this.iAmTheUser() },
            [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(32),
              Validators.pattern(/^[0-9a-zA-Z\-_]*$/),
            ]],
          });

          this.emailVerificationForm = this.formBuilder.group({
            verificationCode: ['', [
              Validators.required
            ]]
          });

        }
      }
    );
  }

  //
  get username() {
    return this.basicInfoForm.get('username');
  }

  get email() {
    return this.basicInfoForm.get('email');
  }

  get password() {
    return this.basicInfoForm.get('password');
  }

  get verificationCode() {
    return this.emailVerificationForm.get('verificationCode')
  }
  //
  iAmTheUser() {
    return this.user.userId === localStorage.getItem('userId');
  }

  onUpdate() {

  }

  populateBasicInfoForm() {
  }

  onValidateEmail(stepper: MatStepper) {
    const request = new VerifyEmailRequest({
      email: this.email.value,
      verificationCode: this.verificationCode.value
    });
    console.log(request);
    this.san11pkService.verifyEmail(request).subscribe(
      (resp: VerifyEmailResponse) => {
        if (resp.ok) {
          this.prepareUpdateUser();
          stepper.next();
        } else {
          this.notificationService.warn('验证码不正确');
        }
      }
    );
  }

  onResendVerificationCodeClick() {
    if (this.timeToResend != undefined && this.timeToResend > 0) {
      console.log('Cannot resend email yet. Please wait');
      return;
    }

    this.san11pkService.sendVerificationCode(new SendVerificationCodeRequest({
      email: this.email.value
    })).subscribe();

    this.timeToResend = 60;
    this.timeToResendText = `${this.timeToResend}s`;
    var x = setInterval(() => {
      if (this.timeToResend > 0) {
        this.timeToResend -= 1;
        this.timeToResendText = `${this.timeToResend}s`;
      } else {
        this.timeToResendText = '';
      }
    }, 1000);
  }

  onBasicInfoNext() {
    if (this.timeToResend === undefined) {
      this.onResendVerificationCodeClick();
    }
  }
  
  prepareUpdateUser() {
    this.updatedUser.userId = this.user.userId;
    this.updatedUser.name = `users/${this.user.userId}`;
    this.updatedUser.username = this.user.username != this.username.value ? this.username.value : undefined;
    this.updatedUser.email = this.user.email != this.email.value ? this.email.value : undefined;
  }

  onUpdateUser() {
    let paths = [];
    if (this.updatedUser.username) {
      paths.push('username');
    }
    if (this.updatedUser.email) {
      paths.push('email');
    }

    if (paths.length) {
      this.san11pkService.updateUser(new UpdateUserRequest({
        user: this.updatedUser,
        updateMask: new FieldMask({
          paths: paths
        })
      })).subscribe(
        (resp: User) => {
          this.notificationService.success('更新成功');
          this.router.navigate(['categories/1']);
        },
        error => {
          this.notificationService.warn(`更新失败: ${error.statusMessage}`);
        }
      );
    }
    if (this.password.value != this.PASSWORD_PLACEHOLDER) {
      this.san11pkService.updatePassword(new UpdatePasswordRequest({
        name: this.user.name,
        password: this.password.value,
        verificationCode: this.verificationCode.value,
      })).subscribe(
        empty => {
          this.notificationService.success('更新密码 成功');
          this.router.navigate(['categories/1']);
        },
        error => {
          this.notificationService.warn('更新密码 失败:' + error.statusMessage);
        }
      );
    }

  }

}
