import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmiterService {

  dataStr = new EventEmitter();

  constructor() { }

  sendMessage(data: string) {
    this.dataStr.emit(data);
  }
}
