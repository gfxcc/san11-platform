/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import View from './view';
import '../theme/components/arialiveannouncer/arialiveannouncer.css';
/**
 * The politeness level of an `aria-live` announcement.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#Politeness_levels
 */
export var AriaLiveAnnouncerPoliteness;
(function (AriaLiveAnnouncerPoliteness) {
    AriaLiveAnnouncerPoliteness["POLITE"] = "polite";
    AriaLiveAnnouncerPoliteness["ASSERTIVE"] = "assertive";
})(AriaLiveAnnouncerPoliteness || (AriaLiveAnnouncerPoliteness = {}));
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
     * @inheritDoc
     */
    constructor(editor) {
        this.editor = editor;
    }
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
    announce(regionName, announcementText, politeness = AriaLiveAnnouncerPoliteness.POLITE) {
        const editor = this.editor;
        if (!this.view) {
            this.view = new AriaLiveAnnouncerView(editor.locale);
            editor.ui.view.body.add(this.view);
        }
        let regionView = this.view.regionViews.find(view => view.regionName === regionName);
        if (!regionView) {
            regionView = new AriaLiveAnnouncerRegionView(this.view.locale);
            this.view.regionViews.add(regionView);
        }
        regionView.set({
            regionName,
            text: announcementText,
            politeness
        });
    }
}
/**
 * The view that aggregates all `aria-live` regions.
 */
export class AriaLiveAnnouncerView extends View {
    constructor(locale) {
        super(locale);
        this.regionViews = this.createCollection();
        this.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-aria-live-announcer'
                ]
            },
            children: this.regionViews
        });
    }
}
/**
 * The view that represents a single `aria-live` region (e.g. for a specific editor feature) and its text.
 */
export class AriaLiveAnnouncerRegionView extends View {
    constructor(locale) {
        super(locale);
        const bind = this.bindTemplate;
        this.set('regionName', '');
        this.set('text', '');
        this.set('politeness', AriaLiveAnnouncerPoliteness.POLITE);
        this.setTemplate({
            tag: 'div',
            attributes: {
                role: 'region',
                'data-region': bind.to('regionName'),
                'aria-live': bind.to('politeness')
            },
            children: [
                { text: bind.to('text') }
            ]
        });
    }
}
