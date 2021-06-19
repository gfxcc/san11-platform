import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../../common/notification.service';
import { San11PlatformServiceService } from '../../../service/san11-platform-service.service';
import { SendVerificationCodeRequest } from "../../../../proto/san11-platform.pb";


export interface TextData {
  email: string
}
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  email: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: TextData,
    private dialogRef: MatDialogRef<VerifyEmailComponent>,
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) {
    this.email = data.email;
  }

  ngOnInit(): void {
    this.sendVerificationEmail();
  }

  sendVerificationEmail() {
    const request = new SendVerificationCodeRequest({
      email: this.email
    });
    this.san11pkService.sendVerificationCode(request).subscribe();
  }

  onVerifyEmail(verifyForm) {

  }

}
