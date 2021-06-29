import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { observable, Observable, TimeoutError } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { Status, VerifyNewUserRequest } from "../../../proto/san11-platform.pb";

export class NewUserValidators {
    static username(san11pkService: San11PlatformServiceService, originalValue: string = undefined): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return san11pkService.verifyNewUser(new VerifyNewUserRequest({
                username: control.value
            })).pipe(
                debounceTime(500),
                map((status: Status) => (status.code === '0' || control.value === originalValue) ? null : { invalidNewUser: status.message })
            );
        };
    }


    static email(san11pkService: San11PlatformServiceService, originalValue: string = undefined): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return san11pkService.verifyNewUser(new VerifyNewUserRequest({
                email: control.value
            })).pipe(
                debounceTime(500),
                map((status: Status) => (status.code === '0' || control.value === originalValue) ? null : { invalidNewUser: status.message })
            );
        };
    }
}