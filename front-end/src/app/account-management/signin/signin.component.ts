import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { SendVerificationCodeRequest, SignInRequest, UpdatePasswordRequest, User, VerifyEmailRequest, VerifyEmailResponse } from "../../../proto/san11-platform.pb";
import { NotificationService } from "../../common/notification.service";
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { saveUser } from '../../utils/user_util';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class SigninComponent implements OnInit {
  @ViewChild('tagGroup') galleryElementCatched: ElementRef

  selectedTabIndex = 0;
  timeToResend: number;
  timeToResendText: string;

  user: User;

  basicInfoForm: FormGroup;
  emailVerificationForm: FormGroup;
  resetPasswordForm: FormGroup;

  hidePassword = true;

  constructor(
    private notificationService: NotificationService,
    private san11PlatformServiceService: San11PlatformServiceService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {

    this.basicInfoForm = this.formBuilder.group({
      // username: ['', [
      //   Validators.required,
      //   Validators.minLength(4),
      //   Validators.maxLength(32),
      //   Validators.pattern(/^[^\s]*$/)]],
      email: ['', [
        Validators.required, Validators.email
      ]],
    });

    this.emailVerificationForm = this.formBuilder.group({
      verificationCode: ['', [
        Validators.required
      ]]
    });

    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32),
        Validators.pattern(/^[0-9a-zA-Z\-_]*$/)
      ]]
    });
  }

  //
  // get username() {
  //   return this.basicInfoForm.get('username');
  // }

  get email() {
    return this.basicInfoForm.get('email');
  }

  get verificationCode() {
    return this.emailVerificationForm.get('verificationCode')
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }
  //

  onSignIn(input) {
// signInForm.value
    this.san11PlatformServiceService.signIn(new SignInRequest({
      identity: input.identity,
      password: input.password
    })).subscribe(
      resp => {

        this.notificationService.success('登陆成功');

        localStorage.setItem('sid', resp.sid);
        saveUser(resp.user);

        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error => {
        this.notificationService.warn(`登录失败: ${error.statusMessage}`);
      }
    );
  }

  onForgetPasswordClick() {
    this.selectedTabIndex = 1;
  }

  onBasicInfoNext(stepper: MatStepper) {
    if (this.timeToResend === undefined) {
      this.onResendVerificationCodeClick();
    }
    stepper.next();
    // this.san11PlatformServiceService.getUser(new GetUserRequest({ username: this.username.value })).subscribe(
    //   (user: User) => {
    //     this.user = user;
    //     if (user.email != this.email.value) {
    //       this.notificationService.warn('邮箱与用户名不符');
    //     } else {
    //       if (this.timeToResend === undefined) {
    //         this.onResendVerificationCodeClick();
    //       }
    //       stepper.next();
    //     }
    //   }
    // );
  }

  onResendVerificationCodeClick() {
    if (this.timeToResend != undefined && this.timeToResend > 0) {
      console.log('Cannot resend email yet. Please wait');
      return;
    }

    this.san11PlatformServiceService.sendVerificationCode(new SendVerificationCodeRequest({
      email: this.basicInfoForm.value.email
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
          if (resp.user == undefined) {
            this.notificationService.warn('找不到匹配用户');
            return
          }
          this.user = resp.user;
          stepper.next();
        } else {
          this.notificationService.warn('验证码不正确');
        }
      },
      error => {
        this.notificationService.warn(`验证用户失败: ${error.statusMessage}`)
      }
    );
  }

  onUpdatePassword() {
    this.san11PlatformServiceService.updatePassword(new UpdatePasswordRequest({
      name: this.user.name,
      password: this.password.value,
      verificationCode: this.verificationCode.value
    })).subscribe(
      resp => {
        this.notificationService.success('密码更新成功');
        this.selectedTabIndex = 0;
      },
      error => {
        this.notificationService.warn(`更新失败: ${error.statusMessage}`);
      }
    );
  }
}
