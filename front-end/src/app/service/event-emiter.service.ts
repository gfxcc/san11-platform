import { Injectable, EventEmitter } from '@angular/core';

export interface ComponentMessage {
  categoryId?: string,
  inboxUnreadCount?: number,
  refreshPendingReviewCount?: boolean,
  userId?: string,
}

@Injectable({
  providedIn: 'root'
})
export class EventEmiterService {

  dataStr = new EventEmitter();

  constructor() { }

  sendMessage(data: ComponentMessage) {
    this.dataStr.emit(data);
  }
}
