/**
 * @fileoverview Extracted logic for drawing color arcs with
 * dynamic color ranges.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.graphics.ColorArc');

goog.require('pstj.math.utils');


goog.scope(function() {
var g = pstj.graphics;
var mu = pstj.math.utils;


/** Separate implementation */
g.ColorArc = goog.defineClass(null, {
  constructor: function() {
    /**
     * @protected
     * @type {HTMLCanvasElement}
     */
    this.canvas = /** @type {HTMLCanvasElement} */(
        document.createElement('canvas'));
    /**
     * @protected
     * @type {CanvasRenderingContext2D}
     */
    this.context = /** @type {CanvasRenderingContext2D} */(
        this.canvas.getContext('2d'));
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
   * Generate a new arc with the given size and color range.
   * @param {goog.math.Rect} rect
   * @param {pstj.color.ColorRange} cr
   * @return {string} The canvas image as string.
   */
  getArc: function(rect, cr) {
    this.setSize(rect);
    this.clear(rect);
    var ctx = this.context;

    // TODO: This is solely for our SVG, instead calculate it from the source.
    var radius = 100 - 27;
    var degreesToDraw = 302;
    var startFromDegree = 29;

    var start = Math.PI + (Math.PI / 2);
    var cicumference = 2 * Math.PI;
    var oneDeg = Math.PI / 180;

    var x = rect.width / 2;
    var y = rect.height / 2;

    for (var i = 0; i < degreesToDraw; i++) {
      var rad = (i + startFromDegree) * oneDeg + start;
      if (rad > cicumference) {
        rad = rad - cicumference;
      }

      ctx.strokeStyle = cr.getColorValue(mu.getFractionFromValue(i,
          degreesToDraw));
      ctx.lineWidth = 10;
      ctx.beginPath();
      // Draw the arcs on top of each other to avoid gaps
      ctx.arc(x, y, mu.getValueFromPercent(radius, y),
          rad, rad + oneDeg * 2, false);
      ctx.stroke();
    }

    return this.canvas.toDataURL();
  }
});
goog.addSingletonGetter(pstj.graphics.ColorArc);

});  // goog.scope
