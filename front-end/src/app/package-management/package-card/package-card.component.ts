import { Component, OnInit, Input, Inject } from '@angular/core';
import { Package } from '../../../proto/san11-platform.pb'
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs'
import { HttpEventType } from "@angular/common/http";

import * as FileSaver from 'file-saver';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { NotificationService } from "../../common/notification.service";
import { Binary, Version } from '../../../proto/san11-platform.pb'
import { Url } from 'url';

import { GlobalConstants } from '../../common/global-constants'
import { getPackageUrl } from '../../utils/package_util'
import { getBinaryFilename } from '../../utils/binary_util'

import { LoadingComponent } from "../../common/components/loading/loading.component";
import { DownloadService } from "../../service/download.service";
import { saveAs } from 'file-saver'
import { PackageDetailComponent } from "../package-detail/package-detail.component";


@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.css']
})
export class PackageCardComponent implements OnInit {
  @Input() package: Package;

  authorName: string;

  screenshot: Url = undefined;
  selectedBinary;

  hideScreenshot: boolean = true;


  loadingDialog;
  downloadProgress = 0;
  downloadProgressBar = false;

  acceptFileType: string;


  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private san11PlatformServiceService: San11PlatformServiceService,
    private downloads: DownloadService,
  ) { }

  ngOnInit(): void {

    this.san11PlatformServiceService.getUser(this.package.authorId).subscribe(
      user => this.authorName = user.username
    );
    this.loadImage();
    this.acceptFileType = this.package.categoryId === '1' ? '.scp, .scp-en' : '.rar';
  }

  // openDeleteDialog() {
  //   this.dialog.open(DeleteDialog, {
  //     data: {
  //       package: this.package
  //     }
  //   });
  // }

  onUpdateBinary(binaryInput) {

    const selectedBinary = binaryInput.files[0];
    if (selectedBinary.size > GlobalConstants.maxBinarySize) {
      alert('上传文件必须小于: ' + (GlobalConstants.maxBinarySize/1024/1024).toString() + 'MB');
      return;
    }
    this.selectedBinary = selectedBinary;

    this.loadingDialog = this.dialog.open(LoadingComponent);

    let fileReader = new FileReader();
    fileReader.onload = () => {
      const parent = getPackageUrl(this.package)
      var arrayBuffer = fileReader.result;
      var bytes = new Uint8Array(arrayBuffer as ArrayBuffer);

      const binary: Binary = new Binary({
        version: new Version({ major: '1', minor: '0', patch: '0' }),
        description: '',
      });

      this.san11PlatformServiceService.uploadBinary(parent, binary, bytes).subscribe(

        status => {
          this.loadingDialog.close();
          this.notificationService.success('更新成功');
          this.router.navigate(['/']);
        },
        error => {
          this.loadingDialog.close();
          this.notificationService.warn('更新失败:' + error.statusMessage);
        }
      );

    }

    fileReader.readAsArrayBuffer(this.selectedBinary);
  }

  onApprove() {
    this.san11PlatformServiceService.updatePackage(new Package({
      packageId: this.package.packageId,
      status: 'normal'
    })).subscribe(
      san11Package => {
        this.notificationService.success('审核通过')

        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error => {
        this.notificationService.warn('操作失败');
      }
    );
  }

  onDownload() {
    // this.downloadProgressBar = true;
    // this.san11PlatformServiceService.downloadBinary(getPackageUrl(this.package), this.package.binaryIds[this.package.binaryIds.length - 1]).subscribe(
    //   binary => {
    //     const fileUrl = GlobalConstants.fileServerUrl + '/' + binary.url;
    //     const filename = getBinaryFilename(this.package, binary);


    //     this.downloads.download(fileUrl, filename).subscribe(
    //       result => {
    //         if (result.type === HttpEventType.DownloadProgress) {
    //           const percentDone = Math.round(100 * result.loaded / result.total);
    //           this.downloadProgress = percentDone
    //         }
    //         if (result.type === HttpEventType.Response) {
    //           saveAs(result.body, filename);
    //         }
    //       }
    //     );

    //     // FileSaver.saveAs(fileUrl, filename);
    //   },
    //   error => {
    //     this.notificationService.warn('下载失败'+error.statusMessage);
    //   }
    // );
  }

  loadImage() {
    if (this.package.imageUrls.length === 0) {
      this.screenshot = GlobalConstants.fileServerUrl + '/images/san11-screenshot.jpg';
    } else {
      this.screenshot = GlobalConstants.fileServerUrl + '/' + this.package.imageUrls[0];
    }

  }

  screenshotLoaded() {
    this.hideScreenshot = false;
  }

  isAdmin() {
    return localStorage.getItem('userType') === 'admin';
  }

  isAuthor() {
    return this.package.authorId === localStorage.getItem('userId');
  }


  onClick() {
    console.log('click');
    this.dialog.open(PackageDetailComponent, {
      data: {
        package: this.package
      }
    });
  }

}

export interface DialogData {
  package: Package
}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
  styleUrls: ['./package-card.component.css']
})
export class DeleteDialog {
  package: Package;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private san11PlatformServiceService: San11PlatformServiceService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.package = data.package
  }

  onDeleteConfirm() {
    console.log('In delete');
    this.san11PlatformServiceService.deletePackage(this.package).subscribe(
      value => {
        this.notificationService.success('删除成功');
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error => {
        this.notificationService.warn('删除失败:'+error.statusMessage);
      }
    );
  }
}