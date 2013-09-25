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
