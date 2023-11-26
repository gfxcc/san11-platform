/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module ui/list/listitemview
 */
import View from '../view';
import type { FocusableView } from '../focuscycler';
import type ViewCollection from '../viewcollection';
import type { Locale } from '@ckeditor/ckeditor5-utils';
/**
 * The list item view class.
 */
export default class ListItemView extends View {
    /**
     * Collection of the child views inside of the list item {@link #element}.
     */
    readonly children: ViewCollection<FocusableView>;
    /**
     * Controls whether the item view is visible. Visible by default, list items are hidden
     * using a CSS class.
     *
     * @observable
     * @default true
     */
    isVisible: boolean;
    /**
     * @inheritDoc
     */
    constructor(locale?: Locale);
    /**
     * Focuses the list item.
     */
    focus(): void;
}
