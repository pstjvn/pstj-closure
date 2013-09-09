goog.provide('pstj.configure');

/**
 * @fileoverview Provides utility to obtain values from global configuration
 *   provided on run time on top of default values.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */


/**
 * Memorization utility for common prefixes. Allows for speeding up the
 *   lookups on runtime.
 * @type {Object}
 * @private
 */
pstj.configure.pathCache_ = {};


/**
 * @typedef {number|string|boolean}
 */
pstj.configure.Value;


/**
 * Figure out if a pre-defined value is over-ridden from a global
 *   configuration option. If prefix is provided, the prefix is looked up
 *   instead.
 *
 * @param {string} value The property to look up.
 * @param {pstj.configure.Value} default_value Default value to use if none is
 *   globally provided.
 * @param {string=} opt_prefix Optional prefix to look up into.
 * @return {pstj.configure.Value} The value to be used, globally defined or
 *   default one.
 */
pstj.configure.getRuntimeValue = function(value, default_value, opt_prefix) {
  var current = goog.global;
  var paths;
  if (goog.isString(opt_prefix)) {
    if (goog.isDef(pstj.configure.pathCache_[opt_prefix])) {
      if (pstj.configure.pathCache_[opt_prefix] === false) {
        return default_value;
      } else {
        current = pstj.configure.pathCache_[opt_prefix];
      }
    } else {
      paths = opt_prefix.split('.');
      for (var i = 0; i < paths.length; i++) {
        current = current[paths[i]];
        if (!goog.isDefAndNotNull(current)) {
          pstj.configure.pathCache_[opt_prefix] = false;
          return default_value;
        }
      }
      pstj.configure.pathCache_[opt_prefix] = current;
    }
  }
  if (goog.isDefAndNotNull(current[value])) {
    return (current[value]);
  } else {
    return default_value;
  }
};


/**
 * Utility function that creates a bound prefix look up helper. Allows the use
 *   of pre-bound lookups in run time to be faster and less verbose.
 * @param {string} prefix The prefix to use for the lookup for all values.
 * @return {function(string, pstj.configure.Value): pstj.configure.Value} The
 *   bound function, the signature will match the one if the #getRuntimeValue
 *   method.
 */
pstj.configure.createPrefixedLookUp = function(prefix) {
  return function(value, default_value) {
    return pstj.configure.getRuntimeValue(value, default_value, prefix);
  };
};
