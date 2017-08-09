/**
 * @fileoverview Extracted logic for drawing color arcs with
 * dynamic color ranges.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.graphics.ColorArc');

goog.require('pstj.color');
goog.require('pstj.math.constants');
goog.require('pstj.math.utils');


goog.scope(function() {
var mu = pstj.math.utils;
var constants = pstj.math.constants;


/**
 * Provides means to construct dynamically an image that represents a spread
 * of color values between start and end color in the form of an arc.
 */
pstj.graphics.ColorArc = goog.defineClass(null, {
  constructor: function() {
    /**
     * @protected
     * @type {HTMLCanvasElement}
     */
    this.canvas =
        /** @type {HTMLCanvasElement} */ (document.createElement('canvas'));
    /**
     * @protected
     * @type {CanvasRenderingContext2D}
     */
    this.context =
        /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
  },

  /**
   * Sets a new reference size
   * @param {goog.math.Rect} rect
   */
  setSize: function(rect) {
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  },

  /**
   * Clears the drawing.
   * @param {goog.math.Rect} rect
   */
  clear: function(rect) {
    this.context.clearRect(0, 0, rect.width, rect.height);
  },


  /**
   * Force generation of the arc on the canvas and returns the image data for
   * it.
   *
   * @param {goog.math.Rect} rect
   * @param {pstj.color.ColorRange} cr
   * @return {string}
   */
  getArc: function(rect, cr) {
    this.createArc(rect, cr);
    return this.canvas.toDataURL();
  },


  /**
   * Generate a new arc with the given size and color range.
   * Supports greyscaling the output.
   *
   * @param {goog.math.Rect} rect
   * @param {pstj.color.ColorRange} cr
   */
  createArc: function(rect, cr) {
    this.setSize(rect);
    this.clear(rect);
    var ctx = this.context;

    // TODO: This is solely for our SVG, instead calculate it from the source.
    var radius = 100 - 27;
    var degreesToDraw = 302;
    var startFromDegree = 29;

    var x = rect.width / 2;
    var y = rect.height / 2;
    var r = mu.getValueFromPercent(radius, y);
    ctx.lineWidth = 10;

    for (var i = 0; i < degreesToDraw; i++) {
      var rad =
          (i + startFromDegree) * constants.OneDegree + constants.ZeroDegree;
      if (rad > constants.CircleCircumference)
        rad = rad - constants.CircleCircumference;
      var colorValue = cr.getColorValueAsRgbInstance(
          mu.getFractionFromValue(i, degreesToDraw));
      ctx.beginPath();
      // ctx.strokeStyle = colorValue;
      // ctx.strokeStyle = goog.color.rgbArrayToHex(colorValue);
      ctx.strokeStyle = pstj.color.rgbArrayToCssString(colorValue);
      // Draw the arcs on top of each other to avoid gaps
      ctx.arc(x, y, r, rad, rad + constants.TwoDegrees, false);
      ctx.stroke();
    }
  }
});
goog.addSingletonGetter(pstj.graphics.ColorArc);

});  // goog.scope
