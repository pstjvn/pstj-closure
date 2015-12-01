/**
 * @fileoverview Provides simple math functions and utilities.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.math.utils');

goog.require('goog.array');
goog.require('goog.math.Coordinate');


goog.scope(function() {
var _ = pstj.math.utils;
var Coordinate = goog.math.Coordinate;


/**
 * Generates a random number between two numbers.
 * @param {number} from The fist possible value.
 * @param {number} to The last possible value.
 * @return {number} The generated value.
 */
_.getRandomBetween = function(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
};


/**
 * Calculates the distance between two point in a coordinate system (segment).
 *   Distance is calculated using "Distance Formula".
 * @param {Array.<number>} a The x ([0]) and y ([1]) of the first point.
 * @param {Array.<number>} b The x ([0]) and y ([1]) of the second point.
 * @return {number} The distance as floating point.
 */
_.distanceOfSegment = function(a, b) {
  return Math.sqrt(((a[0] - b[0]) * (a[0] - b[0])) + ((a[1] - b[1]) * (
      a[1] - b[1])));
};


/**
 * Calculates the distance between two points.
 *
 * This variant expects separate x/y values for each point. If you already have
 * the points as array or object use the corresponding methods.
 *
 * @param {number} x1 The X value of the first point.
 * @param {number} y1 The Y value of the first point.
 * @param {number} x2 The X value of the second point.
 * @param {number} y2 The Y value of the second point.
 * @return {number} The distance between the two points.
 */
_.distanceOfSegenmentByXYValues = function(x1, y1, x2, y2) {
  return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
};


/**
 * Calculates the middle of a segment and returns a new point representing it.
 * @param {Array.<number>} a The x ([0]) and y ([1]) of the first point of the
 *   segment.
 * @param {Array.<number>} b The x ([0]) and y ([1]) of the second point of
 *   the segment.
 * @return {Array.<number>} The point that sits in the middle of the segment.
 */
_.middleOfSegment = function(a, b) {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
};


/**
 * Calculates percintile of value of another value.
 * @param {number} value The value to calculate the percentage of.
 * @param {number} of_value The value to calculate the percentage according to.
 * @return {number} The percen of value in of_value.
 */
_.getPercentFromValue = function(value, of_value) {
  return (value / of_value) * 100;
};


/**
 * Calculates result as percent from a given value;
 * @param {number} value The value to calculate percent of.
 * @param {number} percent The percent to calculate.
 * @return {number} The calculated percentile of value.
 */
_.getValueFromPercent = function(value, percent) {
  return (Math.round(value * 10000) / 10000) * (percent / 100);
};


/**
 * Calculates fraction of a value from a bigger value.
 * @param {number} value The value to caclulate the faction for.
 * @param {number} of_value The value to calculate fraction from.
 * @return {number}
 */
_.getFractionFromValue = function(value, of_value) {
  return value / of_value;
};


/**
 * Calculates value from a large value and a fraction.
 * @param {number} value The value to calculate value from based on a fraction.
 * @param {number} fraction The fraction of the large number.
 * @return {number}
 */
_.getValueFromFraction = function(value, fraction) {
  return value * fraction;
};


/**
 * Picks random item(s) from an array.
 * @param {Array.<T>} arr The array to pick from.
 * @return {T} The item picked at random.
 * @template T
 */
_.pick = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};


/**
 * Attempts to find a multiplicator that will transform a floating point number
 * to integer without loosing precision.
 * @param {!number} num The number to find multiplicator for.
 * @return {!number} The calculated multiplicator.
 */
_.shiftToInteger = function(num) {
  if (num == (num | 0)) {
    return 1;
  }
  var str = num.toString().split('.');
  if (str.length == 2) {
    str = str[1];
    return Math.pow(10, str.length);
  } else {
    return 1;
  }
};


/**
 * Calculates the largest multiplicator for series of numbers.
 * @param {...number} var_args The numbers to compute with.
 * @return {!number}
 */
_.calculateCommonMultiplicator = function(var_args) {
  var multiplicator = 1;
  goog.array.forEach(arguments, function(arg) {
    var res = _.shiftToInteger(arg);
    if (res > multiplicator) multiplicator = res;
  });
  return multiplicator;
};


/**
 * Parses a string as a floating point number or if cannot find a
 * number returns the default value.
 * @param {?string} str The string to parse.
 * @param {!number} default_value The value to use as dewfault.
 * @return {!number}
 */
_.parseFloat = function(str, default_value) {
  if (goog.isNull(str)) return default_value;
  var num = parseFloat(str);
  if (isNaN(num)) return default_value;
  return num;
};


/**
 * Finds the largests distance from point to corner of a rectangle. This means
 * that the distance between the point and the corner that is furthest from that
 * point will be returned.
 * @param {!Coordinate} point
 * @param {goog.math.Rect} rect
 * @return {number}
 */
_.distanceToFurthestCorner = function(point, rect) {
  // tl tr bl br
  return Math.max(
      Coordinate.distance(point, new Coordinate(0, 0)),
      Coordinate.distance(point, new Coordinate(rect.width, 0)),
      Coordinate.distance(point, new Coordinate(0, rect.height)),
      Coordinate.distance(point, new Coordinate(rect.width, rect.height)));
};


/**
 * Returns the diagonal length of the rectangle.
 * @param {goog.math.Rect|goog.math.Size} rect
 * @return {number}
 */
_.diagonal = function(rect) {
  return Math.sqrt(rect.width * rect.width + rect.height * rect.height);
};


/**
 * Given a value in the first range calculates the corresponsing value in the
 * second range so that it is in the same relative offset.
 * @param {number} min1
 * @param {number} max1
 * @param {number} min2
 * @param {number} max2
 * @param {number} value
 * @return {number}
 */
_.crossRule = function(min1, max1, min2, max2, value) {
  return ((Math.abs(value) / (max1 - min1)) * (max2 - min2)) + min2;
};


/**
 * Currency related rounding.
 *
 * See
 * https://groups.google.com/forum/#!topic/closure-library-discuss/DpI-eEXBU_0
 *
 * @param {number} num
 * @return {number}
 */
_.roundToTwo = function(num) {
  return +(Math.round(num + 'e+2') + 'e-2');
};

});  // goog.scope
