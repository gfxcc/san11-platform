import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { CreateThreadRequest, Thread } from 'src/proto/san11-platform.pb';
import * as Editor from "../../../../common/components/ckeditor/ckeditor";


export interface CreateThreadArgs {
  parent: string,
}
@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent implements OnInit {
  createThreadForm: FormGroup;
  parent: string;

  descEditor = Editor;
  descEditor_element;
  descEditor_data: string;
  descEditor_config;

  constructor(
    public dialogRef: MatDialogRef<CreateThreadComponent>,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private san11pkService: San11PlatformServiceService,
    @Inject(MAT_DIALOG_DATA) public data: CreateThreadArgs,
  ) {
    this.parent = data.parent;
  }

  ngOnInit(): void {
    this.createThreadForm = this.formBuilder.group({
      subject: ['',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(32)
        ]],
    });

    this.configDescEditor();
  }

  get subject() {
    return this.createThreadForm.get('subject');
  }
  get content() {
    return this.createThreadForm.get('content');
  }


  // Desc-BEGIN
  configDescEditor() {
    this.descEditor_data = '';
    this.descEditor_config = {
      placeholder: '请添加描述...',
      toolbar: {
        items: [
          'heading',
          '|',
          'fontColor',
          'bold',
          'italic',
          'underline',
          'blockQuote',
          'code',
          'link',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
          'horizontalLine',
          '|',
          'outdent',
          'indent',
          'alignment',
          '|',
          'codeBlock',
          'insertTable',
          'undo',
          'redo'
        ]
      },
      language: 'zh-cn',
      image: {
        toolbar: [
          'imageTextAlternative',
          'imageStyle:full',
          'imageStyle:side',
          'linkImage'
        ]
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableCellProperties',
          'tableProperties'
        ]
      },
      licenseKey: '',
    };
  }

  onDescEditorReady(event) {
    this.descEditor_element = event;
  }
  // Desc-END

  onCreateThread() {
    this.san11pkService.createThread(new CreateThreadRequest({
      parent: this.parent,
      thread: new Thread({
        subject: this.subject.value,
        content: this.descEditor_element.getData(),
      })
    })).subscribe(
      (resp: Thread) => {
        console.log(resp);
        this.router.navigate([resp.name])
        this.dialogRef.close({ data: this.descEditor_element.getData() });
      },
      error => {
        this.notificationService.warn(`创建失败: ${error.statusMessage}.`);
      }
    );
  }
}
