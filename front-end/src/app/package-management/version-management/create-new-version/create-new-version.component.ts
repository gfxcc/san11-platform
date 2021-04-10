import { Component, OnInit, Input, Inject, ElementRef, ViewChild } from '@angular/core';
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
  parent: string,
  categoryId: string,
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
  categoryId: string;

  // locals
  newVersion: Version;
  updateType: string = 'minor';

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
    this.categoryId = data.categoryId;

    if (this.isFirstTimeUpload(this.latestVersion)) {
      this.updateType = 'custom';
    } else {
      this.updateType = 'minor';
    }
  }

  ngOnInit(): void {
    this.onVersionSelectorUpdate(this.updateType);
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
    } else if (updateTypeValue === 'patch') {
      this.newVersion = new Version({
        major: this.latestVersion.major,
        minor: this.latestVersion.minor === '-1' ? '0' : this.latestVersion.minor,
        patch: increment(this.latestVersion.patch)
      });
    } else {
      this.newVersion = new Version({
        major: this.latestVersion.major,
        minor: increment(this.latestVersion.minor),
        patch: "0"
      });
    }
  }

  @ViewChild('fileInput') fileInputElement: ElementRef
  selectFile(fileInput) {
    const file = fileInput.files[0];
    if (file.size > GlobalConstants.maxBinarySize) {
      alert('上传文件必须小于: ' + (GlobalConstants.maxBinarySize / 1024 / 1024).toString() + 'MB');
      this.fileInputElement.nativeElement.value = '';
    } else {
      this.selectedFile = file;
    }
  }

  onCreateVersion(createVersionForm) {
    if (this.categoryId != "3" && this.selectedFile === undefined) {
      this.notificationService.warn('请选择文件');
      return;
    }

    if (this.categoryId != '3') {

      this.loadingDialog = this.dialog.open(LoadingComponent);
      let fileReader = new FileReader();
      fileReader.onload = () => {
        this.createBinary(fileReader.result, createVersionForm);
      }
      fileReader.readAsArrayBuffer(this.selectedFile);
    } else {
      this.createBinary(undefined, createVersionForm);
    }
  }

  createBinary(data, createVersionForm) {
    var arrayBuffer = data;
    var bytes = new Uint8Array(arrayBuffer as ArrayBuffer);

    const binary: Binary = new Binary({
      version: this.newVersion,
      description: createVersionForm.value.description,
      tag: '',
      downloadMethod: this.categoryId === '3' ? createVersionForm.value.downloadMethod : '',
    });

    this.san11PkService.uploadBinary(this.parent, binary, bytes).subscribe(

      status => {
        if (this.loadingDialog != undefined) {
          this.loadingDialog.close();
        }
        this.notificationService.success('更新成功');
        this.onClose();
      },
      error => {
        if (this.loadingDialog != undefined) {
          this.loadingDialog.close();
        }
        this.notificationService.warn('更新失败:' + error.statusMessage);

        this.onClose();
      }
    );
  }

  onClose() {
    this.dialogRef.close({ data: 'updated' });
  }



  updateMajor(input) {
    const pendingVersoin = new Version({ major: input.value, minor: this.newVersion.minor, patch: this.newVersion.patch });
    if (!this.validateVersion(pendingVersoin)) {
      this.notificationService.warn("版本号不合法: 新的版本号必须大于最新的已发布版本");
      input.value = this.newVersion.major;
      return;
    }
    this.newVersion = pendingVersoin;
    console.log(this.newVersion);
  }
  updateMinor(input) {
    const pendingVersoin = new Version({ major: this.newVersion.major, minor: input.value, patch: this.newVersion.patch });
    if (!this.validateVersion(pendingVersoin)) {
      this.notificationService.warn("版本号不合法: 新的版本号必须大于最新的已发布版本");
      input.value = this.newVersion.minor;
      return;
    }
    this.newVersion = pendingVersoin;
    console.log(this.newVersion);
  }
  updatePatch(input) {
    const pendingVersoin = new Version({ major: this.newVersion.major, minor: this.newVersion.minor, patch: input.value });
    if (!this.validateVersion(pendingVersoin)) {
      this.notificationService.warn("版本号不合法: 新的版本号必须大于最新的已发布版本");
      input.value = this.newVersion.patch;
      return;
    }
    this.newVersion = pendingVersoin;
    console.log(this.newVersion);
  }

  validateVersion(version: Version) {
    if (isNaN(Number(version.major)) || isNaN(Number(version.minor)) || isNaN(Number(version.patch))) {
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

  isFirstTimeUpload(version: Version): boolean {
    if (version.major === '1' && version.minor === '-1' && version.patch === '0') {
      return true;
    } else {
      return false;
    }
  }
}
