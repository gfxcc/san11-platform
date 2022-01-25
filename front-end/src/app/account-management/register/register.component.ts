import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { CreateUserRequest, CreateUserResponse, SendVerificationCodeRequest, User, VerifyEmailRequest, VerifyEmailResponse } from '../../../proto/san11-platform.pb';
import { NotificationService } from "../../common/notification.service";
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { saveUser } from "../../utils/user_util";
import { NewUserValidators } from "../common/new-user-validator";



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class RegisterComponent implements OnInit {

  timeToResend: number;
  timeToResendText: string;

  basicInfoForm: FormGroup;
  emailVerificationForm: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private san11pkService: San11PlatformServiceService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.basicInfoForm = this.formBuilder.group({
      username: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.pattern(/^[^\s@]*$/)],
        [
          NewUserValidators.username(this.san11pkService),
        ]],
      password: ['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(32),
          Validators.pattern(/^[0-9a-zA-Z\-_]*$/),
        ]],
      email: ['',
        [
          Validators.required, Validators.email,
        ],
        [
          NewUserValidators.email(this.san11pkService),
        ]],
    });

    this.emailVerificationForm = this.formBuilder.group({
      verificationCode: ['',
        [
          Validators.required,
        ],
        [
          NewUserValidators.verification_code(this.san11pkService, this.email),
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
    return this.emailVerificationForm.get('verificationCode');
  }
  //

  onBasicInfoNext() {
    if (this.timeToResend === undefined) {
      this.onResendVerificationCodeClick();
    }
  }

  onRegister() {
    const request = new CreateUserRequest({
      user: new User({
        username: this.username.value,
        email: this.email.value,
      }),
      password: this.password.value,
      verificationCode: this.verificationCode.value
    });

    this.san11pkService.createUser(request).subscribe(
      (resp: CreateUserResponse) => {
        this.notificationService.success('注册成功');
        localStorage.setItem('sid', resp.sid);
        saveUser(resp.user);

        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error => {
        this.notificationService.warn(`注册失败: ${error.statusMessage}`);
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

  onValidateEmail(stepper: MatStepper) {
    const request = new VerifyEmailRequest({
      email: this.email.value,
      verificationCode: this.verificationCode.value
    });
    this.san11pkService.verifyEmail(request).subscribe(
      (resp: VerifyEmailResponse) => {
        if (resp.ok) {
          stepper.next();
        } else {
          this.notificationService.warn('验证码不正确');
        }
      },
      error => {
        this.notificationService.warn(`验证失败: ${error.statusMessage}`);
      }
    );
  }

}
