import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SidenavService } from './shared/components/sidebar/sidenav.service';
import { onMobile } from './utils/layout_util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('sidenav', { static: true }) public sidenav: MatSidenav;

  globalLoading
  // To auto hide sidebar on mobile.
  sideBarOpen = !onMobile();
  sideBarMode = onMobile() ? 'over' : 'side'

  constructor(
    private sidenavService: SidenavService,
    private dialog: MatDialog,
    public router: Router,
  ) {
  }

  ngOnInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
    this.syncLayoutWithViewport();
    this.applyUiStyle();
  }

  private applyUiStyle(): void {
    const queryStyle = new URLSearchParams(window.location.search).get('ui');
    const storedStyle = localStorage.getItem('san11-ui-style');
    const style = queryStyle === 'default' || queryStyle === 'glass3'
      ? queryStyle
      : storedStyle === 'default' || storedStyle === 'glass3'
        ? storedStyle
        : 'glass3';

    localStorage.setItem('san11-ui-style', style);
    document.body.classList.toggle('ui-style-default', style === 'default');
    document.body.classList.toggle('ui-style-glass3', style === 'glass3');
    (window as any).setSan11UiStyle = (nextStyle: 'default' | 'glass3') => {
      localStorage.setItem('san11-ui-style', nextStyle);
      document.body.classList.toggle('ui-style-default', nextStyle === 'default');
      document.body.classList.toggle('ui-style-glass3', nextStyle === 'glass3');
    };
  }

  @HostListener('window:resize')
  syncLayoutWithViewport(): void {
    const mobile = onMobile();
    const nextMode = mobile ? 'over' : 'side';
    if (this.sideBarMode === nextMode) {
      return;
    }

    this.sideBarMode = mobile ? 'over' : 'side';
    this.sideBarOpen = mobile ? false : true;
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
