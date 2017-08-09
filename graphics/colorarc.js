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
  statics: {
    /**
     * The ratio the drawing implies to match the SVG to be used in original
     * design requiring this class.
     *
     * That is to read: in an image with height 200 pixels. the radius of
     * the circle to be drawing should be the radius of the circle that matches
     * the square with height 200 minus 27.
     *
     * This means that for a square with height 100, the radius of the drawn
     * circle should be 100 / 2 * ((100-27) / 100) => 36.5 pixels;
     *
     * @const {number}
     */
    radiusRatio: ((100 - 27) / 100)
  },

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
   * @param {number=} opt_startDegree The degree at which to start the arc.
   * @return {string}
   */
  getArc: function(rect, cr, opt_startDegree) {
    this.createArc(rect, cr, opt_startDegree);
    return this.canvas.toDataURL();
  },


  /**
   * Generate a new arc with the given size and color range.
   * Supports greyscaling the output.
   *
   * @param {goog.math.Rect} rect
   * @param {pstj.color.ColorRange} cr
   * @param {number=} opt_startDegree The degree at which to start the arc.
   */
  createArc: function(rect, cr, opt_startDegree) {
    this.setSize(rect);
    this.clear(rect);

    var radius = rect.height / 2 * pstj.graphics.ColorArc.radiusRatio;
    var startFromDegree = this.getDegreeDeclination_(opt_startDegree);
    var degreesToDraw = (360 - (startFromDegree * 2));
    var x = rect.width / 2;
    var y = rect.height / 2;

    this.context.lineWidth = 10;

    for (var i = 0; i < degreesToDraw; i++) {
      var rad =
          (i + startFromDegree) * constants.OneDegree + constants.ZeroDegree;
      if (rad > constants.CircleCircumference)
        rad = rad - constants.CircleCircumference;
      var colorValue = cr.getColorValueAsRgbInstance(
          mu.getFractionFromValue(i, degreesToDraw));
      this.context.beginPath();
      // this.context.strokeStyle = colorValue;
      // this.context.strokeStyle = goog.color.rgbArrayToHex(colorValue);
      this.context.strokeStyle = pstj.color.rgbArrayToCssString(colorValue);
      // Draw the arcs on top of each other to avoid gaps
      this.context.arc(x, y, radius, rad, rad + constants.TwoDegrees, false);
      this.context.stroke();
    }
  },


  /**
   * Expected to allow to have valid declination for arc drawing. Default
   * declination is set to 29 to preserve existing behavior for users that
   * already expect this behavior.
   *
   * @private
   * @param {number=} opt_number
   * @return {number}
   */
  getDegreeDeclination_: function(opt_number) {
    if (goog.isNumber(opt_number)) {
      if (opt_number < 0 || opt_number > 179) {
        // This dos not make any sense... use default
        return 29;
      } else {
        return opt_number;
      }
    } else
      return 29;
  }
});
goog.addSingletonGetter(pstj.graphics.ColorArc);

});  // goog.scope
