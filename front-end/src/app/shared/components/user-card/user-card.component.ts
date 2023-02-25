import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../proto/san11-platform.pb';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() user: User;

  hideAuthorImage = true;

  constructor() {
  }

  ngOnInit(): void {
  }
}
