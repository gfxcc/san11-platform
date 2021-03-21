import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Package } from '../../../proto/san11-platform.pb'
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { NotificationService } from "../../common/notification.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  category_id: number;

  packages: Package[] = [];

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private san11PlatformServiceService: San11PlatformServiceService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: any) => {
        this.category_id = Number(params['id']);
        this.loadPackages();
      }
    );
  }

  loadPackages(): void {
    this.san11PlatformServiceService.listPackages(this.category_id, 0, "0").subscribe(
      value => this.packages=value.packages,
      error => {
        this.notificationService.warn('载入工具列表失败:'+error.statusMessage);
      }
    );
  }

}
