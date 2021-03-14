import { Component, OnInit, Input, Inject } from '@angular/core';
import { Package } from '../../../proto/san11-platform.pb'
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import * as FileSaver from 'file-saver';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { San11PlatformServiceService } from '../../service/san11-platform-service.service';
import { Binary, Version } from '../../../proto/san11-platform.pb'
import { Url } from 'url';

import { GlobalConstants } from '../../common/global-constants'
import { getPackageUrl } from '../../utils/package_util'
import { getBinaryFilename } from '../../utils/binary_util'

import { LoadingComponent } from "../../common/components/loading/loading.component";

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


  loading;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private san11PlatformServiceService: San11PlatformServiceService
  ) { }

  ngOnInit(): void {
    console.log(this.package);

    this.san11PlatformServiceService.getUser(this.package.authorId).subscribe(
      user => this.authorName = user.username
    );
    this.loadImage();
  }

  openDeleteDialog() {
    this.dialog.open(DeleteDialog, {
      data: {
        package: this.package
      }
    });
  }

  onUpdateBinary(binaryInput) {

    const selectedBinary = binaryInput.files[0];
    if (selectedBinary.size > GlobalConstants.maxBinarySize) {
      alert('上传文件必须小于: ' + (GlobalConstants.maxBinarySize/1024/1024).toString() + 'MB');
      return;
    }

    this.selectedBinary = selectedBinary;

    this.loading = this.dialog.open(LoadingComponent);

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
          this.loading.close();
          if (status.code != '0') {
            this._snackBar.open('更新失败:' + status.message, 'Done', {
              duration: 10000,
            });
            return;
          }

          this._snackBar.open("更新成功", 'Done', {
            duration: 10000,
          });
          this.router.navigate(['/']);
        },
        error => {
          this.loading.close();

          this._snackBar.open('更新失败:' + error.statusMessage, 'Done', {
            duration: 10000,
          });
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
        this._snackBar.open("审核通过", 'Done', {
          duration: 10000,
        });

        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error => {
        this._snackBar.open("操作失败:" + error.statusMessage, 'Done', {
          duration: 10000,
        });
      }
    );
  }

  onDownload() {
    this.san11PlatformServiceService.downloadBinary(getPackageUrl(this.package), this.package.binaryIds[this.package.binaryIds.length - 1]).subscribe(
      binary => {
        const fileUrl = GlobalConstants.fileServerUrl + '/' + binary.url;
        const filename = getBinaryFilename(this.package, binary);

        FileSaver.saveAs(fileUrl, filename);
      },
      error => {
        this._snackBar.open("下载失败: " + error.statusMessage, 'Done', {
          duration: 10000,
        });
      }
    );
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

  hasBinary() {
    return this.package.binaryIds.length > 0;
  }


  onClick() {
    console.log('hitted');
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
    private router: Router,
    private _snackBar: MatSnackBar,
    private san11PlatformServiceService: San11PlatformServiceService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.package = data.package
  }

  onDeleteConfirm() {
    console.log('In delete');
    this.san11PlatformServiceService.deletePackage(this.package).subscribe(
      value => {
        this._snackBar.open("删除成功", 'Done', {
          duration: 10000,
        });
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error => {
        this._snackBar.open("发生错误", 'Done', {
          duration: 10000,
        });
      }
    );
  }
}