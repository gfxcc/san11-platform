import { Component, OnInit } from '@angular/core';

import { Package } from '../../package'

import { San11PlatformServiceService } from '../../service/san11-platform-service.service'

@Component({
  selector: 'app-player-package-dashboard',
  templateUrl: './player-package-dashboard.component.html',
  styleUrls: ['./player-package-dashboard.component.css']
})
export class PlayerPackageDashboardComponent implements OnInit {
  packages: Package[] = [];

  constructor(private san11PlatformServiceService: San11PlatformServiceService) { }

  ngOnInit(): void {
    // this.getPlayerPackages();
  }


  // getPlayerPackages(): void {
  //   this.packages = this.san11PlatformServiceService.getPlayerPackages();
  // }


}
