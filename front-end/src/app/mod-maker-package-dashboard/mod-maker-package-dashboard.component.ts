import { Component, OnInit } from '@angular/core';

import { Package } from '../../proto/san11-platform.pb'
import { San11PlatformServiceService } from '../service/san11-platform-service.service';


@Component({
  selector: 'app-mod-maker-package-dashboard',
  templateUrl: './mod-maker-package-dashboard.component.html',
  styleUrls: ['./mod-maker-package-dashboard.component.css']
})
export class ModMakerPackageDashboardComponent implements OnInit {

  packages: Package[] = [];

  constructor(private san11PlatformServiceService: San11PlatformServiceService) { }

  ngOnInit(): void {
    // this.getModMakerPackages();
  }


  // getModMakerPackages(): void {
  //   this.packages = this.san11PlatformServiceService.getModMakerPackages();
  // }


}
