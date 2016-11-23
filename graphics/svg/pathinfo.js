goog.module('pstj.graphics.svg.PathInfo');

const assert = goog.require('goog.asserts');
const style = goog.require('goog.style');

/**
 * Abstracts away the information that we need in order to work with the
 * SVG paths in a straightforward manner.
 *
 * This class gives us several advantages: caches values so we do not touch the
 * DOM apis that often and hides the complexity of dealing with browser bugs
 * (see bellow private methods for information about that).
 *
 */
const PathInfo = class {
  /** @param {!SVGPathElement} path */
  constructor(path) {
    /** @private {!SVGPathElement} */
    this.element_ = path;
    /** @type {?number} */
    this.length_ = null;
    /** @private {number} */
    this.offset_ = 1.0;
    /** @private {boolean} */
    this.visible_ = true;
    /** @private {boolean} */
    this.dashed_ = false;
  }

  /**
   * Allow access to the underlaying path element.
   *
   * @return {!SVGPathElement}
   */
  getElement() {
    return this.element_;
  }

  /**
   * Getter for the length of the path, we use lazy initializing of the value
   * in order to avoid touching the DOM if not needed.
   *
   * Nod needing it means that the SVG will never be animated, we want to delay
   * the work as much as possible.
   *
   * @return {!number}
   */
  getLength() {
    if (goog.isNull(this.length_)) this.length_ = this.element_.getTotalLength();
    return goog.asserts.assertNumber(this.length_);
  }

  /**
   * Setter to allow more natural API, updates the path's progress drawing
   * on the screen.
   *
   * Note that the update is immediate, if you need to sync the drawing with
   * a timer, do it elsewhere.
   *
   * @param {number} offset
   */
  setOffset(offset) {
    console.log('Setting offset', this.offset_, offset)
    if (offset != this.offset_) {
      this.offset_ = offset;
      this.setVisible_(this.offset_ < this.getLength());
      this.enableStrokeDasharray_(this.offset_ != 0.0);
      style.setStyle(this.element_, 'stroke-dashoffset', this.offset_.toString());
    }
  }

  /**
   * Works around some broken paths.
   *
   * When a path is small enough (for example only several points and very close
   * to one another) the stroke width make them look like a short line, but it
   * is not and thus it cannot be correctly animated on some browsers: the line
   * still shows even when the offset equals the length and prevents from
   * continuously showing the drawing.
   *
   * For this reason we hide the elements that are supposed to have their
   * offset all the way up (invisible).
   *
   * @param {boolean} visible
   * @private
   */
  setVisible_(visible) {
    if (visible != this.visible_) {
      this.visible_ = visible;
      style.setElementShown(this.element_, this.visible_);
    }
  }

  /**
   * Works around some broken paths.
   *
   * When set the dash array may break the view of some paths even if those are
   * set to have no dash offset, so when the offset is set to 0 we must also
   * remove the dash array property or simply set it to empty string.
   *
   * @param {boolean} enable
   * @private
   */
  enableStrokeDasharray_(enable) {
    if (this.dashed_ != enable) {
      this.dashed_ = enable;
      console.log(enable)
      style.setStyle(this.element_, 'stroke-dasharray',
                     enable ? `${this.getLength()} ${this.getLength()}` : '');
    }
  }
}

exports = PathInfo;
