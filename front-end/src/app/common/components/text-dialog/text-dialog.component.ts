import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { EditorService } from 'src/app/service/editor.service';


// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export interface TextData {
  title: string,
  content: string,
  editable: boolean
}
@Component({
  selector: 'app-text-dialog',
  templateUrl: './text-dialog.component.html',
  styleUrls: ['./text-dialog.component.css']
})
export class TextDialogComponent implements OnInit {
  title: string;
  content: string;
  editable: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TextData,
    public dialogRef: MatDialogRef<TextDialogComponent>,
    public editorService: EditorService,
  ) {
    this.title = data.title;
    this.content = data.content;
    this.editable = data.editable;
  }

  ngOnInit(): void {
    this.editorService.configEditor(!this.editable, undefined);
  }

  onConfirm() {
    this.dialogRef.close({ data: this.editorService.getData() });
  }
}
