import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type ProgressMode = 'determinate' | 'indeterminate' | null;

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progressValueSource = new BehaviorSubject<number>(0);
  private progressModeSource = new BehaviorSubject<ProgressMode>(null);
  private activeLoadCount = 0;
  private hideTimer: ReturnType<typeof setTimeout> | undefined;

  currentProgress = this.progressValueSource.asObservable();
  currentMode = this.progressModeSource.asObservable();

  constructor() { }

  update(value: number) {
    this.clearHideTimer();
    this.progressModeSource.next('determinate');
    this.progressValueSource.next(value);
  }

  loading() {
    this.clearHideTimer();
    this.activeLoadCount++;
    this.progressModeSource.next('indeterminate');
    this.progressValueSource.next(0);
  }

  complete() {
    this.activeLoadCount = Math.max(0, this.activeLoadCount - 1);

    if (this.activeLoadCount > 0) {
      this.progressModeSource.next('indeterminate');
      return;
    }

    this.progressModeSource.next('determinate');
    this.progressValueSource.next(100);
    this.hideTimer = setTimeout(() => {
      this.progressModeSource.next(null);
      this.progressValueSource.next(0);
      this.hideTimer = undefined;
    }, 250);
  }

  private clearHideTimer() {
    if (this.hideTimer === undefined) {
      return;
    }

    clearTimeout(this.hideTimer);
    this.hideTimer = undefined;
  }
}
