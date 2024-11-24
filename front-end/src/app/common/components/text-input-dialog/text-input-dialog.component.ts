import { ViewChild, ElementRef, Component, OnInit, Inject } from '@angular/core';

import { MatLegacyDialog as MatDialog, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';


export interface TextData {
  title: string,
  preSetText: string
}
@Component({
  selector: 'app-text-input-dialog',
  templateUrl: './text-input-dialog.component.html',
  styleUrls: ['./text-input-dialog.component.css']
})
export class TextInputDialogComponent implements OnInit {

  title: string;
  preSetText: string;


  mainForm;

  constructor(
    public dialogRef: MatDialogRef<TextInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TextData,
  ) {
    this.title = data.title;
    this.preSetText = data.preSetText;
  }

  
  ngOnInit(): void {
  }

  onSubmit(form) {
    this.dialogRef.close({data: form.value.input});
  }
}
