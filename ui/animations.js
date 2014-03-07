goog.provide('pstj.ui.animations');

goog.require('goog.async.AnimationDelay');


goog.scope(function() {
var _ = pstj.ui.animations;



/**
 * Provides the basic class for creating animation.
 * The animation can be then started/stopped. Overrideing the [draw] method is
 * used to implement the nimation itself.
 * @constructor
 */
_.Base = function() {
  this.runnig_ = false;
  this.onRafBound_ = new goog.async.AnimationDelay(
      this.onRaf_, undefined, this);
};


/**
 * Starts the animation if not already started.
 */
_.Base.prototype.start = function() {
  this.runnig_ = true;
  if (!this.draw_.isActive()) {
    this.draw_.start();
  }
};


/**
 * Inernal method that is bound to the raf. It checks explicitly to make
 * sure the animation is still supposed to run and executes the
 * drawing method. If the drawing method returns true, the animation delay
 * is rescheduled.
 * @param {number} ts The timestamp of the RAF (in seconds as wrapped by
 * Closure authors).
 * @private
 */
_.Base.prototype.onRaf_ = function(ts) {
  if (this.runnig_ && this.draw(ts)) {
    this.onRafBound_.start();
  }
};


/**
 * Stops the animation.
 */
_.Base.prototype.stop = function() {
  this.runnig_ = false;
  this.onRafBound_.stop();
};


/**
 * Method to be overriden by implementors of animations.
 * @protected
 * @param {number} ts The timsstamp as wrapped by Closure (milliseconds current
 * time).
 * @return {boolean} If true the animation must continue as the drawing
 * did not complete all the drawing job.
 */
_.Base.prototype.draw = function(ts) {
  return false;
};



/**
 * Provides class that can animate any element. The animation is predefined in
 * the [draw] method.
 * @constructor
 * @extends {_.Base}
 */
_.Element = function() {
  goog.base(this);
  /**
   * Reference to the Element to be currently animated.
   * @type {Element}
   * @protected
   */
  this.element = null;
};
goog.base(_.Element, _.Base);


/**
 * Grabs an element to be animated.
 * @param {Element} el The HTML element to animate.
 */
_.Element.prototype.grab = function(el) {
  this.element = el;
  this.start();
};


/**
 * Release the element from the animation.
 */
_.Element.prototype.drop = function() {
  this.stop();
  this.element = null;
};

});  // goog.scope
