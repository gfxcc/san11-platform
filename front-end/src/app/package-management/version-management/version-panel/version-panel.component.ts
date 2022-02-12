import { HttpEventType } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from "@angular/material/paginator";
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { Binary, DeleteBinaryRequest, DownloadBinaryRequest, FieldMask, ListBinariesRequest, ListBinariesResponse, Package, UpdateBinaryRequest, Version as PbVersion } from "../../../../proto/san11-platform.pb";
import { TextDialogComponent } from "../../../common/components/text-dialog/text-dialog.component";
import { GlobalConstants } from "../../../common/global-constants";
import { NotificationService } from "../../../common/notification.service";
import { BinaryService } from "../../../service/binary-service";
import { DownloadService } from "../../../service/download.service";
import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { getBinaryFilename, version2str } from "../../../utils/binary_util";
import { increment } from '../../../utils/number_util';
import { getCategoryId, getPackageUrl } from "../../../utils/package_util";
import { getAcceptFileType } from "../../../utils/resrouce_util";
import { isAdmin, signedIn } from '../../../utils/user_util';
import { CreateNewVersionComponent } from "../create-new-version/create-new-version.component";
import { Branch } from "./branch/branch.component";

@Component({
  selector: 'app-version-panel',
  templateUrl: './version-panel.component.html',
  styleUrls: ['./version-panel.component.css']
})
export class VersionPanelComponent implements OnInit {
  @Input() package: Package;
  @Output() downloadEvent = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['version', 'createTime', 'size', 'downloadCount', 'actions'];
  binaryOnDownload: Binary;

  downloadProgress: Number;
  downloadProgressBar = false;
  branchs: Branch[];
  tabSelectedIndex = 0;

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
    this.loadBinaries();
  }

  loadBinaries() {
    this.binaryService.listBinaries(new ListBinariesRequest({
      parent: this.package.name
    })).subscribe(
      (resp: ListBinariesResponse) => {
        this.branchs = ConvertToBranchs(resp.binaries, getCategoryId(this.package.name));
        // Set tabSelectedIndex to the first enabled tab.
        for (let i = 0; i != this.branchs.length; ++i) {
          if (!this.branchs[i].disabled) {
            this.tabSelectedIndex = i;
            break;
          }
        }
      },
      (error) => {
        this.notificationService.warn(`载入版本列表失败: ${error.statusMessage}`);
      }
    );
  }

  onUpdate() {
    const selectedTab = this.branchs[this.tabSelectedIndex];
    let latestVersions = {};
    this.branchs.forEach(branch => {
      latestVersions[branch.name] = branch.binaries.length > 0 ? branch.binaries[0].version : new PbVersion({ major: "1", minor: "-1", patch: "0" });
    });
    const categoryId = getCategoryId(this.package.name).toString();
    this.dialog.open(CreateNewVersionComponent, {
      disableClose: true,
      data: {
        latestVersions: latestVersions,
        acceptFileType: getAcceptFileType(categoryId, selectedTab.name),
        parent: getPackageUrl(this.package),
        categoryId: categoryId,
        tag: selectedTab.name,
        tags: this.branchs.map(x => x.name),
      }
    }).afterClosed().subscribe(
      data => {
        if (data != undefined) {
          // new version is created
          this.loadBinaries();
        }
      }
    );
  }

  onDescription(binary: Binary) {
    this.dialog.open(TextDialogComponent, {
      data: {
        title: "更新日志",
        content: binary.description,
        editable: this.hasEditPermission,
      }
    }).afterClosed().subscribe(
      data => {
        if (this.hasEditPermission && data && data.data != binary.description) {
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
    if (!signedIn() && getCategoryId(this.package.name) === 3) {
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
        this.loadBinaries();
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
        this.loadBinaries();
      },
      error => {
        this.notificationService.warn('删除失败:' + error.statusMessage);
      }
    );

  }

  get hasEditPermission() {
    return isAdmin() || this.package.authorId === localStorage.getItem('userId');
  }
}

// 
function ConvertToBranchs(binaries: Binary[], categoryId: number) {
  let branchs: Branch[];

  if (categoryId === 1) {
    branchs = [
      {
        name: 'SIRE 2',
        binaries: [],
        disabled: false,
      },
      {
        name: 'SIRE 1',
        binaries: [],
        disabled: false,
      },
    ]
  } else {
    let branchNames = new Set<string>();
    binaries.forEach(binary => {
      branchNames.add(binary.tag);
    });

    if (branchNames.size === 0) {
      branchs = [
        {
          name: '默认',
          binaries: [],
          disabled: false,
        }
      ];
    } else {
      branchs = Array.from(branchNames).map(name => {
        return { name: name, binaries: [], disabled: false };
      });
    }
  }

  // bucket binaries into each branchs  
  branchs.forEach(branch => {
    const selected = binaries.filter((binary: Binary) => binary.tag === branch.name);
    branch.binaries = selected;
    branch.disabled = selected.length === 0;
  });
  return branchs;
}