import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // To auto hide sidebar on mobile.
  sideBarOpen = !window.matchMedia('(max-width: 40rem)').matches;
  sideBarMode = window.matchMedia('(max-width: 40rem)').matches ? 'over' : 'side'

  constructor(
    private dialog: MatDialog,
    public router: Router) {
  }

  ngOnInit(): void {
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
