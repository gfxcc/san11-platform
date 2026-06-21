import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { SidenavService } from './shared/components/sidebar/sidenav.service';
import { onMobile } from './utils/layout_util';

type UiStyle = 'clean' | 'flat' | 'crystal';

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
  uiStyle: UiStyle = 'flat';
  private resetScrollAfterNavigation = false;
  private scrollResetTimer: ReturnType<typeof setTimeout> | undefined;

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
    this.watchRouterScroll();
  }

  private applyUiStyle(): void {
    const queryStyle = new URLSearchParams(window.location.search).get('ui');
    const storedStyle = localStorage.getItem('san11-ui-style');
    const style = this.normalizeUiStyle(queryStyle) ?? this.normalizeUiStyle(storedStyle) ?? 'flat';

    this.setUiStyle(style);
    (window as any).setSan11UiStyle = (nextStyle: UiStyle | 'classic' | 'flat2d' | 'glass3' | 'default') => {
      this.setUiStyle(this.normalizeUiStyle(nextStyle) ?? 'flat');
    };
  }

  setUiStyle(nextStyle: UiStyle): void {
    const style = this.normalizeUiStyle(nextStyle) ?? 'flat';
    this.uiStyle = style;
    localStorage.setItem('san11-ui-style', style);
    document.body.classList.toggle('ui-style-clean', style === 'clean');
    document.body.classList.toggle('ui-style-classic', style === 'clean');
    document.body.classList.toggle('ui-style-default', style === 'clean');
    document.body.classList.toggle('ui-style-flat', style === 'flat');
    document.body.classList.toggle('ui-style-flat2d', style === 'flat');
    document.body.classList.toggle('ui-style-crystal', style === 'crystal');
    document.body.classList.toggle('ui-style-glass3', style === 'crystal');
  }

  getUiStyleIndex(): number {
    if (this.uiStyle === 'crystal') {
      return 2;
    }
    if (this.uiStyle === 'flat') {
      return 1;
    }
    return 0;
  }

  private normalizeUiStyle(value: string | null): UiStyle | null {
    if (value === 'clean' || value === 'classic' || value === 'default') {
      return 'clean';
    }
    if (value === 'flat' || value === 'flat2d') {
      return 'flat';
    }
    if (value === 'crystal' || value === 'glass3') {
      return 'crystal';
    }
    return null;
  }

  private watchRouterScroll(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.resetScrollAfterNavigation = event.navigationTrigger !== 'popstate';
      }

      if (event instanceof NavigationEnd && this.resetScrollAfterNavigation && !this.urlHasFragment(event.urlAfterRedirects)) {
        this.scheduleScrollReset();
      }
    });
  }

  private urlHasFragment(url: string): boolean {
    return this.router.parseUrl(url).fragment !== null;
  }

  private scheduleScrollReset(): void {
    clearTimeout(this.scrollResetTimer);
    this.scrollResetTimer = setTimeout(() => {
      requestAnimationFrame(() => this.scrollPageToTop());
      setTimeout(() => this.scrollPageToTop(), 250);
    }, 0);
  }

  private scrollPageToTop(): void {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.querySelector<HTMLElement>('mat-sidenav-content')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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
