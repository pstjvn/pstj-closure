goog.provide('pstj.ui.NGCache');
goog.provide('pstj.ui.NGPool');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.dom.dataset');
goog.require('goog.structs.Pool');
goog.require('pstj.ds.ListItem');
goog.require('pstj.ng.filters');



/**
 * @constructor
 * @extends {goog.structs.Pool}
 */
pstj.ui.NGPool = function() {
  goog.base(this, 0, 5000);
};
goog.inherits(pstj.ui.NGPool, goog.structs.Pool);
goog.addSingletonGetter(pstj.ui.NGPool);


/**
 * @override
 * @return {pstj.ui.NGCache}
 */
pstj.ui.NGPool.prototype.createObject = function() {
  return new pstj.ui.NGCache();
};



/**
 * Per component NG cache to speed up the data application on components. The
 * implementation is designed to be used in object pools.
 * @constructor
 */
pstj.ui.NGCache = function() {
  /**
   * @type {Array.<Element>}
   * @private
   */
  this.elements_ = null;
  /**
   * @type {Array.<?string>}
   * @private
   */
  this.models_ = [];
  /**
   * @type {Array.<pstj.ui.NGCache.Type>}
   * @private
   */
  this.applytypes_ = [];
  /**
   * @type {Array.<?string>}
   * @private
   */
  this.filters_ = [];
  /**
   * Flag if the whole component is cloaked
   * @type {boolean}
   */
  this.cloaked = false;
  /**
   * Referrence to the component bound in this cache.
   * @type {goog.ui.Component}
   * @private
   */
  this.component_ = null;
};


/**
 * @final
 * @type {string}
 * @protected
 */
pstj.ui.NGCache.CSS_CLOAK_CLASS = goog.getCssName('pstj-ng-cloak');


/**
 * The query selecctor to use to find the ng elements in the componen dom tree.
 * @final
 * @type {string}
 */
pstj.ui.NGCache.QUERY_EXPRESSION = '[data-model]';


/**
 * @enum {string}
 */
pstj.ui.NGCache.Verbs = {
  MODEL: 'model',
  FILTER: 'filter'
};


/**
 * @enum {number}
 */
pstj.ui.NGCache.Type = {
  IMAGE: 1,
  SWITCH: 2,
  HTML: 3,
  TEXT: 4
};


/**
 * The default filling value for empty ng elements.
 * @final
 * @type {string}
 */
pstj.ui.NGCache.NullValue = '&nbsp;';


/**
 * Clears the cache.
 */
pstj.ui.NGCache.prototype.clear = function() {
  this.component_ = null;
  goog.array.clear(this.models_);
  goog.array.clear(this.applytypes_);
  goog.array.clear(this.filters_);
};


/**
 * The regular expression used to figure out the filter name and value
 * @type {RegExp}
 * @private
 */
