import { Component, OnInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Package, Version } from '../../../proto/san11-platform.pb'
import { San11PlatformServiceService } from '../../service/san11-platform-service.service'
import { Binary } from '../../../proto/san11-platform.pb';

import { getPackageUrl } from '../../utils/package_util'
import { GlobalConstants } from '../../common/global-constants'


class FileSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.css']
})
export class CreatePackageComponent implements OnInit {

  selectedFile: File;
  selectedImage: File;
  selectedPrimaryCategory: string;
  createdPackage: Package;

  loading;

  primaryCategories = [
    { value: 'SIRE2 Plugin', viewValue: 'SIRE(2) 插件', disabled: false },
    { value: 'Tools', viewValue: '修改工具 (未开放)', disabled: true },
    { value: 'Mod', viewValue: 'MOD (未开放)', disabled: true }
  ];

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private san11PlatformServiceService: San11PlatformServiceService) { }

  ngOnInit(): void {
  }

  createPackage(createPackageForm) {

    console.log(this.selectedFile);
    if (this.selectedImage === undefined) {
      this._snackBar.open("请选择截图", 'Done', {
        duration: 10000,
      });
      return;
    }

    if (this.selectedFile === undefined) {
      this._snackBar.open("请选择文件", 'Done', {
        duration: 10000,
      });
      return;
    }

    let dialogRef = this.dialog.open(AuthorDialog);
    const sub = dialogRef.componentInstance.onAdd.subscribe(() => {

      this.loading = this.dialog.open(Loading);

      this.san11PlatformServiceService.createPackage(new Package({
        packageId: "0",
        name: createPackageForm.value.name,
        description: createPackageForm.value.description,
        categoryId: "1", // hardcoded to SIRE Plugin
        authorId: "0",
        binaryIds: [],
        imageUrls: []
      })).subscribe(
        san11Package => {

          this.createdPackage = san11Package;
          this.uploadImage();

        },
        error => {
          this._snackBar.open(
            error.statusMessage, 'Done', {
            duration: 10000,
          }
          );

          this.loading.close();
        }
      );
    });

    dialogRef.afterClosed().subscribe(() => {
      // unsubscribe onAdd
    });


  }

  uploadImage() {
    let fileReader = new FileReader();
    fileReader.onload = () => {

      var parent = getPackageUrl(this.createdPackage);

      console.log('at 2');
      var arrayBuffer = fileReader.result;
      var bytes = new Uint8Array(arrayBuffer as ArrayBuffer);

      this.san11PlatformServiceService.uploadImage(parent, bytes).subscribe(

        status => {
          if (status.code != '0') {
            this._snackBar.open("上传截图失败: " + status.message, 'Done', {
              duration: 10000,
            });
            return;
          }
          this.uploadBinary();
        },
        error => {
          this.loading.close();

          this._snackBar.open("上传截图失败: " + error.statusMessage, 'Done', {
            duration: 10000,
          });
          return;
        }
      );

    }

    fileReader.readAsArrayBuffer(this.selectedImage);
  }

  uploadBinary() {
    let fileReader = new FileReader();
    fileReader.onload = () => {

      var parent = getPackageUrl(this.createdPackage);

      var arrayBuffer = fileReader.result;
      var bytes = new Uint8Array(arrayBuffer as ArrayBuffer);

      const binary = new Binary({
        version: new Version({ major: '1', minor: '0', patch: '0' }),
        description: "n/a"
      });

      this.san11PlatformServiceService.uploadBinary(parent, binary, bytes).subscribe(

        status => {
          this.loading.close();

          if (status.code != '0') {
            this._snackBar.open("上传文件失败: " + status.message, 'Done', {
              duration: 10000,
            });
            return;
          }

          this._snackBar.open("创建成功，请耐心等待审核。预期 1-2 天", 'Done', {
            duration: 10000,
          });
          this.router.navigate(['/']);

        },
        error => {
          this.loading.close();
          this._snackBar.open("上传文件失败: " + error.statusMessage, 'Done', {
            duration: 10000,
          });
        }
      );

    }

    fileReader.readAsArrayBuffer(this.selectedFile);
  }

  @ViewChild('fileInput') fileInputElement: ElementRef

  uploadFileHandler(fileInput) {
    const file = fileInput.files[0];
    if (file.size > GlobalConstants.maxBinarySize) {
      alert('上传文件必须小于: ' + (GlobalConstants.maxBinarySize/1024/1024).toString() + 'MB');
      this.fileInputElement.nativeElement.value = '';
    } else{
      this.selectedFile = file;
    }
  }

  @ViewChild('imageInput') imageInputElement: ElementRef
  uploadImageHandler(imageInput) {
    const image = imageInput.files[0];
    if (image.size > GlobalConstants.maxImageSize) {
      alert('上传图片必须小于: ' + (GlobalConstants.maxImageSize/1024/1024).toString() + 'MB');
      this.imageInputElement.nativeElement.value = '';
    } else {
      this.selectedImage = image;
    }
  }
}

@Component({
  selector: 'author-dialog',
  templateUrl: 'author-dialog.html',
  styleUrls: ['./create-package.component.css']
})
export class AuthorDialog {
  package: Package;

  constructor() {
  }

  onAdd = new EventEmitter();


  onAuthorConfirm() {
    console.log('In delete');
    this.onAdd.emit();
  }
}


@Component({
  selector: 'loading',
  templateUrl: 'loading.html',
  styleUrls: ['./create-package.component.css']
})
export class Loading {

  constructor() {
  }

}