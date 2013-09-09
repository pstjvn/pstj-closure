/**
 * @fileoverview Provides an 'agent' abstraction, basically storage / registry
 *   for components that need to store some values and cache them while they
 *   are 'live'.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.Agent');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('pstj.ds.Cache');



/**
 * Basic agent implementation. The class is designed to add behaviour to
 * components without subclassing them and taking into account the lifecycle
 * abstraction in the google component abstraction. The agent allow a component
 * to be attached to an agent and the behaviour will be stuck to the component
 * until it is disposed or explicitly detached.
 *
 * @constructor
 * @param {*} type The type to check agains the values of the cache.
 */
pstj.ui.Agent = function(type) {

  /**
   * The list of registered components to monitor. At any given time the agent
   * should be able to access any of the registered and live components from it.
   *
   * @type {Array.<goog.ui.Component>}
   * @private
   */
  this.components_ = [];

  /**
   * Cache utility for the value to store associcated to any given component
   * that is attached to the agent.
   *
   * @private
   * @type {pstj.ds.Cache}
   */
  this.cache_ = new pstj.ds.Cache();

  /**
   * The type to check the values in the cache against.
   *
   * @type {*}
   * @private
   */
  this.type_ = type || null;
};


/**
 * Accessor for the cache for subclasses.
 * @return {pstj.ds.Cache}
 */
pstj.ui.Agent.prototype.getCache = function() {
  return this.cache_;
};


/**
 * Attaches a component to the agent. The cache will be set at this point. The
 * method explicitly checks if the component has already been registered with
 * the agent instance and if yes the step is skipped. This allows a component
 * to be attached more than once safely. The attach method also looks up any
 * empty spots in the component registry list and tries to fill them up in
 * order to consume less memory and create less garbage.
 *
 * @param {goog.ui.Component} component The component to add for monitoring.
 */
pstj.ui.Agent.prototype.attach = function(component) {
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
 * Checks internally the type of a cache value. The checks is performed only for
 * construct types and only if the type is set. If DEBUG is disbaled this
 * method is not used.
 *
 * @param {*} val The value to check for type.
 */
pstj.ui.Agent.prototype.checkValue = function(val) {
  if (goog.isDefAndNotNull(this.type_) &&
      goog.asserts.assertFunction(this.type_)) {
    goog.asserts.assertInstanceof(val, this.type_);
  }
};


/**
 * Protected method that should update whatever type of cache we have on the
 * component.
 *
 * @param {goog.ui.Component} component The component that needs cache update.
 * @protected
 */
pstj.ui.Agent.prototype.updateCache = function(component) {};


/**
 * Call function for each cached component.
 *
 * @param {function(this: T, S, number, Array.<S>): undefined} fn The function
 * to execute.
 * @param {T=} opt_obj The this object.
 * @template T,S
 */
pstj.ui.Agent.prototype.forEach = function(fn, opt_obj) {
  goog.array.forEach(this.components_, fn, opt_obj);
};


/**
 * Removes the binding of the component to this agent.
 *
 * @param {goog.ui.Component} component The component to remove.
 */
pstj.ui.Agent.prototype.detach = function(component) {
  if (goog.array.contains(this.components_, component)) {
    this.cache_.remove(component.getId());
    this.components_[goog.array.indexOf(this.components_, component)] = null;
  }
};
