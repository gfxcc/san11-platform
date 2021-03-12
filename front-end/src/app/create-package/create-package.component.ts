import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Package, Version } from '../../proto/san11-platform.pb'
import { San11PlatformServiceService } from '../service/san11-platform-service.service'
import { Binary } from '../../proto/san11-platform.pb';

import { getPackageUrl } from '../utils/package_util'


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

  primaryCategories = [
    { value: 'SIRE2 Plugin', viewValue: 'SIRE(2) 插件', disabled: false },
    { value: 'Tools', viewValue: '修改工具 (未开放)', disabled: true },
    { value: 'Mod', viewValue: 'MOD (未开放)', disabled: true }
  ];

  constructor(
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
      error => this._snackBar.open(error.statusMessage, 'Done', {
        duration: 10000,
      })
    );
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

      const binary = new Binary({version: new Version({ major: '1', minor: '0', patch: '0' }), 
                                 description: "n/a"});

      this.san11PlatformServiceService.uploadBinary(parent, binary, bytes).subscribe(

        status => {
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

        }
      );

    }

    fileReader.readAsArrayBuffer(this.selectedFile);
  }

  uploadFileHandler(fielInput) {
    this.selectedFile = fielInput.files[0];
  }

  uploadImageHandler(imageInput) {
    this.selectedImage = imageInput.files[0];
  }



}
