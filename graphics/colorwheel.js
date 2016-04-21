goog.module('pstj.graphics.ColorWheel');

var ColorWheel = class ColorWheel {
  constructor() {
    /**
     * @protected
     * @type {!HTMLCanvasElement}
     */
    this.canvas =
        /** @type {!HTMLCanvasElement} */(document.createElement('canvas'));
    /**
     * @protected
     * @type {!CanvasRenderingContext2D}
     */
    this.context =
        /** @type {!CanvasRenderingContext2D} */(this.canvas.getContext('2d'));
  }

  /**
   * Set the size of the canvas.
   * @param {!goog.math.Rect} rect
   * @protected
   */
  setSize(rect) {
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  /**
   * Clear the canvas so we can start drawing anew
   * @protected
   */
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Generate color wheel with defined size.
   * @param {!goog.math.Rect} rect
   * @return {string}
   */
  getColorWheelAsDataURI(rect) {
    this.setSize(rect);
    this.clear();

    // https://jsfiddle.net/xty0z5g5/3/

    var radius = rect.width / 2;
    return '';
  }

  /**
   * Enables the debugging fo the drawing by adding the cnvas to an element.
   * @param {!Element} container
   */
  enableDebug(container) {
    container.appendChild(this.canvas);
  }
};
goog.addSingletonGetter(ColorWheel);

exports = ColorWheel;