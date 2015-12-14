/**
 * @fileoverview Provides a more abstracted way to deal with data biding
 * on the client (compared to previous versions in this library).
 *
 * The main focus here is to allow to use bindings in any contexts (i.e.
 * plain HTML, components and controls).
 *
 * The code is largely based on existing implementations and in future will
 * be reused in the places previous implemetations provide their own in order
 * to become the de-facto only implementation (for aesier support and testing).
 *
 * The code provides one way data binding similar to what angular does but
 * very limited and performance oriented. Piping / filtering is also supportted.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('pstj.ds.ngmodel');

goog.require('goog.array');
goog.require('goog.dom.TagName');
goog.require('goog.dom.dataset');
goog.require('goog.functions');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.structs.Pool');
goog.require('goog.style');
goog.require('pstj.ng.filters');


goog.scope(function() {
var ngmodel = pstj.ds.ngmodel;


/**
 * @define {number} Defins the maximum number of NG cache instances to be
 * used in the application. Attempts touse more cache instances (i.e. more
 * bound elements/roots) will result in error. When defining the limit take into
 * account the fact that using large number might result in slower response
 * times and overwhole application lags.
 */
goog.define('pstj.ds.ngmodel.MAX_CACHE_SIZE', 200);


/**
 * Logger instance - helps debugging the template resolutions.
 * @type {goog.log.Logger}
 * @private
 */
ngmodel.logger_ = goog.log.getLogger('pstj.ds.ngmodel');


/**
 * Provides cache mecanizm for elements and their ng attributes
 * in order to query them only once per element and cache the result.
 *
 * This class is considered strictly internal and should not be accessed
 * anywhere else.
 *
 * @private
 */
ngmodel.Cache_ = goog.defineClass(null, {
  constructor: function() {
    /**
     * List the nodes that we need to potentially update on model update.
     * @type {!Array<!Node>}
     * @private
     */
    this.nodes_ = [];
    /**
     * The length of items to consider. We need this in order to not clear the
     * other cache lists (only null them out) and thus remain as static as
     * possible.
     * @type {!number}
     * @private
     */
    this.length_ = 0;
    /**
     * List of symbol names to match from the live model.
     * @type {!Array<!string>}
     * @private
     */
    this.modelNames_ = [];
    /**
     * List of lists of filter functions to apply to the resolved value of the
     * model look-up by symbol. Filter functions should be stateless.
     * @type {!Array<!function(string): string>}
     * @private
     */
    this.filters_ = [];
    /**
     * Cache for the application model type: i.e. how do we apply the resolved
     * data to the actual HTML.
     * @type {!Array<ngmodel.CACHE_TYPE>}
     * @private
     */
    this.applyTypes_ = [];
    /**
     * Cache for previously / last applied value.
     * Note that the use of this should become optional as it might increase
     * dramatically the memory footprint of your application in case you have
     * a large number of bindings.
     *
     * In future version caching the values will become inactive by default and
     * will be activated behind a compile time flag.
     * @type {!Array<string|number|boolean|undefined|null>}
     * @private
     */
    this.values_ = [];
  },

  /**
   * Updates the view the cache is currently refering to.
   * @param {Object|Array|null} model
   * @private
   */
  update_: function(model) {
    for (var i = 0; i < this.length_; i++) {
      var barevalue = ngmodel.getNestedProperty_(model, this.modelNames_[i]);
      var rawvalue = barevalue.toString();
      if (!goog.isNull(this.filters_[i])) {
        rawvalue = this.filters_[i](rawvalue);
      }
      if (this.values_[i] != rawvalue) {
        this.values_[i] = rawvalue;
        switch (this.applyTypes_[i]) {
          case ngmodel.CACHE_TYPE.IMAGE:
            this.nodes_[i].src = rawvalue;
            break;
          case ngmodel.CACHE_TYPE.SHOW:
            goog.style.setElementShown(goog.asserts.assertElement(
                this.nodes_[i]), !!barevalue);
            break;
          case ngmodel.CACHE_TYPE.HTML:
            this.nodes_[i].innerHTML = rawvalue.toString();
            break;
          case ngmodel.CACHE_TYPE.TEXT:
            goog.dom.setTextContent(this.nodes_[i], rawvalue.toString());
            break;
          case ngmodel.CACHE_TYPE.FILL:
            (/** @type {!Element} */(this.nodes_[i]))
                .setAttribute('fill', rawvalue.toString());
            break;
          case ngmodel.CACHE_TYPE.STOP_COLOR:
            (/** @type {!Element} */(this.nodes_[i]))
                .setAttribute('stop-color', rawvalue.toString());
            break;
          case ngmodel.CACHE_TYPE.HIDE:
            goog.style.setElementShown(goog.asserts.assertElement(
                this.nodes_[i]), !barevalue);
            break;
          default:
            goog.log.error(ngmodel.logger_, 'Attempting to use unknown ' +
                'application type: ' + this.applyTypes_[i]);
        }
      }
    }
  }
});


