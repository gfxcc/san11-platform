/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module ui/arialiveannouncer
 */
import type { Editor } from '@ckeditor/ckeditor5-core';
import type { Locale } from '@ckeditor/ckeditor5-utils';
import type ViewCollection from './viewcollection';
import View from './view';
import '../theme/components/arialiveannouncer/arialiveannouncer.css';
/**
 * The politeness level of an `aria-live` announcement.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#Politeness_levels
 */
export declare enum AriaLiveAnnouncerPoliteness {
    POLITE = "polite",
    ASSERTIVE = "assertive"
}
/**
 * An accessibility helper that manages all ARIA live regions associated with an editor instance. ARIA live regions announce changes
 * to the state of the editor features.
 *
 * These announcements are consumed and propagated by screen readers and give users a better understanding of the current
 * state of the editor.
 *
 * To announce a state change to an editor feature named `'Some feature'`, use the {@link #announce} method:
 * ```ts
 * editor.ui.ariaLiveAnnouncer.announce( 'Some feature', 'Text of an announcement.' );
 * ```
 */
export default class AriaLiveAnnouncer {
    /**
     * The editor instance.
     */
    readonly editor: Editor;
    /**
     * The view that aggregates all `aria-live` regions.
     */
    view?: AriaLiveAnnouncerView;
    /**
     * @inheritDoc
     */
    constructor(editor: Editor);
    /**
     * Sets an announcement text to an aria region associated with a specific editor feature. The text is then
     * announced by a screen reader to the user.
     *
     * If the aria region of a given name does not exist, it will be created and can be re-used later. The name of the region
     * groups announcements originating from a specific editor feature and does not get announced by a screen reader.
     *
     * Using multiple regions allows for many announcements to be emitted in a short period of time. Changes to ARIA-live announcements
     * are captured by a screen reader and read out in the order they were emitted.
     *
     * The default announcement politeness level is `'polite'`.
     *
     * ```ts
     * // Most screen readers will queue announcements from multiple aria-live regions and read them out in the order they were emitted.
     * editor.ui.ariaLiveAnnouncer.announce( 'image', 'Image uploaded.' );
     * editor.ui.ariaLiveAnnouncer.announce( 'network', 'Connection lost. Reconnecting.' );
     * ```
     */
    announce(regionName: string, announcementText: string, politeness?: AriaLiveAnnouncerPoliteness): void;
}
/**
 * The view that aggregates all `aria-live` regions.
 */
export declare class AriaLiveAnnouncerView extends View {
    /**
     * A collection of all views that represent individual `aria-live` regions.
     */
    readonly regionViews: ViewCollection<AriaLiveAnnouncerRegionView>;
    constructor(locale: Locale);
}
/**
 * The view that represents a single `aria-live` region (e.g. for a specific editor feature) and its text.
 */
export declare class AriaLiveAnnouncerRegionView extends View {
    /**
     * Current text of the region.
     */
    text: string;
    /**
     * Current politeness level of the region.
     */
    politeness: AriaLiveAnnouncerPoliteness;
    /**
     * A unique name of the region, usually associated with a specific editor feature or system.
     */
    regionName: string;
    constructor(locale: Locale);
}
