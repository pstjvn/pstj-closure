goog.provide('pstj.ui.Strings');

/**
 * Generates the static strings for an application.
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
 * Getter for the index string. If such index does not exists an empty string is returned.
 * @param {number} stringIndex The index of the string, usually coming from an enum in your app.
 * @return {string}
 */
pstj.ui.Strings.prototype.get = function(stringIndex)  {
  var result = this.strings_[stringIndex];
  if (!goog.isString(result)) {
    result = '';
  }
  return result;
};
