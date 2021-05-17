import { Component, OnInit, Input, Inject, ElementRef, ViewChild } from '@angular/core';
import { isNumeric } from 'rxjs/util/isNumeric';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { version } from 'process';
import { v4 as uuid } from 'uuid'

import * as Editor from "../../../common/components/ckeditor/ckeditor";

import { CreateBinaryRequest, Version, Binary, UploadBinaryRequest } from "../../../../proto/san11-platform.pb";
import { version2str } from "../../../utils/binary_util";
import { increment } from "../../../utils/number_util";
import { GlobalConstants } from "../../../common/global-constants";
import { LoadingComponent } from "../../../common/components/loading/loading.component";
import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { NotificationService } from "../../../common/notification.service";
import { TextData, TextInputDialogComponent } from "../../../common/components/text-input-dialog/text-input-dialog.component";

import { UploadService } from "../../../service/upload.service";
import { Upload } from '../../../service/upload';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';


export interface VersionData {
  latestVersions,
  acceptFileType: string,
  parent: string,
  categoryId: string,
  tag: string,
  tags: string[]
}
@Component({
  selector: 'app-create-new-version',
  templateUrl: './create-new-version.component.html',
  styleUrls: ['./create-new-version.component.css']
})
export class CreateNewVersionComponent implements OnInit {
  @ViewChild('createVersionForm') createForm: NgForm;
  NEW_TAG_STR = '**新分支**';
  // inputs
  latestVersions: Version[];
  latestVersion: Version;
  acceptFileType: string;
  parent: string;
  categoryId: string;
  tag: string;
  tags: string[];

  // locals
  newVersion: Version;
  updateType: string = 'minor';

  file: File;
  loadingDialog;
  tmpUrl: string = undefined;


  descEditor = Editor;
  descEditor_element;
  descEditor_data: string;
  descEditor_config;

  selectSireVersion: string;
  convertedSireVersion: string;

  upload: Upload | undefined;
  uploadSub: Subscription;
  startTime: any;
  endTime: any;
  currTime: any;
  prevTime: any;
  speed: number = 0;
  bytesReceied: number = 0;
  oldbytes: number = 0;
  unit: string = "Mbps";

