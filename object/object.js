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

/**
 * Encodes a JSON object as URL encoded paload for sending over the wire for
 *   PHP implementation as of 158ltd.
 * @param {Object} data The object to encode.
 * @return {string} The encoded object as string.
 */
pstj.object.encode = function(data) {
  var s = [];
  if (goog.isArray(data)) {
    throw Error('Not implemented');
  }
  for (var prefix in data) {
    pstj.object.buildParams_(s, prefix, data[prefix]);
  }
  return s.join('&').replace(/%20/g, '+');
};

/**
 * Builds up the parameters for the JSON URL encoding.
 * @param {!Array.<string>} arr The array to push evenrything in.
 * @param {string} prefix The data prefix (nexted objects are presented as
 *   string prefixes).
 * @param {?} data The data to encode, could be any type.
 * @private
 */
pstj.object.buildParams_ = function(arr, prefix, data) {
  var name = null;
  if (goog.isArray(data)) {
    goog.array.forEach(/** @type {!Array} */(data), function(el, index) {
      if (/\[\]$/.test(prefix)) {
        pstj.object.add_(arr, prefix, el);
      } else {
        pstj.object.buildParams_(arr, prefix + '[' +
          (typeof el == 'object' ? index : '') + ']', el);
      }
    });
  } else if (goog.isObject(data)) {
    for (name in data) {
      pstj.object.buildParams_(arr, prefix + '[' + name + ']', data[name]);
    }
  } else {
    pstj.object.add_(arr, prefix, data);
  }
};

/**
 * Adds the value to the url encoded string.
 * @param {Array.<string>} arr The array collecting the resulting encoded
 *   value pairs.
 * @param {string} key The key to add.
 * @param {?} value The value to add.
 * @private
 */
pstj.object.add_ = function(arr, key, value) {
  value = goog.isFunction(value) ? value() : (
    goog.isNull(value) ? '' : value);
  arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
};
