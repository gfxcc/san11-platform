import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { Status, User, ValidateNewUserRequest, VerifyEmailRequest, VerifyEmailResponse } from "../../../proto/san11-platform.pb";
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';

export class NewUserValidators {
    static username(san11pkService: San11PlatformServiceService, originalValue: string = undefined): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return san11pkService.validateNewUser(new ValidateNewUserRequest({
                user: new User({
                    username: control.value,
                })
            })).pipe(
                debounceTime(500),
                map(
                    (status) => {
                        return (status.code === '0' || control.value === originalValue) ? null : { invalidNewUser: status.message };
                    },
                ),
                catchError(err => {
                    return of({ invalidNewUser: err.statusMessage });
                }),
            );
        };
    }


    static email(san11pkService: San11PlatformServiceService, originalValue: string = undefined): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return san11pkService.validateNewUser(new ValidateNewUserRequest({
                user: new User({
                    email: control.value,
                })
            })).pipe(
                debounceTime(500),
                map((status: Status) => (status.code === '0' || control.value === originalValue) ? null : { invalidNewUser: status.message }),
                catchError(err => {
                    return of({ invalidNewUser: err.statusMessage });
                }),
            );
        };
    }

    static verification_code(san11pkService: San11PlatformServiceService, email: AbstractControl, originalValue: string = undefined): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return san11pkService.verifyEmail(new VerifyEmailRequest({
                email: email.value,
                verificationCode: control.value,
            })).pipe(
                debounceTime(500),
                map((resp: VerifyEmailResponse) => (resp.ok === true || control.value === originalValue) ? null : { invalidNewUser: '验证码不正确' }),
                catchError(err => {
                    return of({ invalidNewUser: err.statusMessage });
                }),
            );
        };
    }
}