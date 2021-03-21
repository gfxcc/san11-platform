import { Component, OnInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Package, Version } from '../../../proto/san11-platform.pb'
import { San11PlatformServiceService } from '../../service/san11-platform-service.service'
import { Binary } from '../../../proto/san11-platform.pb';

import { getPackageUrl } from '../../utils/package_util'
import { GlobalConstants } from '../../common/global-constants'
import { LoadingComponent } from '../../common/components/loading/loading.component'

import { NotificationService } from '../../common/notification.service'



@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.css']
})
export class CreatePackageComponent implements OnInit {

  selectedFile: File;
  selectedImage: File;
  selectedCategory: string;
  createdPackage: Package;

  acceptFileType: string = '.scp, .scp-en';

  loading;

  categories = [
    { value: '1', viewValue: 'SIRE(2) 插件', disabled: false },
    { value: '2', viewValue: '修改工具', disabled: false },
    { value: '3', viewValue: 'MOD (未开放)', disabled: true }
  ];

  constructor(
    public notificationService: NotificationService,
    public dialog: MatDialog,
    private router: Router,
    private san11PlatformServiceService: San11PlatformServiceService) { }

  ngOnInit(): void {
  }

  createPackage(createPackageForm) {

    console.log(this.selectedFile);
    if (this.selectedImage === undefined) {
      this.notificationService.warn('请选择截图');
      return;
    }

    if (this.selectedFile === undefined) {
      this.notificationService.warn('请选择文件');
      return;
    }

    let dialogRef = this.dialog.open(AuthorDialog);
    const sub = dialogRef.componentInstance.onAdd.subscribe(() => {

      this.loading = this.dialog.open(LoadingComponent);

      this.san11PlatformServiceService.createPackage(new Package({
        packageId: "0",
        name: createPackageForm.value.name,
        description: createPackageForm.value.description,
        categoryId: createPackageForm.value.category, // hardcoded to SIRE Plugin
        authorId: "0",
        imageUrls: []
      })).subscribe(
        san11Package => {

          this.createdPackage = san11Package;
          this.uploadImage();

        },
        error => {
          this.notificationService.warn('创建工具失败:'+error.statusMessage);
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

        url => {
          this.uploadBinary();
        },
        error => {
          this.loading.close();
          this.notificationService.warn('上传截图失败: ' + error.statusMessage);
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

          this.notificationService.success('创建成功，请耐心等待审核。预期 1-2 天')
          this.router.navigate(['/']);

        },
        error => {
          this.loading.close();

          this.notificationService.warn('上传文件失败: ' + error.statusMessage)
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


  categoryChanged(categoryId: string) {
    if (categoryId === '1') {
      this.acceptFileType = '.scp, .scp-en';
    } else {
      this.acceptFileType = '.rar';
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

