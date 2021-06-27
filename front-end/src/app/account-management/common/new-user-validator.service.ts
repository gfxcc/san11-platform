import { Injectable } from '@angular/core';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';

@Injectable({
  providedIn: 'root'
})
export class NewUserValidatorService {

  constructor(
    private san11PlatformServiceService: San11PlatformServiceService,
  ) { }



  // gte(val: number): ValidatorFn {

  //   return (control: AbstractControl): ValidationErrors | null => {

  //     let v: number = +control.value;
  //     if (!this.gteService.gte(v,val)) {
  //       return { 'gte': true, 'requiredValue': val }
  //     }

  //     return null;
  //   }
  // }
}