/**
 * Provides pool of cache objects. This allows for object reuse and
 * assures that we do not go over a pre-defined limit of instances as to
 * assure low impact on application level.
 *
 * The class is considered internal for this implementation and should not be
 * accessed anywhere else.
 *
 * @private
 */
ngmodel.Pool_ = goog.defineClass(goog.structs.Pool, {
  constructor: function() {
    goog.structs.Pool.call(this, 1, pstj.ds.ngmodel.MAX_CACHE_SIZE);
  },

  /**
   * @override
   * @return {!ngmodel.Cache_}
   */
  createObject: function() {
    return new ngmodel.Cache_();
  },

  /** @override */
  objectCanBeReused: goog.functions.TRUE,

  /** @override */
  disposeObject: function(obj) {
    goog.array.clear(obj.modelNames_);
    goog.array.clear(obj.filters_);
    goog.array.clear(obj.values_);
    goog.array.clear(obj.applyTypes_);
    obj.nodes_ = null;
  },

  /** @override */
  releaseObject: function(obj) {
    for (var i = 0; i < obj.length_; i++) {
      obj.modelNames_[i] = '';
      obj.filters_[i] = [];
      obj.values_[i] = '';
    }
    obj.nodes_ = null;
    obj.length_ = 0;
    return goog.base(this, 'releaseObject', obj);
  },

  /** @inheritDoc */
  getObject: function() {
    var o = goog.base(this, 'getObject');
    o.nodes_ = [];
    return o;
  }
});


/**
 * Instance to use as pool for ng-cache objects.
 * @type {!ngmodel.Pool_}
 * @private
 */
ngmodel.pool_ = new ngmodel.Pool_();


/**
 * Enumerates the ways we know how to apply data on the DOM.
 * @enum {number}
 */
ngmodel.CACHE_TYPE = {
  IMAGE: 0,
  SHOW: 1,
  TEXT: 2,
  HTML: 3,
  FILL: 4,
  STOP_COLOR: 5,
  HIDE: 6
};


/**
 * Cache of elemen IDs to cache instances.
 * @type {Object<string, ngmodel.Cache_>}
 * @private
 */
ngmodel.cache_ = {};


/**
 * Un-bind the element from UI bindings.
 *
 * @param {!Node} node
 */
ngmodel.unbindElement = function(node) {
  var id = goog.getUid(node).toString();
  if (goog.object.containsKey(ngmodel.cache_, id)) {
    ngmodel.pool_.releaseObject(goog.object.get(ngmodel.cache_, id));
    goog.object.set(ngmodel.cache_, id, null);
  } else {
    goog.log.warning(ngmodel.logger_, 'Element was never bound, but attempted' +
        ' to unbind it');
  }
};


/**
 * Binds the element in the NG implementation.
 *
 * Note that this means that the developer still needs to call
 * '#updateElement' with the model when the model is being updated.
 *
 * @param {!Node} node The root node to bind.
 * @return {string}
 */