pstj.ui.NGCache.RE_ = /^([^\(]*)\((.*)\)$/;


/**
 * Binds the cache object to a new component instance.
 * @param {goog.ui.Component} component The component to bind to.
 */
pstj.ui.NGCache.prototype.bindToComponent = function(component) {
  this.clear();
  this.component_ = component;
  this.cloaked = (goog.dom.classlist.contains(component.getElement(),
      pstj.ui.NGCache.CSS_CLOAK_CLASS));
  if (goog.dom.isElement(component.getElement())) {
    this.elements_ = /** @type {Array.<Element>} */(Array.prototype.slice.apply(
        component.getElement().querySelectorAll(
            pstj.ui.NGCache.QUERY_EXPRESSION)));
    if (this.elements_.length > 0) {
      for (var i = 0, len = this.elements_.length; i < len; i++) {
        this.models_[i] = goog.dom.dataset.get(this.elements_[i],
            pstj.ui.NGCache.Verbs.MODEL);
        this.filters_[i] = goog.dom.dataset.get(this.elements_[i],
            pstj.ui.NGCache.Verbs.FILTER);
        this.applytypes_[i] = this.determineApplyType(this.elements_[i]);
      }
    }
  } else {
    if (goog.DEBUG) {
      console.log('The component does not have a DOM element bound');
    }
    throw new Error('The component does not have DOM element');
  }
};


/**
 * Determines the application type to be used for the element's model set.
 * @param {Element} el The element to determine application type for.
 * @return {pstj.ui.NGCache.Type}
 * @protected
 */
pstj.ui.NGCache.prototype.determineApplyType = function(el) {
  if (el.tagName.toUpperCase() == goog.dom.TagName.IMG) {
    return pstj.ui.NGCache.Type.IMAGE;
  }
  if (goog.dom.dataset.has(el, 'switch')) {
    return pstj.ui.NGCache.Type.SWITCH;
  }
  if (goog.dom.dataset.has(el, 'usehtml')) {
    return pstj.ui.NGCache.Type.HTML;
  }
  return pstj.ui.NGCache.Type.TEXT;
};


/**
 * Applies the component model on the component's NG cache.
 */
pstj.ui.NGCache.prototype.applyModel = function() {
  var model = this.component_.getModel();
  if (goog.isDefAndNotNull(model)) {
    goog.asserts.assertInstanceof(model, pstj.ds.ListItem,
        'The model of NG bound components must be ListItem instance');
    var len = this.elements_.length;
    if (len == 0) return;
    for (var i = 0; i < len; i++) {
      if (goog.isString(this.models_[i])) {
        var data = model.getProp(/** @type {string} */(this.models_[i]));
        if (goog.isNull(data)) {
          this.applyNullValue(this.elements_[i]);
        } else {
          if (goog.isString(this.filters_[i])) {
            data = this.applyFiltersOnData(data, /** @type {string} */(
                this.filters_[i]));
          } else {
            data = data.toString();
          }
          this.applyValue(this.elements_[i], data, i);
        }
      }
    }
    if (this.cloaked) {
      this.cloaked = false;
      goog.dom.classlist.remove(this.component_.getElement(),
          pstj.ui.NGCache.CSS_CLOAK_CLASS);
    }
  } else {
    if (!this.cloaked) {
      this.cloaked = true;
      goog.dom.classlist.add(this.component_.getElement(),
          pstj.ui.NGCache.CSS_CLOAK_CLASS);
    }
  }
};


/**
 * Applies the null value for child element.
 * @param {Element} el The element to set the 'novalue' value to.
 * @protected
 */
pstj.ui.NGCache.prototype.applyNullValue = function(el) {
  el.innerHTML = pstj.ui.NGCache.NullValue;
};


/**
 * Applies the (filtered) data value on the element.
 * @param {Element} el The element to process.
 * @param {string} value The new value to apply.
 * @param {number} index The index of the element, used to find out the apply
 * type.
 * @protected
 */
pstj.ui.NGCache.prototype.applyValue = function(el, value, index) {
  switch (this.applytypes_[index]) {
    case pstj.ui.NGCache.Type.IMAGE:
      el.src = value;
      break;
    case pstj.ui.NGCache.Type.SWITCH:
      goog.dom.classlist.enable(el, goog.getCssName('pstj-switch-off'),
          (value == 'none') ? true : false);
      break;
    case pstj.ui.NGCache.Type.HTML:
      el.innerHTML = value;
      break;
    case pstj.ui.NGCache.Type.TEXT:
      el.textContent = value;
      break;
  }
};


/**
 * Applies the filtering information on the data and resurns the filtered
 * result as string.
 *
 * The filters are applied in the order they are written on and the result is
 * piped to the next filter and so on until all filter are executed. The
 * result is then returned as string.
 *
 * Example:
 * data-filter="timeoffset(hh:mm)|append( passed since midnight)"
 * and data provided as
 * data = 3600;
 * will result in
 * 1:00 passed since midnight
 *
 * @param {number|string|boolean} data The data record to use.
 * @param {string} filter The filter configuration as written in the html.
 * @return {!string}
 * @protected
 */
pstj.ui.NGCache.prototype.applyFiltersOnData = function(data, filter) {
  var filters = filter.split('|');
  var result = data;

  goog.array.forEach(filters, function(item) {
    var fname;
    var fvalue;
    // We expect the filters that accept arguments to be written as
    // filterName(argument1, argument2,...)|filterName2|filter3(whatever)
    // To extract it we use regular expression, but because regexp is expensive
    // we first try to check for at least the '(' symbol.
    if (item.indexOf('(') != -1) {
      var tmp = pstj.ui.NGCache.RE_.exec(item);
      // at this stage [tmp] will be either null (when there is no additional
      // data to the filter) or an array or matches (1 - filter name, 2 filter
      // configuration).
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
