import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateUserRequest, User, FieldMask, VerifyEmailRequest, VerifyEmailResponse, SendVerificationCodeRequest } from '../../../proto/san11-platform.pb';
import { PasswordDialog } from '../../account-management/user-detail/user-detail.component';
import { NotificationService } from '../../common/notification.service';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { NewUserValidators } from "../../account-management/common/new-user-validator";
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  user: User;
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
        }
      }
    );

    this.basicInfoForm = this.formBuilder.group({
      username: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.pattern(/^[^\s]*$/)],
        [
          // NewUserValidators.username(this.san11pkService),
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
  iAmTheUser() {
    return this.user.userId === localStorage.getItem('userId');
  }

  onUpdate() {

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
}
