import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { San11PlatformServiceService } from './service/san11-platform-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'san11-platform';

  constructor(private _snackBar: MatSnackBar,
    private san11PlatformServiceService: San11PlatformServiceService,
    private router: Router) { }


  signedIn() {
    return localStorage.getItem('sid');
  }
  username() {
    return localStorage.getItem('username');
  }
  userId() {
    return localStorage.getItem('userId');
  }

  onSignOut() {
    console.log(localStorage.getItem('userId'));
    this.san11PlatformServiceService.signOut(localStorage.getItem('userId')).subscribe(
      () => console.log('log out')
    );

    localStorage.removeItem('sid');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');

    this.router.navigate(['/']);

    this._snackBar.open('已登出', 'Done', {
      duration: 2000,
    });

  }

  uploadTool() {
    this.router.navigate(['app-create-package']);
  }

  myTools() {

  }
}
