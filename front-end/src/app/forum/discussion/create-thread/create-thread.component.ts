import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { CreateThreadRequest, Thread } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent implements OnInit {
  createThreadForm: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private san11pkService: San11PlatformServiceService) { }

  ngOnInit(): void {
    this.createThreadForm = this.formBuilder.group({
      subject: ['',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(32)
        ]],
      content: ['',
        [
        ]],
    });
  }

  get subject() {
    return this.createThreadForm.get('subject');
  }
  get content() {
    return this.createThreadForm.get('content');
  }

  createThread() {
    this.san11pkService.createThread(new CreateThreadRequest({
      parent: 'general',
      thread: new Thread({
        subject: this.subject.value,
        content: this.content.value,
      })
    })).subscribe(
      (resp: Thread) => {
        this.router.navigate(['discussion'])
      }, 
      error => {
        this.notificationService.warn(`创建失败: ${error.statusMessage}.`)
      }
    );
  }

}
