/**
 * @fileoverview Provides object utilities for objects, that are not included
 * in closure library (AFAK).
 *
 * For now it only provides deepEquals.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.object');

goog.require('goog.array');
goog.require('goog.object');


/**
 * Check object equity. This is a helper function and should be considered
 * private.
 *
 * @param {Object} a The actual object.
 * @param {Object} b The expected object.
 *
 * @private
 *
 * @return {!boolean} True if the objects are equal, false otherwise.
 */
pstj.object.objEquiv_ = function(a, b) {
  if (!goog.isDefAndNotNull(a) || !goog.isDefAndNotNull(b)) {
    return false;
  }
  if (a.prototype !== b.prototype)
    return false;

  try {
    var ka = goog.object.getKeys(a);
    var kb = goog.object.getKeys(a);
    var key, i;
  } catch (e) {
    return false;
  }
  if (ka.length != kb.length) return false;
  ka.sort();
  kb.sort();

  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) return false;
  }
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!pstj.object.deepEquals(a[key], b[key]))
      return false;
  }
  return true;
};


/**
 * Performs deep object equality comparison. It will take two objects and
 * compare the properties recursively until all object's properties have been
 * checked or until a property does not match.
 *
 * @param  {*} actual The object to compare as first.
 * @param  {*} expected The object to compare as second.
 * @param {Function=} comparer How to compare array.
 *
 * @return {!boolean} True if the objects are equal, false otherwise.
 */
pstj.object.deepEquals = function(actual, expected, comparer) {
  // If it is the same object do not compare further
  if (actual === expected) {
    return true;
  } else if (actual instanceof Date && expected instanceof Date) {
      // Compare Date objects, they are the same if the date time matches.
      return actual.getTime() === expected.getTime();
  } else if (goog.isArray(actual) && goog.isArray(expected)) {
    // If both objects are arrays compare them using the closure library comparer or the one provided with the
    // call if any.
    return goog.array.equals(/** @type {Array} */(actual),
      /** @type {Array} */ (expected), comparer);
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    // If the parameters are both not instances of the Object object, make a value comparison.
    return actual == expected;
  } else {
    // They are both objects, if comparer is provided run them with it, else use our deep object comparison helper.
    if (comparer) {
      return comparer(actual, expected);
    } else {
      if (goog.isObject(actual) && goog.isObject(expected))
        return pstj.object.objEquiv_(actual, expected);
      else return false;
    }
  }
};
