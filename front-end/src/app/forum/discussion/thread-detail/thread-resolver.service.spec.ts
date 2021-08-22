import { TestBed } from '@angular/core/testing';

import { ThreadResolverService } from './thread-resolver.service';

describe('ThreadResolverService', () => {
  let service: ThreadResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreadResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
