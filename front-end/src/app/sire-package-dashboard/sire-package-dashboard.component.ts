import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Package } from '../../proto/san11-platform.pb'
import { San11PlatformServiceService } from '../san11-platform-service.service';


@Component({
  selector: 'app-sire-package-dashboard',
  templateUrl: './sire-package-dashboard.component.html',
  styleUrls: ['./sire-package-dashboard.component.css']
})
export class SirePackageDashboardComponent implements OnInit {

  packages: Package[] = [];

  constructor(private san11PlatformServiceService: San11PlatformServiceService,
              private router: Router) { }

  ngOnInit(): void {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.listSire2Packages();
  }

  listSire2Packages(): void {
    this.san11PlatformServiceService.listPackages("SIRE2 Plugin", "默认").subscribe(
      value => this.packages=value.packages,
      error => console.log(error),
      () => console.log("end"),
    );
  }

}
