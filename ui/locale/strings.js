goog.provide('pstj.ui.Strings');

/**
 * @fileoverview Utility class to handle translatable static strings from
 * templates. It is assumed that the strings are static (i.e no variables in
 * them) and that those are separated by the '|' sign. The code should address
 * them by the index of the array of strings resulting from splitting the
 * message from the template using the '|' separator.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Generates list of static strings from a given translatable string, usually
 * received by invoking a template.
 *
 * @param {string} str
 * @constructor
 */
pstj.ui.Strings = function(str) {
  /**
   * @type {!Array.<string>}
   * @private
   */
  this.strings_ = str.split('|');
};

/**
 * Getter for the index string. If such index does not exists an empty string
 * is returned.
 *
 * @param {number} stringIndex The index of the string, usually coming from an
 * enum in your app.
 * @return {string}
 */
pstj.ui.Strings.prototype.get = function(stringIndex)  {
  var result = this.strings_[stringIndex];
  if (!goog.isString(result)) {
    result = '';
  }
  return result;
};
