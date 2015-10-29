/**
 * @fileoverview Provides the type definition for a filter function that can be
 * used in conjunction with data binding. The function is used as value
 * decorator when setting the value in the DOM. Note that the original data
 * value is not modified by it.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */
goog.provide('pstj.databinding.ngFilter');


/**
 * Provides the interface to implement / match for filter functions used in
 * binding in lie of the model bindings.
 * @typedef {function(string, ?=): string}
 */
pstj.databinding.ngFilter;

