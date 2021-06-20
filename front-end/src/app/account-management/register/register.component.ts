import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatStepper } from '@angular/material/stepper';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { NotificationService } from "../../common/notification.service";
import { saveUser } from "../../utils/user_util";
import { MatDialog } from '@angular/material/dialog';
import { SignUpRequest, User } from '../../../proto/san11-platform.pb';
import { SendVerificationCodeRequest } from "../../../proto/san11-platform.pb";
import { VerifyEmailRequest, VerifyEmailResponse } from "../../../proto/san11-platform.pb";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  timeToResend: number;
  timeToResendText: string;

  basicInfoForm: FormGroup;
  emailVerificationForm: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private san11PlatformServiceService: San11PlatformServiceService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.basicInfoForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32),
        Validators.pattern(/^[^\s]*$/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.pattern(/^[0-9a-zA-Z\-_]*$/)
      ]],
      email: ['', [
        Validators.required, Validators.email
      ]],
    });

    this.emailVerificationForm = this.formBuilder.group({
      verificationCode: ['', [
        Validators.required
      ]]
    });
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

  onBasicInfoNext() {
    if (this.timeToResend === undefined) {
      this.onResendVerificationCodeClick();
    }
  }

  onRegister() {
    const request = new SignUpRequest({
      user: new User({
        username: this.username.value,
        email: this.email.value,
        imageUrl: null
      }),
      password: this.password.value,
      verificationCode: this.verificationCode.value
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

  setupEmailValidation() {

  }

  onResendVerificationCodeClick() {
    if (this.timeToResend != undefined && this.timeToResend > 0) {
      console.log('Cannot resend email yet. Please wait');
      return;
    }

    this.san11PlatformServiceService.sendVerificationCode(new SendVerificationCodeRequest({
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

  onValidateEmail(stepper: MatStepper) {
    const request = new VerifyEmailRequest({
      email: this.email.value,
      verificationCode: this.verificationCode.value
    });
    console.log(request);
    this.san11PlatformServiceService.verifyEmail(request).subscribe(
      (resp: VerifyEmailResponse) => {
        if (resp.ok) {
          stepper.next();
        } else {
          this.notificationService.warn('验证码不正确');
        }
      }
    );
  }

}
