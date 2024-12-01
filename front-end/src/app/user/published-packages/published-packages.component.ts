import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Package } from '../../../proto/san11-platform.pb';
import { NotificationService } from '../../common/notification.service';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';

@Component({
  selector: 'app-published-packages',
  templateUrl: './published-packages.component.html',
  styleUrls: ['./published-packages.component.css']
})
export class PublishedPackagesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userId: string;

  displayedColumns: string[] = ['name', 'createTime', 'downloadCount'];
  dataSource: MatTableDataSource<Package>;
  publishedPackages: Package[] = [];
  constructor(
    private notificationService: NotificationService,
    private san11pkService: San11PlatformServiceService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.userId = params.userId;
      this.loadPackageList(this.userId);
    });
  }

  loadPackageList(userId: string) {
    this.publishedPackages = []; 
    // TODO: Reimplement this logic with SearchPackage.
  }

  onPackageClick(san11Package: Package) {
    this.router.navigate(san11Package.name.split('/'));
  }
}
