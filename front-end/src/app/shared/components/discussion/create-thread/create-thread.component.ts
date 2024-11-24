import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common/notification.service';
import { EditorService } from 'src/app/service/editor.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { CreateThreadRequest, Thread } from 'src/proto/san11-platform.pb';


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

  createThreadLoading = false;

  constructor(
    public dialogRef: MatDialogRef<CreateThreadComponent>,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private san11pkService: San11PlatformServiceService,
    public editorService: EditorService,
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

    this.editorService.configEditor(false, undefined);
  }

  @HostListener('document:keydown.meta.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    // check if cmd+enter is pressed
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      if (this.createThreadForm.invalid) {
        return;
      }
      // trigger button click event
      this.onCreateThread();
    }
  }


  get subject() {
    return this.createThreadForm.get('subject');
  }
  get content() {
    return this.createThreadForm.get('content');
  }

  onCreateThread() {
    this.createThreadLoading = true;
    this.san11pkService.createThread(new CreateThreadRequest({
      parent: this.parent,
      thread: new Thread({
        subject: this.subject.value,
        content: this.editorService.getData(),
      })
    })).subscribe({
      next: (resp: Thread) => {
        this.createThreadLoading = false;
        this.router.navigate([resp.name])
        this.dialogRef.close({ data: this.editorService.getData() });
      },
      error: error => {
        this.createThreadLoading = false;
        this.notificationService.warn(`创建失败: ${error.statusMessage}.`);
      },
    });
  }
}
