import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import * as Editor from "../../../common/components/ckeditor/ckeditor";


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

  descEditor = Editor;
  descEditor_element;
  descEditor_data: string;
  descEditor_config;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TextData,
  ) {
    this.title = data.title;
    this.content = data.content;
  }

  ngOnInit(): void {
    this.configDescEditor();
  }


  // Desc-BEGIN
  configDescEditor() {
    this.descEditor_data = this.content;
  }
  // Desc-END

}
