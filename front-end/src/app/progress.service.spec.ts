import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let service: ProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('keeps loading until all active loads complete', fakeAsync(() => {
    let mode: string | null | undefined;
    let value: number | undefined;

    service.currentMode.subscribe(currentMode => mode = currentMode);
    service.currentProgress.subscribe(currentValue => value = currentValue);

    service.loading();
    service.loading();

    expect(mode).toBe('indeterminate');
    expect(value).toBe(0);

    service.complete();
    tick(300);

    expect(mode).toBe('indeterminate');

    service.complete();

    expect(mode).toBe('determinate');
    expect(value).toBe(100);

    tick(250);

    expect(mode).toBeNull();
    expect(value).toBe(0);
  }));
});
