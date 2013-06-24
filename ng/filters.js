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
   * Parses value into time value.
   * @param {number|string|boolean} data The time to use.
   * @return {number}
   */
  _.makeDateTime_ = function(data) {
    var time;
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
    return time;
  };

  /**
   * Filter a time offset and presents it as absolute time value. The
   *   calculated time is offset by minutes and time zone differences are
   *   removed.
   * @param {number|string|boolean} data The time to use.
   * @param {string} format The formatting to apply. The format is 1:1 with
   *   the goog.date formatting options.
   * @return {string} The result of the offset.
   */
  _.timeoffset = function(data, format) {
    var time = _.makeDateTime_(data);
    // we expect the data in seconds (most server side applications use seconds
    // and not milliseconds like JavaScript so we need to compensate for that.
    // transform seconds to milliseconds.
    time = time * 1000;
    // compensate for time zone.
    time = time + _.zoneOffset_;
    // ready to apply filter
    return dutils.renderTimeSafe(time, format || _.timeOffsetDefaultFormat_);

  };

  /**
   * Formatting for regular date-time objects.
   * @param {number|string|boolean} data The time to use.
   * @param {string} format The formatting to apply. The format is 1:1 with
   *   the goog.date formatting options.
   * @return {string} The result of the offset.
   */
  _.datetime = function(data, format) {
    return dutils.renderTimeSafe(_.makeDateTime_(data),
      format || _.timeOffsetDefaultFormat_);
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
    return !goog.isNull(_.getFilterByName(fname));
  };

  /**
   * Retrieves a filter by its name, if one exists.
   * @param {string} fname The filter name.
   * @return {?function((number|string|boolean),string=): string}
   */
  _.getFilterByName = function(fname) {
    var filter = _.registry_[fname];
    if (!goog.isFunction(filter)) {
      filter = goog.global['ngf' + fname];
      if (!goog.isFunction(filter)) {
        filter = null;
      }
    }
    return filter;
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
        _.getFilterByName(fname));
      return f(data, format);
    }
    throw new Error('There is no filter registered with this name:' + fname);
  };

  /**
   * Makes a price out of a value. Values are always assumed to be in cents
   *   and are calculated based on that assumption.
   * @param {number|string|boolean} data The data to parse as price.
   * @param {string} format The formating information.
   * @return {string} The formatted price.
   */
  _.makePrice = function(data, format) {
    var fixed = +format;
    if (isNaN(fixed)) {
      fixed = 2;
    }
    if (!goog.isNumber(data)) data = +data;
    if (isNaN(data)) data = 0;

    return (data / 100).toFixed(fixed).toString();
  };

  /**
   * Separates the thousands with a comma (standard money practice).
   * @param {number|string|boolean} data The data to parse.
   * @return {string}
   */
  _.money = function(data) {
    return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  /**
   * The registry of the filter function names to match with actual filters.
   * @type {Object}
   * @private
   */
  _.registry_ = {
    'datetime': _.datetime,
    'timeoffset': _.timeoffset,
    'append': _.append,
    'prepend': _.prepend,
    'price': _.makePrice,
    'money': _.money
  };
});
