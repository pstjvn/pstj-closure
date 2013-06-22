goog.provide('pstj.math.utils');

/**
 * @fileoverview Provides simple math functions and utilities.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

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
