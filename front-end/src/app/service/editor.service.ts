import { Injectable, NgZone } from '@angular/core';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as Editor from "ckeditor5-custom-build/build/ckeditor";
import { ListUsersRequest, User } from 'src/proto/san11-platform.pb';
import { GlobalConstants } from '../common/global-constants';
import { ProgressService } from '../progress.service';
import { getUserUri } from '../utils/user_util';
import { MyUploadAdapter } from './cke-upload-adapter';
import { San11PlatformServiceService } from './san11-platform-service.service';
import { UploadService } from './upload.service';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private editor: typeof Editor;
  private editorElement: DecoupledEditor;
  private placeholder: string = '请输入...';
  public disabled: boolean = true;

  private imageUploadPath: string | undefined = undefined;

  constructor(
    private san11pkService: San11PlatformServiceService,
    private uploadService: UploadService,
    public progressService: ProgressService,
    private ngZone: NgZone,  // Inject NgZone
  ) {
    this.createEditor();
  }


  private createEditor(): void {
    // Logic to create and configure the editor instance
    this.editor = Editor; // Replace this with actual editor instance creation if needed
  }

  private getUsernameFeedItems(queryText: string) {
    return this.san11pkService.listUsers(new ListUsersRequest({
      pageSize: GlobalConstants.usernameFeedPageSize.toString(),
      filter: `username = "*${queryText}*"`
    })).toPromise().then(function (result) {
      return result.users.map(
        (user: User) => ({
          id: `@${user.username}`,
          userId: user.userId,
          username: user.username,
          link: getUserUri(user),
        })
      );
    });
  }

  configEditor(disabled: boolean = true, imageUploadPath: string | undefined, placeholder: string = '请输入...') {
    this.disabled = disabled;
    this.imageUploadPath = imageUploadPath;
    this.placeholder = placeholder;
  }

  getEditorInstance(): typeof Editor {
    return this.editor;
  }

  getConfig(): any {
    let config = {
      placeholder: this.placeholder,
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
          'imageUpload', // comment out this function as current implement will cause performance issue 
          'codeBlock',
          'insertTable',
          'undo',
          'redo'
        ]
      },
      language: 'zh-cn',
      image: {
        toolbar: [
          'imageStyle:full',
          'imageStyle:side',
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
      mention: {
        feeds: [
          {
            marker: '@',
            feed: this.getUsernameFeedItems.bind(this),
            minimumCharacters: 1,
          }
        ]
      },
      licenseKey: '',

    };

    if (this.imageUploadPath === undefined) {
      config.toolbar.items = config.toolbar.items.filter(item => item !== 'imageUpload');
    }

    return config;
  }

  getData(): string {
    return this.editorElement.getData();
  }

  setData(data: string) {
    this.editorElement.setData(data);
  }

  onReady(editor: DecoupledEditor) {
    this.editorElement = editor;
    if (this.imageUploadPath !== undefined) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader, this.san11pkService, this.uploadService, this.imageUploadPath, this.progressService, this.ngZone);
      };
    }
    if (this.disabled) {
      const toolbarElement = editor.ui.view.toolbar.element;
      toolbarElement.style.display = 'none';
    }
  }

  onFocus() { }
  onBlur() { }

}
