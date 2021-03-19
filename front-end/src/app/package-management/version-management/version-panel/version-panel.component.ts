import { Component, OnInit, Input, Version } from '@angular/core';
import { Binary, Package, User, Version as PbVersion } from "../../../../proto/san11-platform.pb";
import { NotificationService } from "../../../common/notification.service";

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { version2str } from "../../../utils/binary_util";
import { getAcceptFileType } from "../../../utils/resrouce_util";
import { getPackageUrl } from "../../../utils/package_util";
import { BinaryService } from "../../../service/binary-service";
import { CreateNewVersionComponent, VersionData } from "../create-new-version/create-new-version.component";

// export interface BinaryElement {
//   version: string;
//   date: string;
//   downloadcount: number;
//   binaryid: string;
//   packageid: string;
//   url: string;
//   description: string;
//   string tag = 8;
// }
@Component({
  selector: 'app-version-panel',
  templateUrl: './version-panel.component.html',
  styleUrls: ['./version-panel.component.css']
})
export class VersionPanelComponent implements OnInit {
  @Input() package: Package;
  displayedColumns: string[] = ['version', 'createTimestamp', 'downloadCount', 'action-download'];

  binaries: Binary[]; 
  constructor(
    private notificationService: NotificationService,
    private binaryService: BinaryService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.fetchBinaries();
  }


  getVersionStr(binary: Binary): string {
    return version2str(binary.version);
  }

  onUpdate(){
    this.dialog.open(CreateNewVersionComponent, {
      data: {
        latestVersion: this.binaries.length > 0 ? this.binaries[0].version : new PbVersion({major: "1", minor: "-1", patch: "0"}),
        acceptFileType: getAcceptFileType(this.package.categoryId),
        parent: getPackageUrl(this.package)
      }
    }).afterClosed().subscribe(
      data => {
        console.log(data);
        if (data != undefined) {
          // new version is created
          this.fetchBinaries();
        }
      }
    );

  }

  fetchBinaries() {
    this.binaryService.listBinaries(this.package.packageId).subscribe(
      resp => {
        this.binaries = resp.binaries;
        console.log(this.binaries);
      },
      error => {
        this.notificationService.warn('获取版本列表失败:'+error.statusMessage);
      }
    );
  }

  onDownload(binaryId: string) {
    console.log('download ' + binaryId);
  }
}
