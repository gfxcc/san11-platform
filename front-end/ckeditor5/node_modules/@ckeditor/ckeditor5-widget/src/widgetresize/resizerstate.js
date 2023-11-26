/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module widget/widgetresize/resizerstate
 */
import { ObservableMixin, Rect } from '@ckeditor/ckeditor5-utils';
/**
 * Stores the internal state of a single resizable object.
 */
export default class ResizeState extends ObservableMixin() {
    /**
     * @param options Resizer options.
     */
    constructor(options) {
        super();
        this.set('activeHandlePosition', null);
        this.set('proposedWidthPercents', null);
        this.set('proposedWidth', null);
        this.set('proposedHeight', null);
        this.set('proposedHandleHostWidth', null);
        this.set('proposedHandleHostHeight', null);
        this._options = options;
        this._referenceCoordinates = null;
    }
    /**
     * The original width (pixels) of the resized object when the resize process was started.
     */
    get originalWidth() {
        return this._originalWidth;
    }
    /**
     * The original height (pixels) of the resized object when the resize process was started.
     */
    get originalHeight() {
        return this._originalHeight;
    }
    /**
     * The original width (percents) of the resized object when the resize process was started.
     */
    get originalWidthPercents() {
        return this._originalWidthPercents;
    }
    /**
     * A width to height ratio of the resized image.
     */
    get aspectRatio() {
        return this._aspectRatio;
    }
    /**
     *
     * @param domResizeHandle The handle used to calculate the reference point.
     */
    begin(domResizeHandle, domHandleHost, domResizeHost) {
        const clientRect = new Rect(domHandleHost);
        this.activeHandlePosition = getHandlePosition(domResizeHandle);
        this._referenceCoordinates = getAbsoluteBoundaryPoint(domHandleHost, getOppositePosition(this.activeHandlePosition));
        this._originalWidth = clientRect.width;
        this._originalHeight = clientRect.height;
        this._aspectRatio = clientRect.width / clientRect.height;
        const widthStyle = domResizeHost.style.width;
        if (widthStyle && widthStyle.match(/^\d+(\.\d*)?%$/)) {
            this._originalWidthPercents = parseFloat(widthStyle);
        }
        else {
            this._originalWidthPercents = calculateHostPercentageWidth(domResizeHost, clientRect);
        }
    }
    update(newSize) {
        this.proposedWidth = newSize.width;
        this.proposedHeight = newSize.height;
        this.proposedWidthPercents = newSize.widthPercents;
        this.proposedHandleHostWidth = newSize.handleHostWidth;
        this.proposedHandleHostHeight = newSize.handleHostHeight;
    }
}
/**
 * Calculates a relative width of a `domResizeHost` compared to its ancestor in percents.
 */
function calculateHostPercentageWidth(domResizeHost, resizeHostRect) {
    const domResizeHostParent = domResizeHost.parentElement;
    // Need to use computed style as it properly excludes parent's paddings from the returned value.
    let parentWidth = parseFloat(domResizeHostParent.ownerDocument.defaultView.getComputedStyle(domResizeHostParent).width);
    // Sometimes parent width cannot be accessed. If that happens we should go up in the elements tree
    // and try to get width from next ancestor.
    // https://github.com/ckeditor/ckeditor5/issues/10776
    const ancestorLevelLimit = 5;
    let currentLevel = 0;
    let checkedElement = domResizeHostParent;
    while (isNaN(parentWidth)) {
        checkedElement = checkedElement.parentElement;
        if (++currentLevel > ancestorLevelLimit) {
            return 0;
        }
        parentWidth = parseFloat(domResizeHostParent.ownerDocument.defaultView.getComputedStyle(checkedElement).width);
    }
    return resizeHostRect.width / parentWidth * 100;
}
/**
 * Returns coordinates of the top-left corner of an element, relative to the document's top-left corner.
 *
 * @param resizerPosition The position of the resize handle, e.g. `"top-left"`, `"bottom-right"`.
 */
function getAbsoluteBoundaryPoint(element, resizerPosition) {
    const elementRect = new Rect(element);
    const positionParts = resizerPosition.split('-');
    const ret = {
        x: positionParts[1] == 'right' ? elementRect.right : elementRect.left,
        y: positionParts[0] == 'bottom' ? elementRect.bottom : elementRect.top
    };
    ret.x += element.ownerDocument.defaultView.scrollX;
    ret.y += element.ownerDocument.defaultView.scrollY;
    return ret;
}
/**
 * @param resizerPosition The expected resizer position, like `"top-left"`, `"bottom-right"`.
 * @returns A prefixed HTML class name for the resizer element.
 */
function getResizerHandleClass(resizerPosition) {
    return `ck-widget__resizer__handle-${resizerPosition}`;
}
/**
 * Determines the position of a given resize handle.
 *
 * @param domHandle Handle used to calculate the reference point.
 * @returns Returns a string like `"top-left"` or `undefined` if not matched.
 */
function getHandlePosition(domHandle) {
    const resizerPositions = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
    for (const position of resizerPositions) {
        if (domHandle.classList.contains(getResizerHandleClass(position))) {
            return position;
        }
    }
}
/**
 * @param position Like `"top-left"`.
 * @returns Inverted `position`, e.g. it returns `"bottom-right"` if `"top-left"` was given as `position`.
 */
function getOppositePosition(position) {
    const parts = position.split('-');
    const replacements = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
    };
    return `${replacements[parts[0]]}-${replacements[parts[1]]}`;
}
