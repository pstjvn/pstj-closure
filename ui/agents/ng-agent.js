goog.provide('pstj.ui.ngAgent');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.async.nextTick');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.dom.dataset');
goog.require('pstj.ds.ListItem');
goog.require('pstj.ng.filters');
goog.require('pstj.ui.Agent');

/**
 * @fileoverview Allows any class to subscribe for being an 'ng' instance by
 *   only overriding the setModel implementation. Instead of inheriting the
 *   capability from parents we can 'hot plug' it in the components / control
 *   by attaching to the ng agent in the already existing method.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides ng agent global instance that can take care of live data updates.
 *   The componenets that subscribe must call the apply method whenever the
 *   mode updates and should attach on decoration (whenever the DOm is ready).
 * @constructor
 * @extends {pstj.ui.Agent}
 */
pstj.ui.ngAgent = function() {
  // do not enforce type check, because we do not actually know the type.
  goog.base(this, null);

};
goog.inherits(pstj.ui.ngAgent, pstj.ui.Agent);
goog.addSingletonGetter(pstj.ui.ngAgent);

/**
 * @define {boolean} Controls if the ng agent will use the next tick in the
 * engine to perform the updates on the component. By default the updates are
 * performed immediately.
 */
goog.define('pstj.ui.ngAgent.USE_NEXT_TICK', false);

goog.scope(function() {

  var _ = pstj.ui.ngAgent.prototype;

  /**
   * The regular expression used to figure out the filter name and value
   * @type {RegExp}
   * @private
   */
  _.RE_ = /^([^\(]*)\((.*)\)$/;

  /**
   * The default value to use to adds as data when no relevant data is found
   *   on the model.
   * @type {string}
   * @private
   */
  _.nullValue_ = '&nbsp;';

  /** @inheritDoc */
  _.updateCache = function(component) {
    // we can update this cache only if we already have the element.
    if (!goog.isNull(component.getElement())) {
      this.getCache().set(component.getId(), this.getNGElements(component));
    } else {
      if (goog.DEBUG) {
        console.log('Trying to get NG cache on component that has no element');
      }
    }
  };

  /**
   * Applies the current model on the components ng bits.
   * @param {goog.ui.Component} component The component to update.
   */
  _.apply = function(component) {
    if (pstj.ui.ngAgent.USE_NEXT_TICK) {
      goog.async.nextTick(goog.bind(this.apply_, this, component));
    } else {
      this.apply_(component);
    }
  };

  /**
   * Applies the current model on the component after a next tick delay.
   * @param {goog.ui.Component} component The component.
   * @private
   */
  _.apply_ = function(component) {
    if (goog.isDefAndNotNull(component.getModel())) {
      this.attach(component);
      if (!component.isInDocument()) return;
      this.applyModel(component);
      goog.dom.classlist.remove(component.getElement(), goog.getCssName(
        'pstj-ng-cloak'));
    } else {
      this.handleEmptyModel(component);
    }
  };

  /**
   * Applies the model on the template.
   * @protected
   * @param {goog.ui.Component} component The component to operate on.
   */
  _.applyModel = function(component) {
    var model = component.getModel();
    var currentElement = null;
    var modelName;
    var data;
    var elements = this.getCache().get(component.getId());
    if (goog.isNull(elements)) {
      if (goog.DEBUG) {
        console.log('No elements cached for this component');
      }
      return;
    }
    goog.asserts.assertInstanceof(model, pstj.ds.ListItem,
      'Model should be ListItem instance');
    for (var i = 0; i < elements.length; i++) {
      currentElement = elements[i];
      modelName = goog.dom.dataset.get(currentElement, 'model');
      if (goog.isString(modelName)) {
        data = model.getProp(modelName);
        if (goog.isNull(data)) {
          currentElement.innerHTML = this.nullValue_;
        } else {
          this.applyFilteredModel(currentElement, data);
        }
      }
    }
  };

  /**
   * Applies the data on the element inner HTML by first filtering it with the
   * registered filter names.
   * @protected
   * @param {Element} el The element to work with.
   * @param {number|string|boolean} data The data to apply in the html. Note
   * that if the data is not s primitive it will be converted to a string before
   * it is run by the filters.
   */
  _.applyFilteredModel = function(el, data) {
    // first of all, get our filter
    var filter = goog.dom.dataset.get(el, 'filter');
    this.applyOnElement_(el, (goog.isString(filter)) ?
      this.applyFilterOnData_(data, filter) :
      data.toString());
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
   * @param {string} filter The filter to apply on the data.
   * @return {string} The result of the filter as string.
   * @private
   */
  _.applyFilterOnData_ = function(data, filter) {
    var filters = filter.split('|');
    var result = data;

    // For each filter in the filter value apply the filter on the result from
    // the previous filter and return the result afterwards.
    goog.array.forEach(filters, function(item) {
      var fname;
      var fvalue;
      // We expect the filters that accept arguments to be written as
      // filterName(argument1, argument2,...)|filterName2|filter3(whatever)
      // To extract it we use regulr expression, but because regexp is expensive
      // we first try to check for at least the '(' simbol.
      if (item.indexOf('(') != -1) {
        var tmp = this.RE_.exec(item);
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
    }, this);
    return result.toString();
  };

  /**
   * Applies the data on the correct place.
   * @param {Element} el The element to alter.
   * @param {string} filteredData The filteret data to apply.
   * @private
   */
  _.applyOnElement_ = function(el, filteredData) {
    if (el.tagName.toUpperCase() == goog.dom.TagName.IMG) {
      el.src = filteredData;
    } else if (goog.dom.dataset.has(el, 'switch')) {
      goog.dom.classlist.enable(el, goog.getCssName('pstj-switch-off'),
        (filteredData == 'none') ? true : false);
    } else {
      el.innerHTML = filteredData;
    }
  };

  /**
   * Handles cases where there was not avilable data for this template.
   *   Default implementation simply puts the cloack back as class.
   * @protected
   * @param {goog.ui.Component} component The component to handle the empty
   *   model on.
   */
  _.handleEmptyModel = function(component) {
    goog.dom.classlist.add(component.getElement(), goog.getCssName(
      'pstj-ng-cloak'));
  };

  /**
   * Gathers the NG elements in the component.
   * @param {goog.ui.Component} component The component.
   * @return {{length: number}}
   */
  _.getNGElements = function(component) {
    if (!goog.isNull(component.getElement())) {
      return component.getElement().querySelectorAll('[data-model]');
    } else {
      return [];
    }
  };

});