  autoCreateChecked = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: VersionData,
    private dialog: MatDialog,
    private san11PkService: San11PlatformServiceService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateNewVersionComponent>,
    public uploadService: UploadService,
  ) {
    this.latestVersions = data.latestVersions;
    this.acceptFileType = data.acceptFileType;
    this.parent = data.parent;
    this.categoryId = data.categoryId;
    this.tag = data.tag;
    this.tags = data.tags;
    if (this.categoryId != '1') {
      this.tags.push(this.NEW_TAG_STR);
    }
    this.latestVersion = this.latestVersions[this.tag];

    console.log(this.tag);

    if (this.isFirstTimeUpload(this.latestVersion)) {
      this.updateType = 'custom';
    } else {
      this.updateType = 'minor';
    }

    this.configDescEditor();
  }

  ngOnInit(): void {
    this.onVersionSelectorUpdate(this.updateType);
  }

  // Desc-BEGIN
  configDescEditor() {
    this.descEditor_data = '';
    this.descEditor_config = {
      placeholder: '请添加更新日志...',
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'blockQuote',
          'code',
          'link',
          '|',
          'bulletedList',
          'todoList',
          'numberedList',
          '|',
          'outdent',
          'indent',
          'horizontalLine',
          '|',
          'codeBlock',
          'insertTable',
          '|',
          'undo',
          'redo'
        ]
      },
      language: 'zh-cn',
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
        ]
      },
      licenseKey: '',
    };
  }

  onDescEditorReady(event) {
    this.descEditor_element = event;
  }

  onDescEditorChange(event) {
    if (this.descEditor_element.getData() === '') {
      this.autoCreateChecked = false;
    }
  }


  // Desc-END

  onVersionSelectorUpdate(updateTypeValue) {
    this.updateType = updateTypeValue;

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
  selectFile(files: FileList | null): void {
    const file = files[0];

    if (file === undefined) {
      this.file = undefined;
      return;
    } else if (file.size > GlobalConstants.maxBinarySize) {
      alert('上传文件必须小于: ' + (GlobalConstants.maxBinarySize / 1024 / 1024).toString() + 'MB');
      this.fileInputElement.nativeElement.value = '';
      return;
    } else {
      this.file = file;
      this.upload = undefined;
    }

    if (this.categoryId === '1') {
      const re = /(?:\.([^.]+))?$/;
      const ext = re.exec(file.name)[1];
      if (ext === 'scp') {
        this.selectSireVersion = '2';
        this.convertedSireVersion = '1'
      } else {
        this.selectSireVersion = '1';
        this.convertedSireVersion = '2';
      }
    }
  }

  uploadTmpFile(): void {
    const filename = `${this.parent}/binaries/${uuid()}`;
    this.tmpUrl = filename;
    this.prevTime = new Date().getTime();
    this.oldbytes = 0;
    this.uploadSub = this.uploadService.upload(this.file, GlobalConstants.tmpBucket, filename).subscribe((upload) => {
      console.log(upload);

      this.upload = upload;
      this.bytesReceied = upload.loaded / 1000000;
      this.currTime = new Date().getTime();
      this.speed =
        (this.bytesReceied - this.oldbytes) /
        ((this.currTime - this.prevTime) / 1000);
      if (this.speed < 1) {
        this.unit = "KB/S";
        this.speed *= 1000;
      } else this.unit = "MB/S";

      this.prevTime = this.currTime;
      this.oldbytes = this.bytesReceied;

      if (upload.state === 'DONE' && this.autoCreateChecked) {
        this.createForm.ngSubmit.emit();
      }
    });
  }

  onCreateBinary(createVersionForm) {

    const binary: Binary = new Binary({
      version: this.newVersion,
      description: createVersionForm.value.updateDesc,
      tag: this.tag,
    });

    const request = new CreateBinaryRequest({
      parent: this.parent,
      binary: binary,
      url: this.tmpUrl
    });

    this.loadingDialog = this.dialog.open(LoadingComponent);

    this.san11PkService.createBinary(request).subscribe(
      resp => {
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

  newTagSelected(tag: string) {
    if (tag === this.NEW_TAG_STR) {
      this.dialog.open(TextInputDialogComponent, {
        data: {
          title: '创建新分支',
          preSetText: ''
        }
      }).afterClosed().subscribe(
        data => {
          if (data != undefined) {
            this.tags.splice(this.tags.length - 1, 1);
            this.tags.push(data.data);
            this.tag = this.tags[this.tags.length - 1];


            this.latestVersions[this.tag] = new Version({ major: "1", minor: "-1", patch: "0" });

            this.latestVersion = this.latestVersions[this.tag];
            this.onVersionSelectorUpdate('custom');
          }
        }
      );
    } else {
      this.latestVersion = this.latestVersions[this.tag];
      this.onVersionSelectorUpdate('minor');
    }
  }

  onCancel() {
    if (this.uploadSub) {
      if (!this.uploadSub.closed) {
        if (!confirm('上传尚未完成，确定要取消吗？')) {
          return;
        }
      } else {
        if (!confirm('创建尚未完成，确定要取消吗？')) {
          return;
        }
      }
      this.uploadSub.unsubscribe();
    }
    this.dialogRef.close();
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
  }
  updateMinor(input) {
    const pendingVersoin = new Version({ major: this.newVersion.major, minor: input.value, patch: this.newVersion.patch });
    if (!this.validateVersion(pendingVersoin)) {
      this.notificationService.warn("版本号不合法: 新的版本号必须大于最新的已发布版本");
      input.value = this.newVersion.minor;
      return;
    }
    this.newVersion = pendingVersoin;
  }
  updatePatch(input) {
    const pendingVersoin = new Version({ major: this.newVersion.major, minor: this.newVersion.minor, patch: input.value });
    if (!this.validateVersion(pendingVersoin)) {
      this.notificationService.warn("版本号不合法: 新的版本号必须大于最新的已发布版本");
      input.value = this.newVersion.patch;
      return;
    }
    this.newVersion = pendingVersoin;
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

  onAutoCreateAfterUpload(event) {
    this.autoCreateChecked = event.checked;
    if (this.autoCreateChecked) {
      console.log(this.descEditor_data);
      if (this.descEditor_element.getData() === '') {
        this.notificationService.warn('请输入 更新日志');
        setTimeout(() => {
          this.autoCreateChecked = false;
        });
      }
    }
  }
}
