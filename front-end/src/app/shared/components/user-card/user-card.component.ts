import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../proto/san11-platform.pb';
import { getFullUrl } from '../../../utils/resrouce_util';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() user: User;


  userImageUrl: string;
  hideAuthorImage = true;

  constructor() {
  }

  ngOnInit(): void {
    this.userImageUrl = getFullUrl(this.user.imageUrl);
  }

}
