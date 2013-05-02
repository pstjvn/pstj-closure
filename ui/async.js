goog.provide('pstj.ui.Async');

goog.require('goog.functions');
goog.require('pstj.graphics.Smooth');
goog.require('pstj.ui.Templated');

/**
 * @fileoverview Provides basic asynchrnously updateable component.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Widget base class that has a RAF bound method for redrawing its state. The
 *   #update method should be called on occasion a property of the drawing
 *   scheme is altered and the draw method should be oweridden to implement
 *   the actual drawing.
 * @constructor
 * @extends {pstj.ui.Templated}
 */
pstj.ui.Async = function() {
  goog.base(this);
  /**
   * @private
   * @type {pstj.graphics.Smooth}
   */
  this.smooth_ = new pstj.graphics.Smooth(this.draw, this);
  this.registerDisposable(this.smooth_);
};
goog.inherits(pstj.ui.Async, pstj.ui.Templated);

/**
 * The main drawing method. Default implementation always returns false as it
 *   does no drawing at all.
 * @param {number} ts The time stamp of the current redraw as provided by the
 *   RAF abstraction.
 * @return {boolean} True if the redraw was not completed at this iteration,
 *   false if the draw is complete.
 */
pstj.ui.Async.prototype.draw = goog.functions.FALSE;

/**
 * Umbrella method, internally it uses RAF to call the draw method.
 */
pstj.ui.Async.prototype.update = function() {
  this.smooth_.update();
};

/** @inheritDoc */
pstj.ui.Async.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.smooth_ = null;
};
