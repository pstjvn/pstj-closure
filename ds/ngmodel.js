goog.provide('pstj.ds.ngmodel');

goog.require('goog.array');
goog.require('goog.dom.TagName');
goog.require('goog.dom.dataset');
goog.require('goog.string');
goog.require('pstj.ng.filters');


goog.scope(function() {
var ngmodel = pstj.ds.ngmodel;


/**
 * The regular expression used to figure out the filter name and value
 * @type {RegExp}
 * @private
 */
ngmodel.RE_ = /^([^\(]*)\((.*)\)$/;


/**
 * The default value to use to adds as data when no relevant data is found on
 * the model.
 * @type {string}
 * @private
 */
ngmodel.NULL_VALUE_ = '&nbsp;';


/**
 * Applies the model on predefined node list.
 * @param {!NodeList} nodelist
 * @param {Object|Array|null} model
 */
ngmodel.apply = function(nodelist, model) {
  var currentElement = null;
  var modelName = '';
  var data = null;
  var nll = nodelist.length;
  if (goog.isDefAndNotNull(model)) {
    for (var i = 0; i < nll; i++) {
      currentElement = /** @type {Element} */(nodelist[i]);
      modelName = goog.dom.dataset.get(currentElement, goog.string.toCamelCase(
          'ng-model'));
      if (goog.isString(modelName)) {
        data = ngmodel.resolveValue_(model, modelName);
        if (goog.isDefAndNotNull(data)) {
          ngmodel.applyFilteredModel_(currentElement, data);
        } else {
          currentElement.innerHTML = ngmodel.NULL_VALUE_;
        }
      }
    }
  }
};


/**
 * Applies the data on the selected element.
 * @param {Element} element
 * @param {string} value
 * @private
 */
ngmodel.applyFilteredModel_ = function(element, value) {
  switch (element.tagName.toUpperCase()) {
    case goog.dom.TagName.IMG:
      element.src = value;
      break;
    default:
      element.innerHTML = value;
  }
};


/**
 * Resolves the value from the data object.
 *
 * @private
 * @param {Object|Array|null} model
 * @param {string} modelName
 * @return {?string}
 */
ngmodel.resolveValue_ = function(model, modelName) {
  // first make out the model itself.
  var parts = goog.string.splitLimit(modelName, '|', 1);
  var value = ngmodel.getNestedProperty_(model, parts[0].split('.'));
  if (goog.isNull(value)) return null;
  if (parts[1]) {
    value = ngmodel.applyFilterOnData_(value, parts[1]);
  }
  return value.toString();
};


/**
 * Given a value applies any existing filters on it.
 *
 * @private
 * @param {number|string|boolean|Object|Array} data
 * @param {string} filterstr
 * @return {string}
 */
ngmodel.applyFilterOnData_ = function(data, filterstr) {
  var filters = filterstr.split('|');
  var result = data;
  // TODO: make this work with multiple arguments.
  // For each filter in the filter value apply the filter on the result from
  // the previous filter and return the result afterwards.
  goog.array.forEach(filters, function(item) {
    var fname = '';
    var fvalue = '';
    // We expect the filters that accept arguments to be written as
    // filterName(argument1, argument2,...)|filterName2|filter3(whatever)
    // To extract it we use regulr expression, but because regexp is expensive
    // we first try to check for at least the '(' simbol.
    if (item.indexOf('(') != -1) {
      var tmp = ngmodel.RE_.exec(item);
      // at this stage tmp will be wither null (when there is no additional
      // data to the filter or an array or matches (1 - filter name, 2 filter
      // config).
      if (goog.isNull(tmp)) {
        // filter name === item (the whole thing is the filter name).
        fname = item;
      } else {
        fname = tmp[1];
        fvalue = tmp[2];
      }
    } else {
      fname = item;
    }
    // if there is a named filter with this name, call it with the values
    // else just return the data.
    if (pstj.ng.filters.hasFilter(fname)) {
      result = pstj.ng.filters.apply(fname, result, fvalue);
    }
  });
  return result.toString();
};


/**
 * Attempts to extract the value of static property.
 *
 * @private
 * @param {Object|Array|null} model
 * @param {!Array<!string>} props
 * @return {string|number|boolean|Object|Array|null}
 */
ngmodel.getNestedProperty_ = function(model, props) {
  if (!goog.isDefAndNotNull(model)) return null;
  var result = model;
  var len = props.length - 1;
  for (var i = 0; i <= len; i++) {
    if (goog.isDefAndNotNull(result[props[i]])) {
      result = result[props[i]];
    } else {
      result = null;
      break;
    }
  }
  return result;
};
});  // goog.scope
