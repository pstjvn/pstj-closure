/**
 * @fileoverview Provides color utilities missing from the closure library.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.color');

goog.require('goog.color');


/**
 * Converts a HEX colour string to rgba value with alpha. The result is style
 *   string that can be directly asssigned as color value.
 * @param {!string} hex_color The HEX colour value.
 * @param {!number} alpha The alpha value to apply, 0 is transparent, 255 is
 *   opaque).
 * @return {!string} The rgba value calculated.
 */
pstj.color.hexToRgba = function(hex_color, alpha) {
  if (!goog.isNumber(alpha)) {
    throw new Error('Alpha value should be a number');
  }
  var rgb = goog.color.hexToRgb(hex_color);
  if (alpha < 0) alpha = 0;
  if (alpha > 1) alpha = 1;
  rgb.push(alpha);
  return 'rgba(' + rgb.join(',') + ')';
};


/**
 * The implemented algorythms for converting to greyscaled value.
 *
 * @enum {number}
 */
pstj.color.GreyscaleMethod = {
  LIGHTNESS: 0,
  AVERAGE: 1,
  LUMINOSITY: 2,
  DEFAULT: 9
};


/**
 * Given a color, transform its value to greyscale.
 *
 * As a second argument a method can be provided to convert the value. If none
 * is provided the default will be used, as default is luminosity conversion.
 *
 * @param {!goog.color.Rgb} color The color to greyscale.
 * @param {pstj.color.GreyscaleMethod=} opt_method Optionally, a method to use
 *    to convert the color.
 * @return {!goog.color.Rgb}
 */
pstj.color.toGreyscale = function(color, opt_method) {
  if (!goog.isDef(opt_method)) opt_method = pstj.color.GreyscaleMethod.DEFAULT;
  var gs = 0;
  switch (opt_method) {
    case pstj.color.GreyscaleMethod.LIGHTNESS:
      gs = (Math.max(color[0], color[1], color[2]) +
            Math.min(color[0], color[1], color[2])) / 2;
      break;
    case pstj.color.GreyscaleMethod.AVERAGE:
      gs = (color[0] + color[1] + color[2]) / 3;
      break;
    case pstj.color.GreyscaleMethod.LUMINOSITY:
    case pstj.color.GreyscaleMethod.DEFAULT:
      gs = (0.21 * color[0]) + (0.72 * color[1]) + (0.07 * color[2]);
      break;
    default:
      throw new Error('Unknown method for converting to greyscale');
  }
  return (/** @type {!goog.color.Rgb} */ ([gs, gs, gs]));
};
