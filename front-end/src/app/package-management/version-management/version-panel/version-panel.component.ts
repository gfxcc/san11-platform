import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Binary, Package, User, Version as PbVersion } from "../../../../proto/san11-platform.pb";
import { NotificationService } from "../../../common/notification.service";

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HttpEventType } from "@angular/common/http";
import { version2str, getBinaryFilename } from "../../../utils/binary_util";
import { getAcceptFileType } from "../../../utils/resrouce_util";
import { getPackageUrl } from "../../../utils/package_util";
import { BinaryService } from "../../../service/binary-service";
import { DownloadService } from "../../../service/download.service";
import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { CreateNewVersionComponent, VersionData } from "../create-new-version/create-new-version.component";
import { TextDialogComponent, TextData } from "../../../common/components/text-dialog/text-dialog.component";
import { GlobalConstants } from "../../../common/global-constants";
import { saveAs } from 'file-saver'
import { increment } from '../../../utils/number_util';
import { isAdmin } from '../../../utils/user_util';

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
  @Output() downloadEvent = new EventEmitter();
  displayedColumns: string[] = ['version', 'createTimestamp', 'downloadCount', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  binaries: Binary[];
  dataSource: MatTableDataSource<Binary>;
  binaryOnDownload: Binary;

  downloadProgress: Number;
  downloadProgressBar = false;

  updateElement;

  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private binaryService: BinaryService,
    private dialog: MatDialog,
    private downloads: DownloadService,
  ) { }

  ngOnInit(): void {
    this.fetchBinaries();

    if (isAdmin() || this.isAuthor()) {
      this.updateElement = true;
    } else {
      this.updateElement = false;
    }
  }


  getVersionStr(binary: Binary): string {
    return version2str(binary.version);
  }

  onUpdate() {
    this.dialog.open(CreateNewVersionComponent, {
      data: {
        latestVersion: this.binaries.length > 0 ? this.binaries[0].version : new PbVersion({ major: "1", minor: "-1", patch: "0" }),
        acceptFileType: getAcceptFileType(this.package.categoryId),
        parent: getPackageUrl(this.package),
        categoryId: this.package.categoryId,
      }
    }).afterClosed().subscribe(
      data => {
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
        this.configDataSource();
      },
      error => {
        this.notificationService.warn('获取版本列表失败:' + error.statusMessage);
      }
    );
  }

  configDataSource() {
    this.dataSource = new MatTableDataSource(this.binaries);
    this.dataSource.paginator = this.paginator;
  }

  onDescription(binary: Binary) {
    this.dialog.open(TextDialogComponent, {
      data: {
        title: "更新日志",
        content: binary.description
      }
    });
  }

  onDownload(binary: Binary) {
    this.downloadProgress = 0;
    this.downloadProgressBar = true;
    this.binaryOnDownload = binary;
    this.san11pkService.downloadBinary(getPackageUrl(this.package), binary.binaryId).subscribe(
      binary => {
        const fileUrl = GlobalConstants.fileServerUrl + '/' + binary.url;
        const filename = getBinaryFilename(this.package, binary);

        this.downloads.download(fileUrl, filename).subscribe(
          result => {
            if (result.type === HttpEventType.DownloadProgress) {
              const percentDone = Math.round(100 * result.loaded / result.total);
              this.downloadProgress = percentDone
            }
            if (result.type === HttpEventType.Response) {
              saveAs(result.body, filename);
              this.downloadEvent.emit();
              this.binaryOnDownload.downloadCount = increment(this.binaryOnDownload.downloadCount);
            }
          },
          error => {
            this.notificationService.warn('下载失败: ' + error.name);
          }
        );
      },
      error => {
        this.notificationService.warn('下载失败' + error.statusMessage);
      }
    );
  }

  onDownloadMethod(binary: Binary) {
    this.dialog.open(TextDialogComponent, {
      data: {
        title: '下载方式',
        content: binary.downloadMethod
      }
    });
    binary.downloadCount = increment(binary.downloadCount);
    this.downloadEvent.emit();
    this.san11pkService.downloadBinary(getPackageUrl(this.package), binary.binaryId).subscribe();
  }

  onDelete(binary: Binary) {
    if (!confirm('确定要删除 ' + version2str(binary.version) + ' 吗?')) {
      return;
    }
    this.san11pkService.deleteBinary(binary.binaryId).subscribe(
      empty => {
        this.notificationService.success('成功删除');
        this.fetchBinaries();
      },
      error => {
        this.notificationService.warn('删除失败:' + error.statusMessage);
      }
    );

  }

  isAdmin() {
    return isAdmin();
  }

  isAuthor() {
    return this.package.authorId === localStorage.getItem('userId');
  }
}
