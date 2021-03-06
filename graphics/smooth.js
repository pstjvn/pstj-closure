/**
 * @fileoverview Provides means to delay action within a component to the next
 * available drawing time frame. Uses RAF.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.graphics.Smooth');

goog.require('goog.Disposable');
goog.require('goog.async.AnimationDelay');



/**
 * Provides an abstraction for executing drawing in a component in sync with
 *   the browser drawing operation.
 *
 * Usage example:
 * <pre>
 * this.smooth = new pstj.graphics.Smooth(this.updateUI, this);
 * this.smooth.update();
 * </pre>
 *
 * The main usage is for components that need to make smooth
 * drawings/transitions but do not have means to implement the RAF or code that
 * utilizes such components and does not want/need to extend it.
 *
 * @constructor
 * @extends {goog.Disposable}
 * @param {function(number): boolean} callback Function to execute when
 *   animation frame is granted. The return value will be used to determine if
 *   the dirty flag should be lifted: if true is returned another redraw will
 *   be executed.
 * @param {Object=} opt_handler The 'this' object to bind the handling method
 * to.
 */
pstj.graphics.Smooth = function(callback, opt_handler) {
  goog.base(this);
  /**
   * Flag to denote if the state of the composite has been altered since the
   * last drawing operation.
   * @type {boolean}
   * @private
   */
  this.dirty_ = false;
  /**
   * The bound handler of the update trigger. This function will be called on
   * each frame until it returns false.
   * @type {?function(number): boolean}
   * @private
   */
  this.callback_ = goog.isDefAndNotNull(opt_handler) ?
      goog.bind(callback, opt_handler) : callback;
  /**
   * The delayed handler of updates.
   * @type {goog.async.AnimationDelay}
   * @private
   */
  this.raf_ = new goog.async.AnimationDelay(this.onRaf_, undefined, this);
  this.registerDisposable(this.raf_);
};
goog.inherits(pstj.graphics.Smooth, goog.Disposable);


/**
 * Resets the dirty state of the composite and forces a redraw if one is not
 *   already scheduled.
 */
pstj.graphics.Smooth.prototype.update = function() {
  this.dirty_ = true;
  if (!this.raf_.isActive()) {
    this.raf_.start();
  }
};


/**
 * Internal method to handle the RAF time out (execution of drawing
 *   operations.
 * @param {number} time_stamp The current time stamp of the event.
 * @private
 */
pstj.graphics.Smooth.prototype.onRaf_ = function(time_stamp) {
  if (!this.dirty_) return;
  this.raf_.start();
  this.dirty_ = !!(this.callback_(time_stamp));
};
