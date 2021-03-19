import { Component, OnInit, Inject } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { GlobalConstants } from '../../common/global-constants'
import { Package, User } from "../../../proto/san11-platform.pb";
import { getFullUrl } from "../../utils/resrouce_util";
import { San11PlatformServiceService } from "../../service/san11-platform-service.service";
import { NotificationService } from "../../common/notification.service";

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';


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
  author: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) { 
    this.package = data.package
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

  onDelete(){

  }

  onHide() {

  }

}
