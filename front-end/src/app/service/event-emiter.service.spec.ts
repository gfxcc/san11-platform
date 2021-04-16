import { TestBed } from '@angular/core/testing';

import { EventEmiterService } from './event-emiter.service';

describe('EventEmiterService', () => {
  let service: EventEmiterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventEmiterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
