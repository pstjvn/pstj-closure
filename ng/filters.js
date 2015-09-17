/**
 * @fileoverview Provides default filters for the NG like filtering in the html.
 * Simulates filtering of the data and works with strings and numbers.
 */

goog.provide('pstj.ng.filters');
goog.require('pstj.date.utils');


/**
 * @typedef {number|string|boolean|Object|Array}
 * @private
 */
pstj.ng.filters.data_;


/**
 * The time zone offset of the client in milliseconds (used to calculate
 * the time offset filter).
 * @type {number}
 * @private
 */
pstj.ng.filters.zoneOffset_ = (function() {
  return (new Date()).getTimezoneOffset() * 60 * 1000;
})();


/**
 * Provides a default time offset format. Should almost never be used, but
 * still possible.
 * @type {string}
 * @private
 */
pstj.ng.filters.timeOffsetDefaultFormat_ = 'hh:mm';


/**
 * Parses value into time value.
 * @param {pstj.ng.filters.data_} data The time to use.
 * @private
 * @return {number}
 */
pstj.ng.filters.makeDateTime_ = function(data) {
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
 * @param {pstj.ng.filters.data_} data The time to use.
 * @param {string} format The formatting to apply. The format is 1:1 with
 *   the goog.date formatting options.
 * @return {string} The result of the offset.
 */
pstj.ng.filters.timeoffset = function(data, format) {
  var time = pstj.ng.filters.makeDateTime_(data);
  // we expect the data in seconds (most server side applications use seconds
  // and not milliseconds like JavaScript so we need to compensate for that.
  // transform seconds to milliseconds.
  time = time * 1000;
  // compensate for time zone.
  time = time + pstj.ng.filters.zoneOffset_;
  // ready to apply filter
  return pstj.date.utils.renderTimeSafe(time,
      format || pstj.ng.filters.timeOffsetDefaultFormat_);

};


/**
 * Formatting for regular date-time objects.
 * @param {pstj.ng.filters.data_} data The time to use.
 * @param {string} format The formatting to apply. The format is 1:1 with
 *   the goog.date formatting options.
 * @return {string} The result of the offset.
 */
pstj.ng.filters.datetime = function(data, format) {
  return pstj.date.utils.renderTimeSafe(pstj.ng.filters.makeDateTime_(data),
      format || pstj.ng.filters.timeOffsetDefaultFormat_);
};


/**
 * Puts the firmatting in fron if the data directly and returns the result.
 * @param {pstj.ng.filters.data_} data The data value to work with.
 * @param {string} format The string to append to the data.
 * @return {string} The composite value of the two.
 */
pstj.ng.filters.prepend = function(data, format) {
  return format + data.toString();
};


/**
 * Appends the formatting to the data directly and returns the result.
 * @param {pstj.ng.filters.data_} data The data value to work with.
 * @param {string} format The string to append to the data.
 * @return {string} The composite value of the two.
 */
pstj.ng.filters.append = function(data, format) {
  return data.toString() + format;
};


/**
 * Checks if a filter exists based on the names assigned to the filter
 * functions.
 * @param {string} fname The filter name to look up.
 * @return {boolean} Will be true if such filter exists.
 */
pstj.ng.filters.hasFilter = function(fname) {
  return !goog.isNull(pstj.ng.filters.getFilterByName(fname));
};


/**
 * Retrieves a filter by its name, if one exists.
 * @param {string} fname The filter name.
 * @return {?function((number|string|boolean),string=): string}
 */
pstj.ng.filters.getFilterByName = function(fname) {
  var filter = pstj.ng.filters.registry_[fname];
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
 * @param {pstj.ng.filters.data_} data The data to work on.
 * @param {string=} opt_format The formatting data if any to pass to the
 * formatting function.
 * @return {string} The result of the filter.
 */
pstj.ng.filters.apply = function(fname, data, opt_format) {
  if (pstj.ng.filters.hasFilter(fname)) {
    var f = (
        /** @type {function(pstj.ng.filters.data_ ,string=): string} */ (
            pstj.ng.filters.getFilterByName(fname)));
    return f(data, opt_format);
  }
  throw new Error('There is no filter registered with this name:' + fname);
};


/**
 * Makes a price out of a value. Values are always assumed to be in cents
 *   and are calculated based on that assumption.
 * @param {pstj.ng.filters.data_} data The data to parse as price.
 * @param {string} format The formating information.
 * @return {string} The formatted price.
 */
pstj.ng.filters.makePrice = function(data, format) {
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
 * @param {pstj.ng.filters.data_} data The data to parse.
 * @return {string}
 */
pstj.ng.filters.money = function(data) {
  return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


/**
 * The registry of the filter function names to match with actual filters.
 * @type {Object}
 * @private
 */
pstj.ng.filters.registry_ = {
  'datetime': pstj.ng.filters.datetime,
  'timeoffset': pstj.ng.filters.timeoffset,
  'append': pstj.ng.filters.append,
  'prepend': pstj.ng.filters.prepend,
  'price': pstj.ng.filters.makePrice,
  'money': pstj.ng.filters.money
};

