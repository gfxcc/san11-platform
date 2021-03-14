import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Package } from '../../../proto/san11-platform.pb'
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';

import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  category_id: number;

  packages: Package[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private san11PlatformServiceService: San11PlatformServiceService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: any) => {
        this.category_id = Number(params['id']);
        console.log('id=' + this.category_id.toString());
        this.loadPackages();
      }
    );
  }

  loadPackages(): void {
    console.log(this.category_id);
    this.san11PlatformServiceService.listPackages(this.category_id, 0, "0").subscribe(
      value => this.packages=value.packages,
      error => {
        this._snackBar.open("载入工具列表失败:" + error.statusMessage, 'Done', {
          duration: 10000,
        });
      }
    );
  }

}
