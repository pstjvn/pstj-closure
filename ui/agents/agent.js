goog.provide('pstj.ui.Agent');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('pstj.ds.Cache');

/**
 * @fileoverview Provides an 'agent' abstraction, basically storage / registry
 *   for components that need to store some values and cache them while they
 *   are 'live'.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * @constructor
 * @param {*} type The type to check agains the values of the cache.
 */
pstj.ui.Agent = function(type) {

  /**
   * The list of registered components.
   * @type {Array.<goog.ui.Component>}
   * @private
   */
  this.components_ = [];

  /**
   * @private
   * @type {pstj.ds.Cache}
   */
  this.cache_ = new pstj.ds.Cache();

  /**
   * The type to check the values for.
   * @type {*}
   * @private
   */
  this.type_ = type || null;
};

goog.scope( function() {

  var _ = pstj.ui.Agent.prototype;

  /**
   * Accessor for the cache for subclasses.
   * @return {pstj.ds.Cache}
   */
  _.getCache = function() {
    return this.cache_;
  };

  /**
   * Attaches a component to be notifies on window size changes. If the size
   *   of the component has changed (i.e. is different from the stored cache)
   *   the resize event is fired from within the component.
   *
   * Note that the component should dispatch the resize event on its own when
   *   entering the document as only actual window resizes trigger the checks.
   *   Also it is possible that no cache is added for the component when added
   *   to the document and when window resize occurs the dispatching of the
   *   resize event might be triggered even if the actual size of the
   *   component has not changed. Thus it is advisable to attach the
   *   components on enterDocument, the component is specifically checked for
   *   duplicates, thus entering and leasing the document multiple times will
   *   not affect performance.
   * @param {goog.ui.Component} component The component to add for monitoring.
   */
  _.attach = function(component) {
    if (!goog.array.contains(this.components_, component)) {
      var nullindex = goog.array.indexOf(this.components_, null);
      if (nullindex != -1) {
        this.components_[nullindex] = component;
      } else {
        this.components_.push(component);
      }
      component.addOnDisposeCallback(goog.bind(this.detach, this, component));
      this.updateCache(component);
    }
  };

  /**
   * Checks internally the type of a cache value.
   * @param {*} val The value to check for type.
   */
  _.checkValue = function(val) {
    if (goog.isDefAndNotNull(this.type_)  &&
      goog.asserts.assertFunction(this.type_)) {
      goog.asserts.assertInstanceof(val, this.type_);
    }
  };

  /**
   * Protected method that should update whatever type of cache we have on the
   *   component.
   * @param {goog.ui.Component} component The component that needs cache
   *   update.
   * @protected
   */
  _.updateCache = function(component) {};

  /**
   * Call function for each cached component.
   * @param {function(this: T, S, number, Array.<S>): undefined} fn The function to execute.
   * @param {T=} obj The this object.
   * @template T,S
   */
  _.forEach = function(fn, obj) {
    goog.array.forEach(this.components_, fn, obj);
  };

  /**
   * Removes the binding of the component to this agent.
   * @param {goog.ui.Component} component The component to remove.
   */
  _.detach = function(component) {
    if (goog.array.contains(this.components_, component)) {
      this.cache_.remove(component.getId());
      this.components_[goog.array.indexOf(this.components_, component)] = null;
    }
  };

});
