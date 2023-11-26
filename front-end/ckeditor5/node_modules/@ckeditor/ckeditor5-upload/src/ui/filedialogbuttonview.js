/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module upload/ui/filedialogbuttonview
 */
import { ButtonView, View } from '@ckeditor/ckeditor5-ui';
/**
 * The file dialog button view.
 *
 * This component provides a button that opens the native file selection dialog.
 * It can be used to implement the UI of a file upload feature.
 *
 * ```ts
 * const view = new FileDialogButtonView( locale );
 *
 * view.set( {
 * 	acceptedType: 'image/*',
 * 	allowMultipleFiles: true
 * } );
 *
 * view.buttonView.set( {
 * 	label: t( 'Insert image' ),
 * 	icon: imageIcon,
 * 	tooltip: true
 * } );
 *
 * view.on( 'done', ( evt, files ) => {
 * 	for ( const file of Array.from( files ) ) {
 * 		console.log( 'Selected file', file );
 * 	}
 * } );
 * ```
 */
export default class FileDialogButtonView extends View {
    /**
     * @inheritDoc
     */
    constructor(locale) {
        super(locale);
        this.buttonView = new ButtonView(locale);
        this._fileInputView = new FileInputView(locale);
        this._fileInputView.bind('acceptedType').to(this);
        this._fileInputView.bind('allowMultipleFiles').to(this);
        this._fileInputView.delegate('done').to(this);
        this.setTemplate({
            tag: 'span',
            attributes: {
                class: 'ck-file-dialog-button'
            },
            children: [
                this.buttonView,
                this._fileInputView
            ]
        });
        this.buttonView.on('execute', () => {
            this._fileInputView.open();
        });
    }
    /**
     * Focuses the {@link #buttonView}.
     */
    focus() {
        this.buttonView.focus();
    }
}
/**
 * The hidden file input view class.
 */
class FileInputView extends View {
    /**
     * @inheritDoc
     */
    constructor(locale) {
        super(locale);
        this.set('acceptedType', undefined);
        this.set('allowMultipleFiles', false);
        const bind = this.bindTemplate;
        this.setTemplate({
            tag: 'input',
            attributes: {
                class: [
                    'ck-hidden'
                ],
                type: 'file',
                tabindex: '-1',
                accept: bind.to('acceptedType'),
                multiple: bind.to('allowMultipleFiles')
            },
            on: {
                // Removing from code coverage since we cannot programmatically set input element files.
                change: bind.to(/* istanbul ignore next -- @preserve */ () => {
                    if (this.element && this.element.files && this.element.files.length) {
                        this.fire('done', this.element.files);
                    }
                    this.element.value = '';
                })
            }
        });
    }
    /**
     * Opens file dialog.
     */
    open() {
        this.element.click();
    }
}
