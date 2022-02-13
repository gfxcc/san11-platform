import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Editor from "../../../common/components/ckeditor/ckeditor";


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

  descEditor = Editor;
  descEditor_element;
  descEditor_data: string;
  descEditor_config;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TextData,
    public dialogRef: MatDialogRef<TextDialogComponent>,
  ) {
    this.title = data.title;
    this.content = data.content;
    this.editable = data.editable;
  }

  ngOnInit(): void {
    this.configDescEditor();
  }


  // Desc-BEGIN
  configDescEditor() {
    this.descEditor_data = this.content;
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

  onConfirm() {
    this.dialogRef.close({ data: this.descEditor_element.getData() });
  }
}
