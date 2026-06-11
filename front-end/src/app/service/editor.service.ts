import { Injectable, NgZone } from '@angular/core';
import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ListUsersRequest, User } from 'src/proto/san11-platform.pb';
import { GlobalConstants } from '../common/global-constants';
import { ProgressService } from '../progress.service';
import { getUserUri } from '../utils/user_util';
import { MyUploadAdapter } from './cke-upload-adapter';
import { San11PlatformServiceService } from './san11-platform-service.service';
import { UploadService } from './upload.service';
import {
  InlineEditor,
  AccessibilityHelp,
  Autoformat,
  AutoImage,
  Autosave,
  BlockQuote,
  Bold,
  CloudServices,
  Essentials,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Paragraph,
  SelectAll,
  SimpleUploadAdapter,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  FontColor,
  Undo,
  type EditorConfig,
  ClassicEditor,
  Code,
  HorizontalLine,
  Alignment,
  CodeBlock,
  Mention
} from 'ckeditor5';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private editor = ClassicEditor;
  private editorElement;
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
    // // Logic to create and configure the editor instance
    // this.editor = InlineEditor; // Replace this with actual editor instance creation if needed
  }

  private getUsernameFeedItems(queryText: string) {
    const query = (queryText || '').trim();
    if (!query) {
      return Promise.resolve([]);
    }
    const escapedQuery = this.escapeListFilterValue(query);

    const exactRequest = this.san11pkService.listUsers(new ListUsersRequest({
      pageSize: '1',
      filter: `username = "${escapedQuery}"`
    })).toPromise().catch(() => ({ users: [] }));

    const fuzzyRequest = this.san11pkService.listUsers(new ListUsersRequest({
      pageSize: GlobalConstants.usernameFeedPageSize.toString(),
      filter: `username = "*${escapedQuery}*"`
    })).toPromise().catch(() => ({ users: [] }));

    return Promise.all([exactRequest, fuzzyRequest]).then(([exactResult, fuzzyResult]) => {
      const usersById = new Map<string, User>();
      [...(exactResult.users || []), ...(fuzzyResult.users || [])].forEach((user: User) => {
        usersById.set(`${user.userId}`, user);
      });

      return [...usersById.values()]
        .sort((left: User, right: User) => this.compareMentionUsers(left, right, query))
        .map((user: User) => ({
          id: `@${user.username}`,
          userId: user.userId,
          username: user.username,
          link: getUserUri(user),
        }));
    });
  }

  private compareMentionUsers(left: User, right: User, query: string): number {
    const leftRank = this.getMentionUserRank(left.username, query);
    const rightRank = this.getMentionUserRank(right.username, query);
    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }
    return left.username.localeCompare(right.username, 'zh-Hans-CN');
  }

  private getMentionUserRank(username: string, query: string): number {
    const normalizedUsername = (username || '').toLocaleLowerCase();
    const normalizedQuery = query.toLocaleLowerCase();
    if (normalizedUsername === normalizedQuery) {
      return 0;
    }
    if (normalizedUsername.startsWith(normalizedQuery)) {
      return 1;
    }
    const index = normalizedUsername.indexOf(normalizedQuery);
    return index >= 0 ? 2 + index : 1000;
  }

  private escapeListFilterValue(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  configEditor(disabled: boolean = true, imageUploadPath: string | undefined, placeholder: string = '请输入...') {
    this.disabled = disabled;
    this.imageUploadPath = imageUploadPath;
    this.placeholder = placeholder;
  }

  getEditorInstance() {
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
        ]
      },
      plugins: [
        Autoformat,
        AutoImage,
        BlockQuote,
        FontColor,
        Code,
        HorizontalLine,
        Alignment,
        CodeBlock,
        Bold,
        Mention,
        Essentials,
        Heading,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsert,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        Paragraph,
        SelectAll,
        SimpleUploadAdapter,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline,
        Undo
      ],
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
            itemRenderer: this.renderMentionFeedItem,
            minimumCharacters: 1,
          }
        ]
      },
      extraPlugins: [MentionLinksPlugin],
      licenseKey: '',

    };

    if (this.imageUploadPath === undefined) {
      config.toolbar.items = config.toolbar.items.filter(item => item !== 'imageUpload');
    }

    return config;
  }

  private renderMentionFeedItem(item: any): HTMLElement {
    const itemElement = document.createElement('span');
    itemElement.classList.add('mention-feed-item');

    const avatar = document.createElement('span');
    avatar.classList.add('mention-feed-avatar');
    avatar.textContent = item.username?.charAt(0) ?? '@';

    const text = document.createElement('span');
    text.classList.add('mention-feed-name');
    text.textContent = item.username;

    itemElement.appendChild(avatar);
    itemElement.appendChild(text);
    return itemElement;
  }

  getData(): string {
    return this.editorElement.getData();
  }

  setData(data: string) {
    this.editorElement.setData(data);
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
    this.updateToolbarVisibility();
  }

  focus(): void {
    this.editorElement?.editing.view.focus();
  }

  onReady(editor) {
    this.editorElement = editor;
    if (this.imageUploadPath !== undefined) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader, this.san11pkService, this.uploadService, this.imageUploadPath, this.progressService, this.ngZone);
      };
    }
    this.updateToolbarVisibility();
  }

  onFocus() { }
  onBlur() { }

  private updateToolbarVisibility(): void {
    const toolbarElement = this.editorElement?.ui.view.toolbar.element;
    if (toolbarElement) {
      toolbarElement.style.display = this.disabled ? 'none' : '';
    }
  }

}

function MentionLinksPlugin(editor: any) {
  editor.conversion.for('upcast').elementToAttribute({
    view: {
      name: 'a',
      key: 'data-mention',
      classes: 'mention',
      attributes: {
        href: true,
        'data-user-id': true,
      },
    },
    model: {
      key: 'mention',
      value: (viewItem: any) => editor.plugins.get('Mention').toMentionAttribute(viewItem, {
        link: viewItem.getAttribute('href'),
        userId: viewItem.getAttribute('data-user-id'),
      }),
    },
    converterPriority: 'high',
  });

  editor.conversion.for('downcast').attributeToElement({
    model: 'mention',
    view: (modelAttributeValue: any, { writer }: any) => {
      if (!modelAttributeValue) {
        return;
      }

      const userId = modelAttributeValue.userId;
      const href = modelAttributeValue.link || (userId ? `users/${userId}` : '');
      return writer.createAttributeElement('a', {
        class: 'mention',
        'data-mention': modelAttributeValue.id,
        'data-user-id': userId,
        href,
      }, {
        priority: 20,
        id: modelAttributeValue.uid,
      });
    },
    converterPriority: 'high',
  });
}
