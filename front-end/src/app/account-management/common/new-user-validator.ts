import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Status, VerifyNewUserRequest } from "../../../proto/san11-platform.pb";
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';

export class NewUserValidators {
    static username(san11pkService: San11PlatformServiceService, originalValue: string = undefined): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return san11pkService.verifyNewUser(new VerifyNewUserRequest({
                username: control.value
            })).pipe(
                debounceTime(500),
                map(
                    (status: Status) => {
                        return (status.code === '0' || control.value === originalValue) ? null : { invalidNewUser: status.message };
                    },
                    (error) => {
                        return { invalidNewUser: error.statusMessage };
                    }
                )
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