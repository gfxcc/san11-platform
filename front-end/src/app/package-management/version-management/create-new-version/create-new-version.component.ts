import { Component, OnInit, Input, Inject, ElementRef, ViewChild} from '@angular/core';
import { isNumeric } from 'rxjs/util/isNumeric';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { version } from 'process';

import { Version, Binary } from "../../../../proto/san11-platform.pb";
import { version2str } from "../../../utils/binary_util";
import { increment } from "../../../utils/number_util";
import { GlobalConstants } from "../../../common/global-constants";
import { LoadingComponent } from "../../../common/components/loading/loading.component";
import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { NotificationService } from "../../../common/notification.service";

export interface VersionData {
  latestVersion: Version, 
  acceptFileType: string,
  parent: string
}
@Component({
  selector: 'app-create-new-version',
  templateUrl: './create-new-version.component.html',
  styleUrls: ['./create-new-version.component.css']
})
export class CreateNewVersionComponent implements OnInit {
  // inputs
  latestVersion: Version;
  acceptFileType: string;
  parent: string;

  // locals
  newVersion: Version;
  updateType: string='minor';

  selectedFile: File;
  loadingDialog;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: VersionData,
    private dialog: MatDialog,
    private san11PkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateNewVersionComponent>,
  ) { 
    this.latestVersion = data.latestVersion;
    this.acceptFileType = data.acceptFileType;
    this.parent = data.parent;
  }

  ngOnInit(): void {
    this.onVersionSelectorUpdate('minor');
  }

  onVersionSelectorUpdate(updateTypeValue) {
    this.updateType = updateTypeValue;
    console.log(this.updateType);

    if (updateTypeValue === 'major') {
      this.newVersion = new Version({
        major: increment(this.latestVersion.major),
        minor: "0",
        patch: "0"
      });
    } else if (updateTypeValue === 'minor') {
      this.newVersion = new Version({
        major: this.latestVersion.major,
        minor: increment(this.latestVersion.minor),
        patch: "0"
      });
    } else if (updateTypeValue === 'patch'){
      this.newVersion = new Version({
        major: this.latestVersion.major,
        minor: this.latestVersion.minor==='-1' ? '0' : this.latestVersion.minor,
        patch: increment(this.latestVersion.patch)
      });
    } else {
      this.newVersion = new Version({
        major: this.latestVersion.major,
        minor: increment(this.latestVersion.minor),
        patch: this.latestVersion.patch
      });
    }
  }

  @ViewChild('fileInput') fileInputElement: ElementRef
  selectFile(fileInput) {
    const file = fileInput.files[0];
    if (file.size > GlobalConstants.maxBinarySize) {
      alert('上传文件必须小于: ' + (GlobalConstants.maxBinarySize/1024/1024).toString() + 'MB');
      this.fileInputElement.nativeElement.value = '';
    } else{
      this.selectedFile = file;
    }
  }

  onCreateVersion(createVersionForm) {
    if (this.selectedFile === undefined) {
      this.notificationService.warn('请选择文件');
      return;
    }

    this.loadingDialog = this.dialog.open(LoadingComponent);

    let fileReader = new FileReader();
    fileReader.onload = () => {
      var arrayBuffer = fileReader.result;
      var bytes = new Uint8Array(arrayBuffer as ArrayBuffer);

      const binary: Binary = new Binary({
        version: this.newVersion,
        description: createVersionForm.value.description,
        tag: '',
      });

      this.san11PkService.uploadBinary(this.parent, binary, bytes).subscribe(

        status => {
          this.loadingDialog.close();
          this.notificationService.success('更新成功');
          this.onClose();
        },
        error => {
          this.loadingDialog.close();
          this.notificationService.warn('更新失败:' + error.statusMessage);

          this.onClose();
        }
      );

    }

    fileReader.readAsArrayBuffer(this.selectedFile);
  }

  getNewVersionStr() {
    return '  ' + version2str(this.newVersion);
  }

  onClose() {
    this.dialogRef.close({data: 'updated'});
  }



  updateMajor(input) {
    const pendingVersoin = new Version({major: input.value, minor: this.newVersion.minor, patch: this.newVersion.patch});
    if (!this.validateVersion(pendingVersoin)) {
      this.notificationService.warn("版本号不合法: 新的版本号必须大于最新的已发布版本");
      input.value = this.newVersion.major;
      return;
    }
    this.newVersion = pendingVersoin;
  }
  updateMinor(input) {
    const pendingVersoin = new Version({major: this.newVersion.major, minor: input.value, patch: this.newVersion.patch});
    if (!this.validateVersion(pendingVersoin)) {
      this.notificationService.warn("版本号不合法: 新的版本号必须大于最新的已发布版本");
      input.value = this.newVersion.minor;
      return;
    }
    this.newVersion = pendingVersoin;
  }
  updatePatch(input) {
    const pendingVersoin = new Version({major: this.newVersion.major, minor: this.newVersion.minor, patch: input.value});
    if (!this.validateVersion(pendingVersoin)) {
      this.notificationService.warn("版本号不合法: 新的版本号必须大于最新的已发布版本");
      input.value = this.newVersion.patch;
      return;
    }
    this.newVersion = pendingVersoin;
  }

  validateVersion(version: Version) {
    if (! (isNumeric(version.major) && isNumeric(version.minor) && isNumeric(version.patch))) {
      return false;
    }

    if (Number(version.major) < Number(this.latestVersion.major)
      || Number(version.minor) < Number(this.latestVersion.minor)
      || Number(version.patch) < Number(this.latestVersion.patch)
    ) {
      return false;
    }

    if (Number(version.major) === Number(this.latestVersion.major)
      && Number(version.minor) === Number(this.latestVersion.minor)
      && Number(version.patch) === Number(this.latestVersion.patch)
    ) {
      return false;
    }

    return true;
  }
}
