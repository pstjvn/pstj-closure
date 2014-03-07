/**
 * @fileoverview Provides simple math functions and utilities.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.math.utils');


/**
 * Generates a random number between two numbers.
 * @param {number} from The fist possible value.
 * @param {number} to The last possible value.
 * @return {number} The generated value.
 */
pstj.math.utils.getRandomBetween = function(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
};


/**
 * Calculates the distance between two point in a coordinate system (segment).
 *   Distance is calculated using "Distance Formula".
 * @param {Array.<number>} a The x ([0]) and y ([1]) of the first point.
 * @param {Array.<number>} b The x ([0]) and y ([1]) of the second point.
 * @return {number} The distance as floating point.
 */
pstj.math.utils.distanceOfSegment = function(a, b) {
  return Math.sqrt(((a[0] - b[0]) * (a[0] - b[0])) + ((a[1] - b[1]) * (
      a[1] - b[1])));
};


/**
 * Calculates the middle of a segment and returns a new point representing it.
 * @param {Array.<number>} a The x ([0]) and y ([1]) of the first point of the
 *   segment.
 * @param {Array.<number>} b The x ([0]) and y ([1]) of the second point of
 *   the segment.
 * @return {Array.<number>} The point that sits in the middle of the segment.
 */
pstj.math.utils.middleOfSegment = function(a, b) {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
};


/**
 * Calculates percintile of value of another value.
 * @param {number} value The value to calculate the percentage of.
 * @param {number} of_value The value to calculate the percentage according to.
 * @return {number} The percen of value in of_value.
 */
pstj.math.utils.getPercentFromValue = function(value, of_value) {
  return (value / of_value) * 100;
};


/**
 * Calculates result as percent from a given value;
 * @param {number} value The value to calculate percent of.
 * @param {number} percent The percent to calculate.
 * @return {number} The calculated percentile of value.
 */
pstj.math.utils.getValueFromPercent = function(value, percent) {
  return (value * percent) / 100;
};


/**
 * Picks random item(s) from an array.
 * @param {Array.<T>} arr The array to pick from.
 * @return {T} The item picked at random.
 * @template T
 */
pstj.math.utils.pick = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};


goog.scope(function() {
var _ = pstj.math.utils;



/**
 * Provides means to generate linear number sequence with regular increments.
 * @constructor
 * @param {number} max The maximum number in the range to generate.
 * @param {number=} opt_min The minimum number in the range to generate.
 * @param {number=} opt_step The step to use to move from value to value.
 */
_.LinearNumberGenerator = function(max, opt_min, opt_step) {
  /**
   * The maximum number in the generator.
   * @type {number}
   * @protected
   */
  this.max = max;
  /**
   * The minimum number in the generator.
   * @type {number}
   * @protected
   */
  this.min = goog.isNumber(opt_min) ? opt_min : 0;
  /**
   * The step to use in the generator.
   * @type {number}
   * @protected
   */
  this.step = goog.isNumber(opt_step) ? opt_step : 1;
  /**
   * The current value in the generator
   * @type {number}
   */
  this.value = 0;
  this.reset();
};


/**
 * Getter for the next number in the generator sequence.
 * @return {number}
 */
_.LinearNumberGenerator.prototype.next = function() {
  this.value += this.step;
  if (this.value > this.max) this.value = this.min;
};


/**
 * Reset the sequence of generation, starting from the minimum value.
 */
_.LinearNumberGenerator.prototype.reset = function() {
  this.value = this.min;
};



/**
 * Provides means to generate number ranges in sequence.
 * @constructor
 * @extends {_.LinearNumberGenerator}
 * @param {number} max The maximum number in the range to generate.
 * @param {number=} opt_min The minimum number in the range to generate.
 * @param {number=} opt_step The step to use to move from value to value.
 */
_.CyclicNumberGenerator = function(max, opt_min, opt_step) {
  /**
   * Flag if we are currently goin up generation or down. By default
   * we start with an 'up' generation.
   * @type {boolean}
   * @private
   */
  this.increment_ = true;
  goog.base(this, max, opt_min, opt_step);
};
goog.inherits(_.CyclicNumberGenerator, _.LinearNumberGenerator);


/** @inheritDoc */
_.CyclicNumberGenerator.prototype.next = function() {
  if (this.increment_) {
    if (this.value >= this.max) {
      this.increment_ = false;
    }
  } else {
    if (this.value <= this.min) {
      this.increment_ = true;
    }
  }

  if (this.increment_) this.value += this.step;
  else this.value -= this.step;

  return this.value;
};


/**
 * Resets the generator so it would start from the beginning of the
 * number generation process, the middle of the sequence for the
 * rotation.
 * @override
 */
_.CyclicNumberGenerator.prototype.reset = function() {
  this.increment_ = true;
  this.value = (this.min + this.max) / 2;
};

});  // goog.scope
