goog.provide('pstj.animation.State');

/**
 * Provides basic for the animation State.
 * @constructor
 * @struct
 */
pstj.animation.State = function() {
  /** @type {number} */
  this.timestamp = 0;
};

/** Clears the state, will be called at the end of each cycle. */
pstj.animation.State.prototype.clear = function() {};

