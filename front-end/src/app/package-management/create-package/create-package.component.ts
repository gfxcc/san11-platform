import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreatePackageRequest, Package } from '../../../proto/san11-platform.pb';
import { LoadingComponent } from '../../common/components/loading/loading.component';
import { GlobalConstants } from '../../common/global-constants';
import { NotificationService } from '../../common/notification.service';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';







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

      this.san11PlatformServiceService.createPackage(new CreatePackageRequest({
        parent: `categories/${createPackageForm.value.category}`,
        package: new Package({
          packageName: createPackageForm.value.name,
          description: '',
          authorId: '0',
          imageUrls: []
        })
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

