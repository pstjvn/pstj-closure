goog.provide('pstj.ng.filters');
goog.require('pstj.date.utils');

/**
 * @fileoverview Provides default filters for the NG like filtering in the html.
 * Simulates filtering of the data and works with strings and numbers.
 */

goog.scope(function() {
  var _ = pstj.ng.filters;
  var dutils = pstj.date.utils;

  /**
   * The time zone offset of the client in milliseconds (used to calculate
   * the time offset filter).
   * @type {number}
   * @private
   */
  _.zoneOffset_ = (function() {
    return (new Date()).getTimezoneOffset() * 60 * 1000;
  })();


  /**
   * Provides a default time offset format. Should almost never be used, but
   * still possible.
   * @type {string}
   * @private
   */
  _.timeOffsetDefaultFormat_ = 'hh:mm';

  /**
   * Filter a time offset and presents it as a time. The calculated time is
   * offset by minutes and time zone differences are removed.
   * @param {number|string|boolean} data The time to use.
   * @param {string} format The formatting to apply. The format is 1:1 with the
   * goog.date formatting options.
   * @return {string} The result of the offset.
   */
  _.timeoffset = function(data, format) {
    var time;
    // we expect the data in seconds (most server side applications use seconds
    // and not milliseconds like JavaScript so we need to compensate for that.
    if (!goog.isNumber(data)) {
      time = +data;
      if (isNaN(time)) {
        // it is possible that the time is provided as date tie string,
        // attempt to extract
        var tmp = new Date(data);
        if (tmp.toString() == 'Invalid Date') {
          // it is not a number and it cannot be passed as number, return error
          throw new Error('Cannot parse the data as time');
        }
        time = tmp.getTime();
      }
    } else {
      time = data;
    }
    // transform seconds to milliseconds.
    time = time * 1000;
    // compensate for time zone.
    time = time + _.zoneOffset_;
    // ready to apply filter
    return dutils.renderTimeSafe(time, format || _.timeOffsetDefaultFormat_);

  };

  /**
   * Puts the firmatting in fron if the data directly and returns the result.
   * @param {number|string|boolean} data The data value to work with.
   * @param {string} format The string to append to the data.
   * @return {string} The composite value of the two.
   */
  _.prepend = function(data, format) {
    return format + data.toString();
  };

  /**
   * Appends the formatting to the data directly and returns the result.
   * @param {number|string|boolean} data The data value to work with.
   * @param {string} format The string to append to the data.
   * @return {string} The composite value of the two.
   */
  _.append = function(data, format) {
    return data.toString() + format;
  };

  /**
   * Checks if a filter exists based on the names assigned to the filter
   * functions.
   * @param {string} fname The filter name to look up.
   * @return {boolean} Will be true if such filter exists.
   */
  _.hasFilter = function(fname) {
    return !!(_.registry_[fname]);
  };

  /**
   * Apply an existing filter on the data provided, using optional formatting.
   * @param {string} fname The filter name to use.
   * @param {number|string|boolean} data The data to work on.
   * @param {string=} format The formatting data if any to pass to the
   * formatting function.
   * @return {string} The result of the filter.
   */
  _.apply = function(fname, data, format) {
    if (_.hasFilter(fname)) {
      var f = /** @type {function((number|string|boolean),string=): string} */ (
        _.registry_[fname]);
      return f(data, format);
    }
    throw new Error('There is no filter registered with this name:' + fname);
  };

  /**
   * The registry of the filter function names to match with actual filters.
   * @type {Object}
   * @private
   */
  _.registry_ = {
    'timeoffset': _.timeoffset,
    'append': _.append,
    'prepend': _.prepend
  };
});