ngmodel.bindElement = function(node) {
  var id = goog.getUid(node).toString();
  if (goog.object.containsKey(ngmodel.cache_, id)) {
    goog.log.error(ngmodel.logger_, 'Element already bound in NG!');
    return id;
  }
  var cache = ngmodel.pool_.getObject();
  goog.object.set(ngmodel.cache_, id, cache);
  var nodes = node.querySelectorAll(
      '[data-ng-model],[data-ng-show],[data-ng-hide]');
  var items = -1;
  goog.array.forEach(nodes, function(el, index) {
    var modelValue = goog.dom.dataset.get(el, goog.string.toCamelCase(
        'ng-model'));
    if (!goog.isDefAndNotNull(modelValue)) {
      modelValue = goog.dom.dataset.get(el, goog.string.toCamelCase(
          'ng-show'));
    }
    if (!goog.isDefAndNotNull(modelValue)) {
      modelValue = goog.dom.dataset.get(el, goog.string.toCamelCase(
          'ng-hide'));
    }
    // If the property has a value only then process further.
    if (goog.isString(modelValue)) {
      // Split the model name from the firlters (if any).
      var p = goog.string.splitLimit(modelValue, '|', 1);
      // Trim the name as it must be matched exactly.
      var modelName = goog.string.trim(p[0]);
      // Only add it to the cache if the model name is not empty.
      if (!goog.string.isEmpty(modelName)) {
        items++;
        cache.nodes_[items] = el;
        cache.modelNames_[items] = modelName;
        if (p[1] && p[1].length > 0) {
          var filters = goog.array.map(p[1].split('|'), goog.string.trim);
          // The filter functions if any.
          var filterfns = [];
          // Attempt tofind all filtering functions
          goog.array.forEach(filters, function(filter) {
            var fname = '';
            var fparams = '';
            if (goog.string.contains(filter, '(')) {
              var tmp = ngmodel.RE_.exec(filter);
              if (goog.isNull(tmp)) {
                fname = filter;
              } else {
                fname = tmp[1];
                fparams = tmp[2];
              }
            } else {
              fname = filter;
            }
            // If we actually have such filter registered...
            if (pstj.ng.filters.hasFilter(fname)) {
              filterfns.push(function(value) {
                return pstj.ng.filters.apply(fname, value, fparams);
              });
            } else {
              goog.log.warning(ngmodel.logger_, 'Cannot resolve ng-filter: ' +
                  fname);
            }
          });
          if (!goog.array.isEmpty(filterfns)) {
            cache.filters_[items] = ngmodel.composeFilter_(filterfns);
          } else {
            cache.filters_[items] = null;
          }
        } else {
          cache.filters_[items] = null;
        }
        cache.length_ = items + 1;
        cache.applyTypes_[items] = ngmodel.resolveCacheType_(el);
        cache.values_[items] = ngmodel.resolveInitialValue_(
            el, cache.applyTypes_[items]);
      }
    }
  });
  return id;
};


/**
 * Resolvs the initial value of the bound element / node so we can update
 * only when needed.
 *
 * @param {Node} el
 * @param {ngmodel.CACHE_TYPE} applyType
 * @return {string}
 * @private
 */
ngmodel.resolveInitialValue_ = function(el, applyType) {
  switch (applyType) {
    case ngmodel.CACHE_TYPE.IMAGE:
      return goog.asserts.assertInstanceof(el, HTMLImageElement).src;
    case ngmodel.CACHE_TYPE.SHOW:
      return 'true';
    case ngmodel.CACHE_TYPE.HIDE:
      return 'false';
    case ngmodel.CACHE_TYPE.TEXT:
      return goog.dom.getTextContent(el);
    case ngmodel.CACHE_TYPE.HTML:
      return goog.asserts.assertElement(el).innerHTML;
    case ngmodel.CACHE_TYPE.FILL:
      return goog.asserts.assertElement(el).getAttribute('fill');
    case ngmodel.CACHE_TYPE.STOP_COLOR:
      return goog.asserts.assertElement(el).getAttribute('color-stop');
    default:
      goog.log.warning(ngmodel.logger_, 'Cannot determine initial value.');
      return '';
  }
};


