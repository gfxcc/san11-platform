import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as S3 from 'aws-sdk/clients/s3';
import { Subscription } from 'rxjs';
import { isAdmin } from 'src/app/utils/user_util';
import { v4 as uuid } from 'uuid';
import { Binary, CreateBinaryRequest, File, Version } from "../../../../proto/san11-platform.pb";
import * as Editor from "../../../common/components/ckeditor/ckeditor";
import { LoadingComponent } from "../../../common/components/loading/loading.component";
import { TextInputDialogComponent } from "../../../common/components/text-input-dialog/text-input-dialog.component";
import { GlobalConstants } from "../../../common/global-constants";
import { NotificationService } from "../../../common/notification.service";
import { San11PlatformServiceService } from "../../../service/san11-platform-service.service";
import { Upload } from '../../../service/upload';
import { UploadService } from "../../../service/upload.service";
import { increment } from "../../../utils/number_util";


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

  file: globalThis.File;
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
  SPEED_UPDATE_DELTA_RATE = 0.2;

  autoCreateChecked = false;
  useAwsS3 = true;

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

  get showExperimentalRegion() {
    return isAdmin();
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
    this.upload = {
      state: 'PENDING',
      progress: 0,
      loaded: 0,
      total: 0
    };
    const filename = `${this.parent}/binaries/${uuid()}`;
    this.tmpUrl = filename;
    this.prevTime = new Date().getTime();
    this.oldbytes = 0;
    if (!this.useAwsS3) {
      console.debug('use GCS');
      this.uploadSub = this.uploadService.upload(this.file, GlobalConstants.tmpBucket, filename).subscribe((upload) => {

        this.updateProgress(upload);

        if (upload.state === 'DONE' && this.autoCreateChecked) {
          this.createForm.ngSubmit.emit();
        }
      });
    } else {
      console.debug('use AWS S3');
      const contentType = this.file.type;
      const bucket = new S3(
        {
          region: 'ap-east-1',
          // An anonymous user without any privilege.
          accessKeyId: 'AKIAY2GXL5CGRVMXA4VS',
          secretAccessKey: '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',
        }
      );
      const params = {
        Bucket: GlobalConstants.tmpBucket,
        Key: filename,
        Body: this.file,
        ContentType: contentType
      };
      bucket.upload(params).on('httpUploadProgress', (upload) => {
        this.updateProgress({
          state: 'IN_PROGRESS',
          progress: upload.loaded * 100 / upload.total,
          loaded: upload.loaded,
          total: upload.total
        });
      }).send((err, data) => {
        if (err) {
          console.log('There was an error uploading your file: ', err);
          return false;
        }
        this.upload.state = 'DONE';
        if (this.autoCreateChecked) {
          this.createForm.ngSubmit.emit();
        }
      });
    }
  }

  updateProgress(upload: Upload) {
    console.log(upload);

    this.upload = upload;
    this.bytesReceied = upload.loaded / 1000000;
    this.currTime = new Date().getTime();
    this.speed =
      (this.bytesReceied - this.oldbytes) /
      ((this.currTime - this.prevTime) / 1000);

    let speed =
      (this.bytesReceied - this.oldbytes) /
      ((this.currTime - this.prevTime) / 1000); // mb/second
    if (speed < 1) {
      this.unit = "KB/S";
      speed *= 1000;
    } else this.unit = "MB/S";

    if (Math.abs(this.speed - speed) / Math.max(this.speed, 1) > this.SPEED_UPDATE_DELTA_RATE) {
      this.speed = speed;
    }

    this.prevTime = this.currTime;
    this.oldbytes = this.bytesReceied;
  }

  onCreateBinary(createVersionForm) {

    const re = /(?:(\.[^.]+))?$/;
    const ext = re.exec(this.file.name)[1];

    const binary: Binary = new Binary({
      version: this.newVersion,
      description: createVersionForm.value.updateDesc,
      tag: this.tag,
      file: new File({
        // filename is OUTPUT_ONLY
        ext: ext,
        uri: this.tmpUrl,
        server: this.useAwsS3 ? File.Server.AWS_S3 : File.Server.GCS,
      }),
    });

    const request = new CreateBinaryRequest({
      parent: this.parent,
      binary: binary,
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
          if (data) {
            this.tags.splice(this.tags.length - 1, 1);
            this.tags.push(data.data);
            this.tag = this.tags[this.tags.length - 1];


            this.latestVersions[this.tag] = new Version({ major: "1", minor: "-1", patch: "0" });

            this.latestVersion = this.latestVersions[this.tag];
            this.onVersionSelectorUpdate('custom');
          } else {
            this.tag = this.tags[0];
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
      console.debug("version is not a number: ${version}");
      return false;
    }
    if (Number(version.major) < 1 || Number(version.minor) < 0 || Number(version.patch) < 0) {
      return false;
    }
    return [version.major, version.minor, version.patch] > [this.latestVersion.major, this.latestVersion.minor, this.latestVersion.patch];
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

  onUseAwsS3Toggled(event) {
    this.useAwsS3 = event.checked;
  }
}

