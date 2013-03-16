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
