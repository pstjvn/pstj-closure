goog.provide('pstj.animation.RafSI');

goog.require('goog.async.AnimationDelay');
goog.require('pstj.animation.IScheduler');

/**
 * @constructor
 * @struct
 * @implements {pstj.animation.IScheduler}
 */
pstj.animation.RafSI = function() {
  /** @private {goog.async.AnimationDelay} */
  this.impl_ = null;
};

/**
 * Implements setting the handler.
 *
 * @param {function(number): void} fn
 */
pstj.animation.RafSI.prototype.setHandler = function(fn) {
  this.impl_ = new goog.async.AnimationDelay(fn);
};

/**
 * Implements the interface for starting the next cycle animation timing.
 */
pstj.animation.RafSI.prototype.start = function() {
  if (this.impl_)
    this.impl_.start();
  else
    throw new Error('Hnadler was never set so we cannot call the timing');
};
