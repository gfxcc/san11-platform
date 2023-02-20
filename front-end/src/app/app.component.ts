import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SidenavService } from './shared/components/sidebar/sidenav.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('sidenav', { static: true }) public sidenav: MatSidenav;

  // To auto hide sidebar on mobile.
  sideBarOpen = !window.matchMedia('(max-width: 40rem)').matches;
  sideBarMode = window.matchMedia('(max-width: 40rem)').matches ? 'over' : 'side'

  constructor(
    private sidenavService: SidenavService,
    private dialog: MatDialog,
    public router: Router) {
  }

  ngOnInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }


  sideBarToggler(event) {
    this.sideBarOpen = !this.sideBarOpen;
  }

  onActivate(elementRef) {
    // this._eventEmiter.dataStr.subscribe((data: ComponentMessage) => {
    //   if (data.categoryId != undefined) {
    //     setTimeout(() => {
    //       if (this.selectedCategory === data.categoryId) {
    //         return;
    //       }
    //       this.selectedCategory = data.categoryId;
    //       this.loadTags();
    //     });
    //   }
    // });
  }
}
