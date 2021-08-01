import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FieldMask, Binary, Package, User, Version as PbVersion, DownloadBinaryRequest, DeleteBinaryRequest, ListBinariesRequest } from "../../../../proto/san11-platform.pb";
import { UpdateBinaryRequest } from "../../../../proto/san11-platform.pb";
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
import { isAdmin, signedIn } from '../../../utils/user_util';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
  displayedColumns: string[] = ['version', 'createTime', 'size', 'downloadCount', 'actions'];

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  binaries: Binary[];
  dataSource: MatTableDataSource<Binary>;
  binaries_2_0: MatTableDataSource<Binary>;
  binaries_1_3: MatTableDataSource<Binary>;
  binaryOnDownload: Binary;

  downloadProgress: Number;
  downloadProgressBar = false;
  tabs = [];
  tabSelectedIndex = 0;
  tags: string[];

  updateElement;


  downloadSub: Subscription;

  startTime: any;
  endTime: any;
  currTime: any;
  prevTime: any;
  speed: number = 0;
  SPEED_UPDATE_DELTA_RATE = 0.2;
  bytesReceied: number = 0;
  oldbytes: number = 0;
  unit: string = "Mbps";

  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private binaryService: BinaryService,
    private dialog: MatDialog,
    private downloads: DownloadService,
  ) {
  }

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
    const selectedTab = this.tabs[this.tabSelectedIndex];
    let latestVersions = {};
    this.tabs.forEach(tab => {
      latestVersions[tab.tag] = tab.dataSource.data.length > 0 ? tab.dataSource.data[0].version : new PbVersion({ major: "1", minor: "-1", patch: "0" });
    });
    this.dialog.open(CreateNewVersionComponent, {
      disableClose: true,
      data: {
        latestVersions: latestVersions,
        acceptFileType: getAcceptFileType(this.package.categoryId, selectedTab.tag),
        parent: getPackageUrl(this.package),
        categoryId: this.package.categoryId,
        tag: selectedTab.tag,
        tags: Array.from(this.tags)
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
    this.binaryService.listBinaries(new ListBinariesRequest({
      parent: this.package.name
    })).subscribe(
      resp => {
        this.binaries = resp.binaries;

        let tags = new Set<string>();
        this.binaries.forEach(binary => {
          tags.add(binary.tag);
        });
        this.tags = Array.from(tags);

        if (this.package.categoryId === '1') {
          this.tags = ['SIRE 2', 'SIRE 1']
        }
        if (this.tags.length === 0) {
          this.tags = ['默认'];
        }

        this.tabs = this.tags.map(tag => { return { tag: tag }; });
        this.configDataSource();
      },
      error => {
        this.notificationService.warn(`获取版本列表失败: ${error.statusMessage}`);
      }
    );
  }

  configDataSource() {
    this.tabs.forEach(tab => {
      tab.dataSource = new MatTableDataSource(this.binaries.filter((binary: Binary) => binary.tag === tab.tag));
      // tab.dataSource.paginator = this.paginator;
    });

    // this.dataSource.paginator = this.paginator;
  }

  onDescription(binary: Binary) {
    this.dialog.open(TextDialogComponent, {
      data: {
        title: "更新日志",
        content: binary.description,
        editable: this.isAuthor(),
      }
    }).afterClosed().subscribe(
      data => {
        if (this.isAuthor() && data && data.data != binary.description) {
          const request = new UpdateBinaryRequest({
            binary: new Binary({
              name: binary.name,
              description: data.data,
            }),
            updateMask: new FieldMask({
              paths: ['description']
            })
          });

          this.san11pkService.updateBinary(request).subscribe(
            binary => {
              this.notificationService.success('更新成功');
              this.fetchBinaries();
            },
            error => {
              this.notificationService.warn(`更新失败: ${error.statusMessage}`)
            }
          );
        }
      }
    );
  }

  onDownload(binary: Binary) {
    if (!signedIn() && this.package.categoryId === '3') {
      this.notificationService.warn('请登录');
      return;
    }

    if (this.downloadSub != undefined) {
      this.notificationService.warn(`下载中 ${this.downloadProgress}%... `);
      return;
    }
    this.downloadProgress = 0;
    this.downloadProgressBar = true;
    this.binaryOnDownload = binary;
    this.san11pkService.downloadBinary(new DownloadBinaryRequest({
      name: this.binaryOnDownload.name
    })).subscribe(
      binary => {
        const fileUrl = GlobalConstants.fileServerUrl + '/' + binary.file.uri;
        const filename = getBinaryFilename(this.package, binary);

        this.prevTime = new Date().getTime();
        this.oldbytes = 0;

        this.downloadSub = this.downloads.download(fileUrl, filename).subscribe(
          result => {
            if (result.type === HttpEventType.DownloadProgress) {
              const percentDone = Math.round(100 * result.loaded / result.total);
              this.downloadProgress = percentDone;

              this.bytesReceied = result.loaded / 1000000;
              this.currTime = new Date().getTime();
              let speed =
                (this.bytesReceied - this.oldbytes) /
                ((this.currTime - this.prevTime) / 1000); // mb/second
              if (speed < 1) {
                this.unit = "KB/S";
                speed *= 1000;
              } else this.unit = "MB/S";

              // Use Math.max(this.speed, 1) to handle this.speend == 0
              if (Math.abs(this.speed - speed) / Math.max(this.speed, 1) > this.SPEED_UPDATE_DELTA_RATE) {
                this.speed = speed;
              }
              this.prevTime = this.currTime;
              this.oldbytes = this.bytesReceied;

            }
            if (result.type === HttpEventType.Response) {
              this.downloadSub = undefined;

              saveAs(result.body, filename);
              this.downloadEvent.emit();
              this.binaryOnDownload.downloadCount = increment(this.binaryOnDownload.downloadCount);

              setTimeout(() => {
                this.downloadProgressBar = false;
              }, 5000);
            }
          },
          error => {
            this.downloadSub = undefined;
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
    this.san11pkService.downloadBinary(new DownloadBinaryRequest({
      name: binary.name
    })).subscribe();
  }

  onOffload(binary: Binary) {
    if (!confirm('确定要 ' + version2str(binary.version) + ' 的文件资源吗? (只清除资源，版本将会保留)')) {
      return;
    }
    this.san11pkService.updateBinary(new UpdateBinaryRequest({
      binary: new Binary({
        name: binary.name,
      }),
      updateMask: new FieldMask({
        paths: ['file']
      })
    })).subscribe(
      resp => {
        this.notificationService.success('卸载成功');
        this.fetchBinaries();
      },
      error => {
        this.notificationService.warn('卸载失败:' + error.statusMessage);
      }
    );
  }

  onDelete(binary: Binary) {
    if (!confirm('确定要删除 ' + version2str(binary.version) + ' 吗?')) {
      return;
    }
    this.san11pkService.deleteBinary(new DeleteBinaryRequest({
      name: binary.name
    })).subscribe(
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
