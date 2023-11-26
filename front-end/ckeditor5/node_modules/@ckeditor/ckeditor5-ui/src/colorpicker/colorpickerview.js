/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module ui/colorpicker/colorpickerview
 */
import { convertColor, convertToHex } from './utils';
import { global, env } from '@ckeditor/ckeditor5-utils';
import { debounce } from 'lodash-es';
import View from '../view';
import LabeledFieldView from '../labeledfield/labeledfieldview';
import { createLabeledInputText } from '../labeledfield/utils';
import 'vanilla-colorful/hex-color-picker.js';
import '../../theme/components/colorpicker/colorpicker.css';
const waitingTime = 150;
/**
 * A class which represents a color picker with an input field for defining custom colors.
 */
export default class ColorPickerView extends View {
    /**
     * Creates a view of color picker.
     *
     * @param locale
     * @param config
     */
    constructor(locale, config = {}) {
        super(locale);
        this.set({
            color: '',
            _hexColor: ''
        });
        this.hexInputRow = this._createInputRow();
        const children = this.createCollection();
        if (!config.hideInput) {
            children.add(this.hexInputRow);
        }
        this.setTemplate({
            tag: 'div',
            attributes: {
                class: ['ck', 'ck-color-picker'],
                tabindex: -1
            },
            children
        });
        this._config = config;
        this._debounceColorPickerEvent = debounce((color) => {
            // At first, set the color internally in the component. It's converted to the configured output format.
            this.set('color', color);
            // Then let the outside world know that the user changed the color.
            this.fire('colorSelected', { color: this.color });
        }, waitingTime, {
            leading: true
        });
        // The `color` property holds the color in the configured output format.
        // Ensure it before actually setting the value.
        this.on('set:color', (evt, propertyName, newValue) => {
            evt.return = convertColor(newValue, this._config.format || 'hsl');
        });
        // The `_hexColor` property is bound to the `color` one, but requires conversion.
        this.on('change:color', () => {
            this._hexColor = convertColorToCommonHexFormat(this.color);
        });
        this.on('change:_hexColor', () => {
            // Update the selected color in the color picker palette when it's not focused.
            // It means the user typed the color in the input.
            if (document.activeElement !== this.picker) {
                this.picker.setAttribute('color', this._hexColor);
            }
            // There has to be two way binding between properties.
            // Extra precaution has to be taken to trigger change back only when the color really changes.
            if (convertColorToCommonHexFormat(this.color) != convertColorToCommonHexFormat(this._hexColor)) {
                this.color = this._hexColor;
            }
        });
    }
    /**
     * Renders color picker in the view.
     */
    render() {
        super.render();
        this.picker = global.document.createElement('hex-color-picker');
        this.picker.setAttribute('class', 'hex-color-picker');
        this.picker.setAttribute('tabindex', '-1');
        this._createSlidersView();
        if (this.element) {
            if (this.hexInputRow.element) {
                this.element.insertBefore(this.picker, this.hexInputRow.element);
            }
            else {
                this.element.appendChild(this.picker);
            }
            // Create custom stylesheet with a look of focused pointer in color picker and append it into the color picker shadowDom
            const styleSheetForFocusedColorPicker = document.createElement('style');
            styleSheetForFocusedColorPicker.textContent = '[role="slider"]:focus [part$="pointer"] {' +
                'border: 1px solid #fff;' +
                'outline: 1px solid var(--ck-color-focus-border);' +
                'box-shadow: 0 0 0 2px #fff;' +
                '}';
            this.picker.shadowRoot.appendChild(styleSheetForFocusedColorPicker);
        }
        this.picker.addEventListener('color-changed', event => {
            const customEvent = event;
            const color = customEvent.detail.value;
            this._debounceColorPickerEvent(color);
        });
    }
    /**
     * Focuses the first pointer in color picker.
     *
     */
    focus() {
        // In some browsers we need to move the focus to the input first.
        // Otherwise, the color picker doesn't behave as expected.
        // In FF, after selecting the color via slider, it instantly moves back to the previous color.
        // In all iOS browsers and desktop Safari, once the saturation slider is moved for the first time,
        // editor collapses the selection and doesn't apply the color change.
        // See: https://github.com/cksource/ckeditor5-internal/issues/3245, https://github.com/ckeditor/ckeditor5/issues/14119,
        // https://github.com/cksource/ckeditor5-internal/issues/3268.
        /* istanbul ignore next -- @preserve */
        if (!this._config.hideInput && (env.isGecko || env.isiOS || env.isSafari)) {
            const input = this.hexInputRow.children.get(1);
            input.focus();
        }
        const firstSlider = this.slidersView.first;
        firstSlider.focus();
    }
    /**
     * Creates collection of sliders in color picker.
     *
     * @private
     */
    _createSlidersView() {
        const colorPickersChildren = [...this.picker.shadowRoot.children];
        const sliders = colorPickersChildren.filter(item => item.getAttribute('role') === 'slider');
        const slidersView = sliders.map(slider => {
            const view = new SliderView(slider);
            return view;
        });
        this.slidersView = this.createCollection();
        slidersView.forEach(item => {
            this.slidersView.add(item);
        });
    }
    /**
     * Creates input row for defining custom colors in color picker.
     *
     * @private
     */
    _createInputRow() {
        const hashView = new HashView();
        const colorInput = this._createColorInput();
        return new ColorPickerInputRowView(this.locale, [hashView, colorInput]);
    }
    /**
     * Creates the input where user can type or paste the color in hex format.
     *
     * @private
     */
    _createColorInput() {
        const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);
        const { t } = this.locale;
        labeledInput.set({
            label: t('HEX'),
            class: 'color-picker-hex-input'
        });
        labeledInput.fieldView.bind('value').to(this, '_hexColor', pickerColor => {
            if (labeledInput.isFocused) {
                // Text field shouldn't be updated with color change if the text field is focused.
                // Imagine user typing hex code and getting the value of field changed.
                return labeledInput.fieldView.value;
            }
            else {
                return pickerColor.startsWith('#') ? pickerColor.substring(1) : pickerColor;
            }
        });
        // Only accept valid hex colors as input.
        labeledInput.fieldView.on('input', () => {
            const inputValue = labeledInput.fieldView.element.value;
            if (inputValue) {
                // Trim the whitespace.
                const trimmedValue = inputValue.trim();
                // Drop the `#` from the beginning if present.
                const hashlessInput = trimmedValue.startsWith('#') ? trimmedValue.substring(1) : trimmedValue;
                // Check if it's a hex color (3,4,6 or 8 chars long and with proper characters).
                const isValidHexColor = [3, 4, 6, 8].includes(hashlessInput.length) &&
                    /(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4})/.test(hashlessInput);
                if (isValidHexColor) {
                    // If so, set the color.
                    // Otherwise, do nothing.
                    this._debounceColorPickerEvent('#' + hashlessInput);
                }
            }
        });
        return labeledInput;
    }
}
// Converts any color format to a unified hex format.
//
// @param inputColor
// @returns An unified hex string.
function convertColorToCommonHexFormat(inputColor) {
    let ret = convertToHex(inputColor);
    if (!ret) {
        ret = '#000';
    }
    if (ret.length === 4) {
        // Unfold shortcut format.
        ret = '#' + [ret[1], ret[1], ret[2], ret[2], ret[3], ret[3]].join('');
    }
    return ret.toLowerCase();
}
// View abstraction over pointer in color picker.
class SliderView extends View {
    /**
     * @param element HTML elemnt of slider in color picker.
     */
    constructor(element) {
        super();
        this.element = element;
    }
    /**
     * Focuses element.
     */
    focus() {
        this.element.focus();
    }
}
// View abstraction over the `#` character before color input.
class HashView extends View {
    constructor(locale) {
        super(locale);
        this.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-color-picker__hash-view'
                ]
            },
            children: '#'
        });
    }
}
// The class representing a row containing hex color input field.
// **Note**: For now this class is private. When more use cases appear (beyond `ckeditor5-table` and `ckeditor5-image`),
// it will become a component in `ckeditor5-ui`.
//
// @private
class ColorPickerInputRowView extends View {
    /**
     * Creates an instance of the form row class.
     *
     * @param locale The locale instance.
     */
    constructor(locale, children) {
        super(locale);
        this.children = this.createCollection(children);
        this.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-color-picker__row'
                ]
            },
            children: this.children
        });
    }
}
