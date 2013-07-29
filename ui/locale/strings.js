goog.provide('pstj.ui.Strings');

/**
 * Generates the static strings for an application.
 * @param {function(Object): string} template The template to generate the strings from.
 * @constructor
 */
pstj.ui.Strings = function(template) {
  this.strings_ = template({}).split('|');
};

/**
 * Getter for the index string. If such index does not exists an empty string is returned.
 * @param {number} stringIndex The index of the string, usually coming from an enum in your app.
 */
pstj.ui.Strings.prototype.get = function(stringIndex)  {
  var result = this.strings_[stringIndex];
  if (!goog.isDef(result)) {
    result = '';
  }
  return result;
};
