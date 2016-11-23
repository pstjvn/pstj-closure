goog.provide('pstj.animation.TaskSet');


/**
 * Implements taskset to be usd in animation scheduling.
 * @constructor
 * @struct
 * @param {!pstj.animation.State} state
 */
pstj.animation.TaskSet = function(state) {
  /** @type {boolean} */
  this.scheduled = false;
  /** @type {?pstj.animation.Task} */
  this.measure = null;
  /** @type {?pstj.animation.Task} */
  this.mutate = null;
  /** @type {!pstj.animation.State} */
  this.state = state;
};
