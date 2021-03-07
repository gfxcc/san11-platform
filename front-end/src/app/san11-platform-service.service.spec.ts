import { TestBed } from '@angular/core/testing';

import { San11PlatformServiceService } from './san11-platform-service.service';

describe('San11PlatformServiceService', () => {
  let service: San11PlatformServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(San11PlatformServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
