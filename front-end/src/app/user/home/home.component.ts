import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../proto/san11-platform.pb';
import { NotificationService } from '../../common/notification.service';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { UploadService } from '../../service/upload.service';
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
      disabled: false,
    },
    {
      label: '文章',
      link: ['articles'],
      disabled: false,
    },
    {
      label: '时间线',
      link: ['timeline'],
      disabled: false
    },
    // {
    //   label: '关于',
    //   link: ['about']
    // }
  ];

  constructor(
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private uploadService: UploadService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => {
        if (data.user) {
          this.user = data.user;
          // this.selectedTabChange({ index: 0 });
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
