import { Component, OnInit, Input, Inject } from '@angular/core';
import { Package } from '../../proto/san11-platform.pb'
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { saveAs } from 'file-saver';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { San11PlatformServiceService } from '../san11-platform-service.service';
import { Binary, Version } from '../../proto/san11-platform.pb'


@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.css']
})
export class PackageCardComponent implements OnInit {
  @Input() package: Package;

  authorName: string;
  screenshot: any = '../../assets/images/san11-screenshots/san11-screenshot1.jpg';
  retrieveURL;
  screenshotImage;
  selectedBinary;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private san11PlatformServiceService: San11PlatformServiceService
  ) { }

  ngOnInit(): void {
    this.san11PlatformServiceService.getUser(this.package.authorId).subscribe(
      user => this.authorName = user.username
    );
    this.san11PlatformServiceService.getImage(this.package.imageIds[0]).subscribe(
      image => {
        console.log(image);
        this.screenshotImage = image;
        this.loadImage();
      }
    );
  }

  openDeleteDialog() {
    this.dialog.open(DeleteDialog, {
      data: {
        package: this.package
      }
    });
  }

  onUpdateBinary(binaryInput) {

    this.selectedBinary = binaryInput.files[0];

    let fileReader = new FileReader();
    fileReader.onload = () => {

      var parent = "packages" + '/' + this.package.packageId.toString();

      var arrayBuffer = fileReader.result;
      var bytes = new Uint8Array(arrayBuffer as ArrayBuffer);

      const binary: Binary = new Binary({
        version: new Version({ major: '1', minor: '0', patch: '0' }),
        description: '',
        data: bytes
      });

      this.san11PlatformServiceService.uploadBinary(parent, binary).subscribe(

        status => {
          if (status.code != '0') {
            this._snackBar.open('更新失败:'+status.message, 'Done', {
              duration: 10000,
            });
            return;
          }

          this._snackBar.open("更新成功", 'Done', {
            duration: 10000,
          });
          this.router.navigate(['/']);
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
        this._snackBar.open("操作失败", 'Done', {
          duration: 10000,
        });
      }
    );
  }

  onDownload() {
    this.san11PlatformServiceService.getBinary(this.package.binaryIds[this.package.binaryIds.length-1]).subscribe(
      binary => {
        const file : File = new File([binary.data], this.package.name+'.scp')
        saveAs(file);
      }
    ); 

  }

  loadImage() {
    const blob = new Blob([this.screenshotImage.data]);
    const unsafeImageUrl = URL.createObjectURL(blob);
    this.screenshot = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
  }

  isAdmin() {
    return localStorage.getItem('userType') === 'admin';
  }

  isAuthor(san11Package: Package) {
    return san11Package.authorId === localStorage.getItem('userId');
  }

  hasBinary() {
    return this.package.binaryIds.length > 0;
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