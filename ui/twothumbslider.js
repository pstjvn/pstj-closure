goog.provide('pstj.ui.TwoThumbSlider');

goog.require('goog.dom.dataset');
goog.require('goog.ui.TwoThumbSlider');
goog.require('pstj.math.utils');



/**
 * @constructor
 * @extends {goog.ui.TwoThumbSlider}
 * @param {goog.dom.DomHelper=} opt_domHelper Optional deom helper to use.
 */
pstj.ui.TwoThumbSlider = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
  /**
   * @type {!number}
   * @protected
   */
  this.multiplicator = 1;
  /**
   * The number of digits after the floating point that bear significance.
   * @protected
   * @type {!number}
   */
  this.significantDigits = 0;
};
goog.inherits(pstj.ui.TwoThumbSlider, goog.ui.TwoThumbSlider);


/**
 * Enumerates the data keys we understand for this component.
 * @enum {string}
 */
pstj.ui.TwoThumbSlider.DATA = {
  MINIMUM: 'min',
  MAXIMUM: 'max',
  STEP: 'step'
};


/** @inheritDoc */
pstj.ui.TwoThumbSlider.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);

  var min = pstj.math.utils.parseFloat(
      goog.dom.dataset.get(
          this.getElement(),
          pstj.ui.TwoThumbSlider.DATA.MINIMUM), 1);

  var max = pstj.math.utils.parseFloat(
      goog.dom.dataset.get(
          this.getElement(),
          pstj.ui.TwoThumbSlider.DATA.MAXIMUM), 100);

  var step = pstj.math.utils.parseFloat(
      goog.dom.dataset.get(
          this.getElement(),
          pstj.ui.TwoThumbSlider.DATA.STEP), 1);

  this.multiplicator = pstj.math.utils.calculateCommonMultiplicator(
      min, max, step);

  this.significantDigits = this.multiplicator.toString().length - 1;

  this.setMinimum(min * this.multiplicator);
  this.setMaximum(max * this.multiplicator);
  this.setStep(step * this.multiplicator);
};


/**
 * Accessor for the multiplicator value.
 * @return {!number}
 */
pstj.ui.TwoThumbSlider.prototype.getMultiplicator = function() {
  return this.multiplicator;
};


/**
 * Accessor for the number of significant digits in the multiplicator.
 * @return {!number}
 */
pstj.ui.TwoThumbSlider.prototype.getSignificantDigitsCount = function() {
  return this.significantDigits;
};


/**
 * Returns the value after adjustment by the multiplicator.
 * @return {!number}
 */
pstj.ui.TwoThumbSlider.prototype.getAdjustedValue = function() {
  return (this.getValue() / this.multiplicator);
};


/**
 * Returns the extent adjusted with the multiplicator.
 * @return {!number}
 */
pstj.ui.TwoThumbSlider.prototype.getAdjustedExtent = function() {
  return (this.getExtent() / this.multiplicator);
};
