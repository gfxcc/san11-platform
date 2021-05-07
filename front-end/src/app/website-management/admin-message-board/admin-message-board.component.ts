import { Component, OnInit } from '@angular/core';
import { San11PlatformServiceService } from '../../service/san11-platform-service.service';

@Component({
  selector: 'app-admin-message-board',
  templateUrl: './admin-message-board.component.html',
  styleUrls: ['./admin-message-board.component.css']
})
export class AdminMessageBoardComponent implements OnInit {

  message: string;

  constructor(
    public san11pkService: San11PlatformServiceService,
  ) { }

  ngOnInit(): void {
    this.san11pkService.getAdminMessage().subscribe(
      adminMessage => {
        this.message = adminMessage.message;
      },
      error => {

      }
    );

  }

}
