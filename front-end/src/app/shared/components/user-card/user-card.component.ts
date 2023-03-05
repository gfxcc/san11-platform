import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { GetUserRequest, User } from '../../../../proto/san11-platform.pb';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() clickable: boolean = true;
  @Input() user: User;
  @Input() userId: string;

  loadingAuthorImage = true;

  constructor(
    public san11pkService: San11PlatformServiceService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    if (this.userId != undefined) {
      this.loadAuthor();
    }
  }


  loadAuthor() {
    this.san11pkService.getUser(new GetUserRequest({
      name: `users/${this.userId}`,
    })).subscribe({
      next: user => {
        this.user = user;
      },
      error: error => {
        console.log('failed to load author: ' + error.statusMessage);
      }
    });
  }

  onClick() {
    if (this.clickable) {
      this.router.navigateByUrl(this.user.name);
    }
  }
}
