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

  loading;

  categories = GlobalConstants.categories;

  constructor(
    public notificationService: NotificationService,
    public dialog: MatDialog,
    private router: Router,
    private san11PlatformServiceService: San11PlatformServiceService) { }

  ngOnInit(): void {
  }

  createPackage(createPackageForm) {

    let dialogRef = this.dialog.open(AuthorDialog);
    const sub = dialogRef.componentInstance.onAdd.subscribe(() => {

      this.loading = this.dialog.open(LoadingComponent);

      this.san11PlatformServiceService.createPackage(new Package({
        packageId: '0',
        packageName: createPackageForm.value.name,
        description: '',
        categoryId: createPackageForm.value.category, // hardcoded to SIRE Plugin
        authorId: '0',
        imageUrls: []
      })).subscribe(
        san11Package => {

          this.createdPackage = san11Package;
          this.loading.close();

          this.notificationService.success('创建成功')
          this.router.navigate(['categories', createPackageForm.value.category]);
        },
        error => {
          this.notificationService.warn('创建工具失败:' + error.statusMessage);
          this.loading.close();
        }
      );
    });

    dialogRef.afterClosed().subscribe(() => {
      // unsubscribe onAdd
    });


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

