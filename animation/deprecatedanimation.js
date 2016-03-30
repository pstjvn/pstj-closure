goog.provide('pstj.deprecated.animation.Animation');
goog.provide('pstj.deprecated.animation.Base');
goog.provide('pstj.deprecated.animation.Element');

goog.require('goog.array');
goog.require('goog.async.AnimationDelay');



/**
 * @constructor
 */
pstj.deprecated.animation.Animation = function() {
  /**
   * @type {goog.async.AnimationDelay}
   * @private
   */
  //this.rafBound_ = new goog.async.AnimationDelay(this.onRaf, undefined, this);
  /**
   * @private
   */
  this.handleRafBound_ = goog.bind(this.handleRaf, this);
  /**
   * @type {Array.<*>}
   * @private
   */
  this.animations_ = [];
};
goog.addSingletonGetter(pstj.deprecated.animation.Animation);

goog.scope(function() {
var _ = pstj.deprecated.animation.Animation.prototype;


/**
 * Handle the rafing.
 * @param {number} ts The timestamp.
 * @protected
 */
_.onRaf = function(ts) {
  goog.array.forEach(this.animations_, this.handleRafBound_);
};


/**
 * Handles the raf timeout.
 * @param {*} animation The animation.
 * @protected
 */
_.handleRaf = function(animation) {
  animation.draw();
};

});  // goog.scope



/**
 * Provides the basic class for creating animation.
 * The animation can be then started/stopped. Overrideing the [draw] method is
 * used to implement the nimation itself.
 * @constructor
 */
pstj.deprecated.animation.Base = function() {
  this.runnig_ = false;
  this.onRafBound_ = new goog.async.AnimationDelay(
      this.onRaf_, undefined, this);
};


goog.scope(function() {
var _ = pstj.deprecated.animation.Base.prototype;


/**
 * Starts the animation if not already started.
 */
_.start = function() {
  this.runnig_ = true;
  if (!this.onRafBound_.isActive()) {
    this.onRafBound_.start();
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
_.onRaf_ = function(ts) {
  if (this.runnig_ && this.draw(ts)) {
    this.onRafBound_.start();
  }
};


/**
 * Stops the animation.
 */
_.stop = function() {
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
_.draw = function(ts) {
  return false;
};

});  // goog.scope



/**
 * Provides class that can animate any element. The animation is predefined in
 * the [draw] method.
 * @constructor
 * @extends {pstj.deprecated.animation.Base}
 */
pstj.deprecated.animation.Element = function() {
  goog.base(this);
  /**
   * Reference to the Element to be currently animated.
   * @type {Element}
   * @protected
   */
  this.element = null;
};
goog.inherits(pstj.deprecated.animation.Element, pstj.deprecated.animation.Base);


goog.scope(function() {
var _ = pstj.deprecated.animation.Element.prototype;


/**
 * Grabs an element to be animated.
 * @param {Element} el The HTML element to animate.
 */
_.grab = function(el) {
  this.element = el;
  this.start();
};


/**
 * Release the element from the animation.
 */
_.drop = function() {
  this.stop();
  this.element = null;
};

});  // goog.scope
