import { Component, OnInit } from '@angular/core';
import { User } from "../../../proto/san11-platform.pb";




export interface UserData {
  user: User
}
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  constructor(
  ) {
  }

  ngOnInit(): void {
  }

}
