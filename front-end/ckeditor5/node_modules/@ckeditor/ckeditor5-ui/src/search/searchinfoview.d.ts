/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module ui/search/searchinfoview
*/
import type { FocusableView } from '../focuscycler';
import View from '../view';
/**
 * A view displaying an information text related to different states of {@link module:ui/search/text/searchtextview~SearchTextView}.
 *
 * @internal
 */
export default class SearchInfoView extends View implements FocusableView {
    /**
     * Controls whether the view is visible.
     *
     * @observable
     * @default false
     */
    isVisible: boolean;
    /**
     * Controls the primary line of text in the info.
     *
     * @observable
     * @default ''
     */
    primaryText: string;
    /**
     * Controls the secondary line of text in the info.
     *
     * @observable
     * @default ''
     */
    secondaryText: string;
    /**
     * @inheritDoc
     */
    constructor();
    /**
     * Focuses the view
     */
    focus(): void;
}
