import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface TextData {
  title: string,
  content: string
}
@Component({
  selector: 'app-text-dialog',
  templateUrl: './text-dialog.component.html',
  styleUrls: ['./text-dialog.component.css']
})
export class TextDialogComponent implements OnInit {
  title: string;
  content: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TextData,
  ) { 
    this.title = data.title;
    this.content = data.content;
  }

  ngOnInit(): void {
  }

}
