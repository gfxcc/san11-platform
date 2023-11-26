/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module ui/textarea/textareaview
 */
import { type Locale } from '@ckeditor/ckeditor5-utils';
import InputBase from '../input/inputbase';
import '../../theme/components/input/input.css';
import '../../theme/components/textarea/textarea.css';
/**
 * The textarea view class.
 *
 * ```ts
 * const textareaView = new TextareaView();
 *
 * textareaView.minRows = 2;
 * textareaView.maxRows = 10;
 *
 * textareaView.render();
 *
 * document.body.append( textareaView.element );
 * ```
 */
export default class TextareaView extends InputBase<HTMLTextAreaElement> {
    /**
     * Specifies the visible height of a text area, in lines.
     *
     * @observable
     * @default 2
     */
    minRows: number;
    /**
     * Specifies the maximum number of rows.
     *
     * @observable
     * @default 5
     */
    maxRows: number;
    /**
     * Specifies the value of HTML attribute that indicates whether the user can resize the element.
     *
     * @observable
     * @default 'none'
    */
    resize: 'both' | 'horizontal' | 'vertical' | 'none';
    /**
     * An internal property that stores the current height of the textarea. Used for the DOM binding.
     *
     * @observable
     * @default null
     * @internal
     */
    _height: number | null;
    /**
     * @inheritDoc
     */
    constructor(locale?: Locale);
    /**
     * @inheritDoc
     */
    render(): void;
    /**
     * @inheritDoc
     */
    reset(): void;
    /**
     * Updates the {@link #_height} of the view depending on {@link #minRows}, {@link #maxRows}, and the current content size.
     *
     * **Note**: This method overrides manual resize done by the user using a handle. It's a known bug.
     */
    private _updateAutoGrowHeight;
    /**
     * Validates the {@link #minRows} and {@link #maxRows} properties and warns in the console if the configuration is incorrect.
     */
    private _validateMinMaxRows;
}
/**
 * Fired every time the layout of the {@link module:ui/textarea/textareaview~TextareaView} possibly changed as a result
 * of the user input or the value change via {@link module:ui/textarea/textareaview~TextareaView#value}.
 *
 * @eventName ~TextareaView#update
 */
export type TextareaViewUpdateEvent = {
    name: 'update';
    args: [];
};
