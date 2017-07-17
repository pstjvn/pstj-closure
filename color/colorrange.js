/**
 * @fileoverview ColorRange is used to retrieve color values based on
 * percent in the color range.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.color.ColorRange');

goog.require('goog.array');
goog.require('goog.color');
goog.require('pstj.math.utils');


/** Implements a simple color range */
pstj.color.ColorRange = goog.defineClass(null, {
  constructor: function() {
    /**
     * @type {goog.color.Rgb}
     * @private
     */
    this.startrgb_ = null;
    /**
     * @type {goog.color.Rgb}
     * @private
     */
    this.endrgb_ = null;
    /**
     * @type {Array<number>}
     * @private
     */
    this.distance_ = [0, 0, 0];
    /**
     * @type {Array<number>}
     * @private
     */
    this.revert_ = [0, 0, 0];
    /**
     * @type {goog.color.Rgb}
     * @private
     */
    this.lastCalculatedValue_ = [0, 0, 0];
  },

  /**
   * Sets new colors to use for the range.
   * @param {string} start The start color value as hex color.
   * @param {string} stop The end color value as hex color.
   */
  setColors: function(start, stop) {
    this.startrgb_ = goog.color.hexToRgb(start);
    this.endrgb_ = goog.color.hexToRgb(stop);
    this.init_();
  },

  /**
   * Initialize internal values.
   * @private
   */
  init_: function() {
    goog.array.forEach(this.startrgb_, function(_, i) {
      if (this.startrgb_[i] < this.endrgb_[i]) {
        this.distance_[i] = this.endrgb_[i] - this.startrgb_[i];
        this.revert_[i] = 1;
      } else if (this.startrgb_[i] > this.endrgb_[i]) {
        this.distance_[i] = this.startrgb_[i] - this.endrgb_[i];
        this.revert_[i] = -1;
      } else {
        this.distance_[i] = 0;
        this.revert_[i] = 0;
      }
    }, this);
  },

  /**
   * Given a percentage returns the percentile representation of the color
   * range.
   * @param {number} fraction The fraction to use
   * @return {string}
   */
  getColorValue: function(fraction) {
    for (var i = 0; i < 3; i++) {
      if (this.revert_[i] == 0) {
        this.lastCalculatedValue_[i] = this.startrgb_[i];
      } else if (this.revert_[i] == 1) {
        this.lastCalculatedValue_[i] = +(
            pstj.math.utils.getValueFromFraction(this.distance_[i], fraction) +
            this.startrgb_[i]).toFixed();
      } else if (this.revert_[i] == -1) {
        this.lastCalculatedValue_[i] = +(
            this.startrgb_[i] -
            pstj.math.utils.getValueFromFraction(this.distance_[i], fraction))
                .toFixed();
      }
    }
    return goog.color.rgbArrayToHex(this.lastCalculatedValue_);
  }
});
