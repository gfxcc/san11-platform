/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module image/imageinsert/ui/imageinsertpanelview
 */
import { icons } from 'ckeditor5/src/core';
import { ButtonView, View, ViewCollection, submitHandler, FocusCycler } from 'ckeditor5/src/ui';
import { Collection, FocusTracker, KeystrokeHandler } from 'ckeditor5/src/utils';
import ImageInsertFormRowView from './imageinsertformrowview';
import '../../../theme/imageinsert.css';
/**
 * The insert an image via URL view controller class.
 *
 * See {@link module:image/imageinsert/ui/imageinsertpanelview~ImageInsertPanelView}.
 */
export default class ImageInsertPanelView extends View {
    /**
     * Creates a view for the dropdown panel of {@link module:image/imageinsert/imageinsertui~ImageInsertUI}.
     *
     * @param locale The localization services instance.
     * @param integrations An integrations object that contains components (or tokens for components) to be shown in the panel view.
     */
    constructor(locale, integrations = {}) {
        super(locale);
        const { insertButtonView, cancelButtonView } = this._createActionButtons(locale);
        this.insertButtonView = insertButtonView;
        this.cancelButtonView = cancelButtonView;
        this.set('imageURLInputValue', '');
        this.focusTracker = new FocusTracker();
        this.keystrokes = new KeystrokeHandler();
        this._focusables = new ViewCollection();
        this._focusCycler = new FocusCycler({
            focusables: this._focusables,
            focusTracker: this.focusTracker,
            keystrokeHandler: this.keystrokes,
            actions: {
                // Navigate form fields backwards using the Shift + Tab keystroke.
                focusPrevious: 'shift + tab',
                // Navigate form fields forwards using the Tab key.
                focusNext: 'tab'
            }
        });
        this.set('_integrations', new Collection());
        for (const [integration, integrationView] of Object.entries(integrations)) {
            if (integration === 'insertImageViaUrl') {
                integrationView.fieldView
                    .bind('value').to(this, 'imageURLInputValue', (value) => value || '');
                integrationView.fieldView.on('input', () => {
                    this.imageURLInputValue = integrationView.fieldView.element.value.trim();
                });
            }
            integrationView.name = integration;
            this._integrations.add(integrationView);
        }
        this.setTemplate({
            tag: 'form',
            attributes: {
                class: [
                    'ck',
                    'ck-image-insert-form'
                ],
                tabindex: '-1'
            },
            children: [
                ...this._integrations,
                new ImageInsertFormRowView(locale, {
                    children: [
                        this.insertButtonView,
                        this.cancelButtonView
                    ],
                    class: 'ck-image-insert-form__action-row'
                })
            ]
        });
    }
    /**
     * @inheritDoc
     */
    render() {
        super.render();
        submitHandler({
            view: this
        });
        const childViews = [
            ...this._integrations,
            this.insertButtonView,
            this.cancelButtonView
        ];
        childViews.forEach(v => {
            // Register the view as focusable.
            this._focusables.add(v);
            // Register the view in the focus tracker.
            this.focusTracker.add(v.element);
        });
        // Start listening for the keystrokes coming from #element.
        this.keystrokes.listenTo(this.element);
        const stopPropagation = (data) => data.stopPropagation();
        // Since the form is in the dropdown panel which is a child of the toolbar, the toolbar's
        // keystroke handler would take over the key management in the URL input. We need to prevent
        // this ASAP. Otherwise, the basic caret movement using the arrow keys will be impossible.
        this.keystrokes.set('arrowright', stopPropagation);
        this.keystrokes.set('arrowleft', stopPropagation);
        this.keystrokes.set('arrowup', stopPropagation);
        this.keystrokes.set('arrowdown', stopPropagation);
    }
    /**
     * @inheritDoc
     */
    destroy() {
        super.destroy();
        this.focusTracker.destroy();
        this.keystrokes.destroy();
    }
    /**
     * Returns a view of the integration.
     *
     * @param name The name of the integration.
     */
    getIntegration(name) {
        return this._integrations.find(integration => integration.name === name);
    }
    /**
     * Creates the following form controls:
     *
     * * {@link #insertButtonView},
     * * {@link #cancelButtonView}.
     *
     * @param locale The localization services instance.
     */
    _createActionButtons(locale) {
        const t = locale.t;
        const insertButtonView = new ButtonView(locale);
        const cancelButtonView = new ButtonView(locale);
        insertButtonView.set({
            label: t('Insert'),
            icon: icons.check,
            class: 'ck-button-save',
            type: 'submit',
            withText: true,
            isEnabled: this.imageURLInputValue
        });
        cancelButtonView.set({
            label: t('Cancel'),
            icon: icons.cancel,
            class: 'ck-button-cancel',
            withText: true
        });
        insertButtonView.bind('isEnabled').to(this, 'imageURLInputValue', value => !!value);
        insertButtonView.delegate('execute').to(this, 'submit');
        cancelButtonView.delegate('execute').to(this, 'cancel');
        return { insertButtonView, cancelButtonView };
    }
    /**
     * Focuses the first {@link #_focusables focusable} in the form.
     */
    focus() {
        this._focusCycler.focusFirst();
    }
}
