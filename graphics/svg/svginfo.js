goog.module('pstj.graphics.svg.SvgInfo');

const ETarget = goog.require('goog.events.EventTarget');
const PathInfo = goog.require('pstj.graphics.svg.PathInfo');
const array = goog.require('goog.array');

/**
 * Abstracts the information that we need in order to work with the SVG element
 * and animate its paths.
 */
const SvgInfo = class extends ETarget {
  /** @param {!SVGElement} svg */
  constructor(svg) {
    super();
    /** @private {!SVGElement} */
    this.element_ = svg;
    /** @private {!Array<PathInfo>} */
    this.paths_ = [];
    /** @private {number} */
    this.length_ = 0;
    /** @private {boolean} */
    this.initialized_ = false;
  }

  /**
   * Initializes the information used internally.
   *
   * This can potentially be a tap for devs, as it used to be called
   * automatically,
   * but as the understanding of the web platofrm advances we now elect to
   * delay as much work as possible up until the moment it is actually
   * needed. thus we delay the processing of the SVG element and its
   * paths as much as possible.
   */
  init() {
    if (!this.initialized_) {
      this.initialized_ = true;
      Array.from(this.element_.querySelectorAll('path')).forEach((path) => {
        let instance = new PathInfo(path);
        this.length_ += instance.getLength();
        this.paths_.push(instance);
      });
    }
  }

  /**
   * Updates the drawing progress.
   *
   * Zero (0) being the drawing has not started yet and 1 being the drawing
   * is complete. Anything between those two values is the progress of the
   * drawing.
   *
   * @param {number} progress The drawing completeness.
   */
  setDrawingProgress(progress) {
    if (!this.initialized_)
      throw new Error(
          'Cannot update progress without instance being initialized');
    let desiredLength = this.length_ * progress;
    let len = 0;
    // let point = null;
    array.forEach(this.paths_, function(path) {
      // Show completely
      if (len + path.getLength() <= desiredLength) {
        path.setOffset(0.0);
      } else if (len + path.getLength() > desiredLength && len < desiredLength) {
        // Show partially
        path.setOffset(path.getLength() - (desiredLength - len));
        // point = path.getElement().getPointAtLength(desiredLength - len);
      } else {
        // Hide completely
        path.setOffset(path.getLength());
      }
      len += path.getLength();
    });
  }
};

exports = SvgInfo;
