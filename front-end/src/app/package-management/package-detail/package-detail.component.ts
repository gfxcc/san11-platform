import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { GlobalConstants } from '../../common/global-constants'
import { Package, User } from "../../../proto/san11-platform.pb";
import { getFullUrl } from "../../utils/resrouce_util";
import { San11PlatformServiceService } from "../../service/san11-platform-service.service";
import { NotificationService } from "../../common/notification.service";
import { TextInputDialogComponent, TextData } from "../../common/components/text-input-dialog/text-input-dialog.component";

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { isAdmin } from "../../utils/user_util";
import { increment } from '../../utils/number_util';


export interface DialogData {
  package: Package
}
@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.css']
})
export class PackageDetailComponent implements OnInit {

  images: ImageItem[] = [];
  package: Package = new Package({
    packageId: "1",
    name: "战场迷雾",
    description:"【测试】战争迷雾', '提供战争迷雾。城市，关港5格范围内提供视野。城塞2格范围内提供视野",
    createTimestamp: "2021-02-21",
    categoryId: "1",
    status: "normal",
    authorId: "1",
    imageUrls: ['categories/1/packages/43/images/0.jpeg', 'categories/1/packages/25/images/0.jpeg'],
    tags: ['规则修改'],
    downloadCount: "24",
  });
  author: User = new User({});


  // zones
  adminZone = false;
  authorZone = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
    private san11pkService: San11PlatformServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
  ) { 
    this.package = data.package;
    if (this.package.imageUrls.length < 2) {
      this.package.imageUrls.push('images/sire2.jpg');
    }


    if (this.isAdmin() && this.package.status === 'under_review') {
      this.adminZone = true;
    }
    if (this.isAdmin() || this.isAuthor()) {
      this.authorZone = true;
    }
  }

  ngOnInit(): void {

    this.package.imageUrls.forEach(imageUrl => {
      const fullImageUrl = getFullUrl(imageUrl);
      this.images.push(new ImageItem({ src: fullImageUrl, thumb: fullImageUrl}));
      console.log(this.images);
    });

    this.san11pkService.getUser(this.package.authorId).subscribe(
      user => {
        this.author = user;
      },
      error => {
        this.notificationService.warn('无法获取作者信息:' + error.statusMessage);
      }
    );


  }

  // admin
  onApprove() {
    this.san11pkService.updatePackage(new Package({
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



  // author
  onDelete(){
    if (confirm('确认要删除 ' + this.package.name + ' 吗？')) {
      this.san11pkService.deletePackage(this.package).subscribe(
        status => {
          this.notificationService.success('成功删除');
          
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

  onHide() {

  }

  onUpdateDescription() {
    this.dialog.open(TextInputDialogComponent, {
      data: {
        title: "描述",
        description: this.package.description
      }
    }).afterClosed().subscribe(
      data => {
        if (data != undefined) {
          const newDescription = data.data;
          const newPackage = new Package({
            packageId: this.package.packageId,
            description: newDescription
          });
          this.san11pkService.updatePackage(newPackage).subscribe(
            san11Package => {
              this.package.description = newDescription;
              this.notificationService.success("更新成功");
            },
            error => {
              this.notificationService.warn("更新失败: " + error.statusMessage);
            }
          );
        }
      }
    );
    
  }
  onUpdateScreenshot() {

  }

  // childs
  onChildDownload(msg) {
    this.package.downloadCount = increment(this.package.downloadCount);
  }


  // utils
  isAdmin() {
    return isAdmin();
  }


  isAuthor() {
    return this.package.authorId === localStorage.getItem('userId');
  }
}
