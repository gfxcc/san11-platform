import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progressValueSource = new BehaviorSubject<number>(0);
  private progressModeSource = new BehaviorSubject<string>('indeterminate');

  currentProgress = this.progressValueSource.asObservable();
  currentMode = this.progressModeSource.asObservable();

  constructor() { }

  update(value: number) {
    this.progressModeSource.next('determinate');
    this.progressValueSource.next(value);
  }

  loading() {
    this.progressModeSource.next('indeterminate');
  }

  complete() {
    this.progressModeSource.next('determinate');
    this.progressValueSource.next(100);
  }
}