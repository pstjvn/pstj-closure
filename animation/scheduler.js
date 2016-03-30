goog.provide('pstj.animation.IScheduler');
goog.provide('pstj.animation.Scheduler');


/**
 * @interface
 */
pstj.animation.IScheduler = function() {};

/**
 * Function to start the implementation. All implementations should have this
 * method.
 */
pstj.animation.IScheduler.prototype.start = function() {};

/**
 * Sets the handler to be called when the timing if run.
 * @param {function(number)} cb
 */
pstj.animation.IScheduler.prototype.setHandler = function(cb) {};


/**
 * Implements actual scheduler as abstraction for the use classes.
 * @constructor
 * @struct
 * @param {function(number): void} fn The function that will be used to be used
 * as a handler for timing function used to schedule animations.
 */
pstj.animation.Scheduler = function(fn) {
  /**
   * The handler that will be executed then the
   * @final
   * @type {function(number): void}
   * @private
   */
  this.handler_ = fn;
};

/**
 * Tells the underlying function to start again.
 */
pstj.animation.Scheduler.prototype.start = function() {
  if (goog.isNull(pstj.animation.Scheduler.implementation_)) {
    throw new Error('No implementation provided for the timing function');
  }
  if (!pstj.animation.Scheduler.handlerIsSet_) {
    pstj.animation.Scheduler.handlerIsSet_ = true;
    pstj.animation.Scheduler.implementation_.setHandler(this.handler_);
  }
  pstj.animation.Scheduler.implementation_.start();
};


/**
 * Sets the implementation to be sued for timing function.
 * @param {pstj.animation.IScheduler} impl
 */
pstj.animation.Scheduler.setSchedulerImplementation = function(impl) {
  pstj.animation.Scheduler.handlerIsSet_ = false;
  pstj.animation.Scheduler.implementation_ = impl;
};


/**
 * Internal flag to check if the hander is correctly set in the timing
 * function.
 * @private
 * @type {boolean}
 */
pstj.animation.Scheduler.handlerIsSet_ = false;


/**
 * The implementation of the tmieing function provider.
 * @private
 * @type {pstj.animation.IScheduler}
 */
pstj.animation.Scheduler.implementation_ = null;
