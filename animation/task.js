goog.provide('pstj.animation.Task');

goog.require('goog.log');


/**
 * Implements an animation task item.
 * @constructor
 * @struct
 * @param {function(pstj.animation.State)} callback Actual work.
 */
pstj.animation.Task = function(callback) {
  /**
   * @private
   * @final {number}
   */
  this.id_ = pstj.animation.Task.getUniqueId_();
  /**
   * The callback for the task - the actual work to be done.
   * @private
   * @final
   * @type {function(pstj.animation.State): void}
   */
  this.callback_ = callback;
};

/**
 * Logger for the animation.
 * @type {goog.debug.Logger}
 * @protected
 */
pstj.animation.Task.prototype.logger =
    goog.log.getLogger('pstj.animation.Task');

/**
 * Allow to call the instance as a function.
 * @param {pstj.animation.State} state
 */
pstj.animation.Task.prototype.call = function(state) {
  goog.log.fine(this.logger, 'Running task ' + this.id_);
  this.callback_(state);
};

/**
 * @static
 * @private
 * @type {number}
 */
pstj.animation.Task.id_ = 0;

/**
 * Generates and returns a unique ID for the task, used only for debugging.
 * @private
 * @static
 * @return {number}
 */
pstj.animation.Task.getUniqueId_ = function() {
  return pstj.animation.Task.id_++;
};
