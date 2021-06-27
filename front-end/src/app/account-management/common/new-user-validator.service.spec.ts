import { TestBed } from '@angular/core/testing';

import { NewUserValidatorService } from './new-user-validator.service';

describe('NewUserValidatorService', () => {
  let service: NewUserValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewUserValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
