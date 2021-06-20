import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { Status, VerifyNewUserRequest } from "../../../proto/san11-platform.pb";

export class NewUserValidators {
    static username(san11pkService: San11PlatformServiceService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return san11pkService.verifyNewUser(new VerifyNewUserRequest({
                username: control.value
            })).pipe(
                debounceTime(500),
                map((status: Status) => status.code === '0' ? null : { invalidNewUser: status.message })
            );
        };
    }


    static email(san11pkService: San11PlatformServiceService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return san11pkService.verifyNewUser(new VerifyNewUserRequest({
                email: control.value
            })).pipe(
                debounceTime(500),
                map((status: Status) => status.code === '0' ? null : { invalidNewUser: status.message })
            );
        };
    }
}