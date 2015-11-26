/**
 * @fileoverview ColorRange is used to retrieve color values based on
 * percent in the color range.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.color.ColorRange');

goog.require('goog.color');
goog.require('pstj.math.utils');


/** Implements a simple color range */
pstj.color.ColorRange = goog.defineClass(null, {
  constructor: function() {
    /**
     * @type {string}
     * @private
     */
    this.startColorHex_ = '';
    /**
     * @type {string}
     * @private
     */
    this.endColorHex_ = '';
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
    this.startColorHex_ = start;
    this.endColorHex_ = stop;
    this.init_();
  },

  /**
   * Initialize internal values.
   * @private
   */
  init_: function() {
    this.startrgb_ = goog.color.hexToRgb(this.startColorHex_);
    this.endrgb_ = goog.color.hexToRgb(this.endColorHex_);
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
   * @param {number} percent The percent to use.
   * @return {string}
   */
  getColorValue: function(percent) {
    for (var i = 0; i < 3; i++) {
      if (this.revert_[i] == 0) {
        this.lastCalculatedValue_[i] = this.startrgb_[i];
      } else if (this.revert_[i] == 1) {
        this.lastCalculatedValue_[i] = +(
            pstj.math.utils.getValueFromPercent(this.distance_[i], percent) +
            this.startrgb_[i]).toFixed();
      } else if (this.revert_[i] == -1) {
        this.lastCalculatedValue_[i] = +(
            this.startrgb_[i] -
            pstj.math.utils.getValueFromPercent(this.distance_[i], percent))
                .toFixed();
      }
    }
    return goog.color.rgbArrayToHex(this.lastCalculatedValue_);
  }
});
