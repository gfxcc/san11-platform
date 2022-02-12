import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from "@angular/material/paginator";
import { Binary, DeleteBinaryRequest, ListBinariesRequest, ListBinariesResponse, Package, Version as PbVersion } from "../../../../proto/san11-platform.pb";
import { NotificationService } from "../../../common/notification.service";
import { BinaryService } from "../../../service/binary-service";
import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { version2str } from "../../../utils/binary_util";
import { getCategoryId, getPackageUrl } from "../../../utils/package_util";
import { getAcceptFileType } from "../../../utils/resrouce_util";
import { isAdmin } from '../../../utils/user_util';
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

  downloadProgressBar = false;
  downloadProgress: number;
  unit: string = "Mbps";
  speed: number = 0;

  displayedColumns: string[] = ['version', 'createTime', 'size', 'downloadCount', 'actions'];

  branchs: Branch[];
  tabSelectedIndex = 0;

  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    private binaryService: BinaryService,
    private dialog: MatDialog,
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

  // Create a new binary
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

  updateDownloadProgress(event) {
    this.downloadProgressBar = true;
    this.downloadProgress = event.progress;
    this.speed = event.speed;
    this.unit = event.unit;

    if (event.progress === 100) {
      setTimeout(() => {
        this.downloadProgressBar = false;
      }, 5000);
    }
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