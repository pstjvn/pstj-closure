goog.provide('pstj.date.utils');

goog.require('goog.array');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.string');

/**
 * @fileoverview Provides utilities for the date / time. The collection of
 *   utilities seem to be not present in a easy to use way in closure library.
 * @author regardingscot@gmail.com (Peter StJ)
 */


/**
 * Provides the full names of the months as array.
 * @type {Array.<string>}
 * @final
 * @private
 * @deprecated Use the i18n package for date symbols from closure library.
 */
pstj.date.utils.months_ = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];


/**
 * Provides the default formatting for the rendered time.
 * @type {!string}
 * @private
 * @final
 * @deprecated Use the closure library compatible renderer and its default
 *   formatting instead.
 */
pstj.date.utils.defaultFormat_ = 'mm/dd/yy';


/**
 * Returns the time rendered as string.
 * @param {!number|Date} time The time to render.
 * @param {string=} opt_format How the result should be formatted.
 * @return {!string} The rendered time.
 * @deprecated The formatting does not match the goog provided one, this would
 *   be dropped in favour of {@link pstj.date.utils.renderTimeSafe}.
 */
pstj.date.utils.renderTime = function(time, opt_format) {
  if (!(time instanceof Date)) {
    time = new Date(time);
  }
  if (!goog.isDef(opt_format)) {
    opt_format = pstj.date.utils.defaultFormat_;
  }
  var result = opt_format.replace('mm', goog.string.padNumber(time.getMonth() +
      1, 2))
      .replace('Month', pstj.date.utils.months_[time.getMonth()])
      .replace('Mon', pstj.date.utils.months_[time.getMonth()].substring(0, 3))
      .replace('dd', goog.string.padNumber(time.getDate(), 2))
      .replace('yyyy', time.getFullYear().toString())
      .replace('yy', time.getFullYear().toString().substr(2))
      .replace('hh', goog.string.padNumber(time.getHours(), 2))
      .replace('xx', goog.string.padNumber(time.getMinutes(), 2));

  return result;
};


/**
 * The default formatting to apply to the save rendering path.
 * @type {!string}
 * @private
 */
pstj.date.utils.defaultGoogFormat_ = 'dd/MM/yyyy';


/**
 * Cache for the formatting functions used by the safe parser. The cache is
 *   not cleared until the application is reloaded.
 * @private
 * @type {!Array.<goog.i18n.DateTimeFormat>}
 */
pstj.date.utils.formattersCache_ = [];


/**
 * Cache for the formatting strings used. The cache is not cleared until the
 *   application is reloaded
 * @private
 * @type {!Array.<string>}
 */
pstj.date.utils.stringCache_ = [];


/**
 * Renders the time to a string. Differs from the {@link renderTime} by the
 *   fact that it uses closure library's formatting conventions.
 * @param {!number|Date} time The time to render.
 * @param {string=} opt_format The formatting string to use.
 * @return {!string} The formatted time.
 */
pstj.date.utils.renderTimeSafe = function(time, opt_format) {
  if (!(time instanceof Date)) {
    time = new Date(time);
  }
  var len = -1;
  if (!goog.isString(opt_format)) opt_format =
        pstj.date.utils.defaultGoogFormat_;

  if (!goog.array.contains(pstj.date.utils.stringCache_, opt_format)) {
    len = pstj.date.utils.stringCache_.length;
    pstj.date.utils.stringCache_.push(opt_format);
    pstj.date.utils.formattersCache_.push(
        new goog.i18n.DateTimeFormat(opt_format));
  }
  if (len == -1) {
    len = goog.array.indexOf(pstj.date.utils.stringCache_, opt_format);
  }
  if (len == -1) throw Error('Internal error occurred.');
  return /** @type {!string} */ (
      pstj.date.utils.formattersCache_[len].format(time));
};


/**
 * Converts duration in seconds to timestamp string (hh:mm:ss).
 * @param {number} duration The duration to convert (assumed to be in
 *   seconds).
 * @return {string} The resulting time stamp string.
 */
pstj.date.utils.getTimestamp = function(duration) {
  var hour = ((duration / 3600) << 0) % 24;
  var minute = ((duration / 60) << 0) % 60;
  var seconds = duration % 60;
  return goog.string.padNumber(hour, 2) + ':' + goog.string.padNumber(minute,
      2) + ':' + goog.string.padNumber(seconds, 2);
};
