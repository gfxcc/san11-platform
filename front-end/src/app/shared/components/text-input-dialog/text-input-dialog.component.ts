import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface TextData {
  title: string,
  inputTitle: string,
  preSetText: string
}
@Component({
  selector: 'app-text-input-dialog',
  templateUrl: './text-input-dialog.component.html',
  styleUrls: ['./text-input-dialog.component.css']
})
export class TextInputDialogComponent implements OnInit {
  title: string;
  inputTitle: string;
  preSetText: string;

  constructor(
    public dialogRef: MatDialogRef<TextInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TextData,
  ) {
    this.title = data.title;
    this.inputTitle = data.inputTitle;
    this.preSetText = data.preSetText;
  }

  ngOnInit(): void {
  }

  onSubmit(form) {
    this.dialogRef.close({ data: form.value.input });
  }
}
