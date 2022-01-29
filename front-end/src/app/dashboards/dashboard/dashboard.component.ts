import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ListPackagesRequest, Package } from '../../../proto/san11-platform.pb';
import { NotificationService } from "../../common/notification.service";
import { EventEmiterService } from "../../service/event-emiter.service";
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  packages: Package[];

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private san11pkService: San11PlatformServiceService,
    private _eventEmiter: EventEmiterService,
  ) { }

  ngOnInit(): void {
    // this.route.params.subscribe(
    //   (params: any) => {
    //     this.categoryId = Number(params['categoryId']);
    //     this.loadPackages();
    //   }
    // );


    // this.route.parent.params.subscribe(params => {
    //   this.userId = params.userId;
    //   this.loadPackageList(this.userId);
    // });

    var obsComb = combineLatest(this.route.params, this.route.queryParams, this.route.parent.params,
      (params, qparams, parentParams) => ({ params, qparams, parentParams }));

    obsComb.subscribe(ap => {
      const categoryId = ap.params['categoryId'];
      const tagId = ap.qparams['tagId'];
      const query = ap.qparams['query']
      const userId = ap.parentParams.userId;

      if (query != undefined) {
        this.searchPackages(query);
      } else if (categoryId != undefined) {
        let request = new ListPackagesRequest({
          parent: `categories/${ap.params['categoryId']}`,
        })
        if (ap.qparams['tagId'] != undefined) {
          request.filter = `tags=${ap.qparams['tagId']}`;
        }
        this.loadPackages(request);
      } else if (userId != undefined) {
        // TODO: Reimplement this with SearchPackage.
        this.packages = [];
        this.loadPackagesInCate(userId, 1);
        this.loadPackagesInCate(userId, 2);
        this.loadPackagesInCate(userId, 3);
      }
    });
  }

  loadPackages(request: ListPackagesRequest): void {
    // this._eventEmiter.sendMessage({ categoryId: request.categoryId });
    this.san11pkService.listPackages(request).subscribe(
      resp => {
        this.packages = resp.packages
      },
      error => {
        this.notificationService.warn(`载入工具列表失败: ${error.statusMessage}`);
      }
    );
  }

  loadPackagesInCate(userId: string, category: number) {
    this.san11pkService.listPackages(new ListPackagesRequest({
      parent: `categories/${category.toString()}`,
      filter: `author_id=${userId}`
    })).subscribe(
      resp => {
        resp.packages.forEach(p => {
          this.packages.push(p)
        });
      },
      error => {
        this.notificationService.warn(`获取工具列表失败: ${error.statusMessage}`);
      }
    );
  }


  searchPackages(query: string): void {
    this.san11pkService.searchPackages(query, 0, '').subscribe(
      resp => {
        this.packages = resp.packages;
      },
      error => {
        this.notificationService.warn(`搜索失败: ${error.statusMessage}`);
      }
    );

  }
}
