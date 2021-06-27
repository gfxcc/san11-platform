import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../../proto/san11-platform.pb';
import { San11PlatformServiceService } from '../../../service/san11-platform-service.service';
import { NewUserValidators } from '../../common/new-user-validator';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {

  basicInfoForm: FormGroup;

  constructor(
    private san11pkService: San11PlatformServiceService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.basicInfoForm = this.formBuilder.group({
      username: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.pattern(/^[^\s]*$/)],
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

  //

}