/**
 * Resolves how to apply the data on the DOM by determining application type.
 *
 * @param {Node} el
 * @return {ngmodel.CACHE_TYPE}
 * @private
 */
ngmodel.resolveCacheType_ = function(el) {
  // Show/hide the whole element.
  if (goog.dom.dataset.has(goog.asserts.assertElement(el),
      goog.string.toCamelCase('ng-show'))) {
    return ngmodel.CACHE_TYPE.SHOW;
  } else if (goog.dom.dataset.has(goog.asserts.assertElement(el),
      goog.string.toCamelCase('ng-hide'))) {
    return ngmodel.CACHE_TYPE.HIDE;
  } else {
    // If its marked to be an HTML container always use that
    if (goog.dom.dataset.has(goog.asserts.assertElement(el),
        goog.string.toCamelCase('ng-html'))) {
      return ngmodel.CACHE_TYPE.HTML;
    } else {
      // Try to determine behavior from element type / tag.
      var tagname = el.tagName.toUpperCase();
      // TODO: use prop instead!
      if (tagname == 'STOP') {
        return ngmodel.CACHE_TYPE.STOP_COLOR;
      } else if (tagname == goog.dom.TagName.IMG) {
        return ngmodel.CACHE_TYPE.IMAGE;
      } else if (goog.dom.dataset.has(goog.asserts.assertElement(el),
          goog.string.toCamelCase('ng-prop'))) {
        // If we do not know the specific tag name see if we want to use
        // a specific property
        var prop = goog.dom.dataset.get(goog.asserts.assertElement(el),
            goog.string.toCamelCase('ng-prop'));
        if (prop == 'fill') return ngmodel.CACHE_TYPE.FILL;
      }
    }
  }
  // If everuting else fails set the model as text content of the node.
  return ngmodel.CACHE_TYPE.TEXT;
};


/**
 * Compose a single filter function from multiple ng-filters.
 *
 * @param {!Array<!function(string): string>} fns
 * @return {!function(string): string}
 * @private
 */
ngmodel.composeFilter_ = function(fns) {
  return function(value) {
    for (var i = 0; i < fns.length; i++) {
      value = fns[i](value);
    }
    return value;
  };
};


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
 * Updates the element based on a model. It can be the same model or
 * a different one.
 * @param {Node} el
 * @param {Object|Array|null} model
 */
ngmodel.updateElement = function(el, model) {
  if (goog.hasUid(goog.asserts.assertObject(el)) &&
      goog.object.containsKey(ngmodel.cache_, goog.getUid(
          goog.asserts.assertObject(el)).toString())) {
    ngmodel.applyFromCache_(goog.object.get(
        ngmodel.cache_, goog.getUid(el).toString()), model);
  } else {
    goog.log.error(ngmodel.logger_, 'Attempt to ng-update element that is not' +
        ' bound.');
  }
};


/**
 * Applies the model on the cache instance.
 * @param {ngmodel.Cache_} cache
 * @param {Object|Array|null} model
 * @private
 */
ngmodel.applyFromCache_ = function(cache, model) {
  cache.update_(model);
};


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
  var value = ngmodel.getNestedProperty_(model, parts[0]);
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
 * @param {!number|!string|!boolean|!Object|!Array} data
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
    item = goog.string.trim(item);
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
 * @param {string} modelName
 * @return {string|number|boolean|Object|Array|null}
 */
ngmodel.getNestedProperty_ = function(model, modelName) {
  if (!goog.isDefAndNotNull(model)) return null;
  var props = goog.string.trim(modelName).split('.');
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
