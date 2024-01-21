import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isAdmin } from 'src/app/utils/user_util';
import { User } from '../../../proto/san11-platform.pb';
import { getFullUrl } from '../../utils/resrouce_util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('imageInput') imageInputElement: ElementRef

  user: User;
  selectedIndex = 0;

  tabs = [
    {
      label: '作品',
      link: ['publishedPackages'],
    },
    {
      label: '文章',
      link: ['articles'],
    },
    {
      label: '时间线',
      link: ['timeline'],
    },
  ];

  privateTabs = [
    {
      label: '🔒 收件箱',
      link: ['inbox'],
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => {
        if (data.user) {
          this.user = data.user;
          // this.selectedTabChange({ index: 0 });
          if (this.user.userId === localStorage.getItem('userId') || isAdmin()) {
            this.tabs = this.tabs.concat(this.privateTabs);
          }
        }
      }
    );

    const patterns = this.router.url.split('/');
    switch (patterns[patterns.length - 1]) {
      case 'publishedPackages':
        this.selectedIndex = 0;
        break;
      case 'timeline':
        this.selectedIndex = 1;
        break;
      default:
        this.selectedIndex = 0;
    }
  }

  // getter
  get userImageUrl() {
    return getFullUrl(this.user.imageUrl);
  }
  // getter end

  selectedTabChange(event: { index: number }) {
    const link = this.tabs[event.index].link;
    this.router.navigate(link, { relativeTo: this.route, state: { user: this.user } });
  }
}
