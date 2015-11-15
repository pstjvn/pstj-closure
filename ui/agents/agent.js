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
goog.require('goog.log');
goog.require('pstj.debug');
goog.require('pstj.ds.Cache');



/**
 * Basic agent implementation. The class is designed to add behaviour to
 * components without subclassing them and taking into account the lifecycle
 * abstraction in the google component abstraction. The agent allow a component
 * to be attached to an agent and the behaviour will be stuck to the component
 * until it is disposed or explicitly detached.
 *
 * @constructor
 * @struct
 * @param {*} type The type to check agains the values of the cache.
 */
pstj.ui.Agent = function(type) {

  /**
   * The list of registered components to monitor. At any given time the agent
   * should be able to access any of the registered and live components from
   * it.
   *
   * As this is an array as because array grouth makes a lot of GC calls
   * it is a good practice to measure the size of the array. To do so
   * enable the corresponging global flag. It will run periodically and
   * measure the number of registered components. If the component is
   * used as designed the grouth should be significant only
   * in the beginning of the application execution.
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
  this.cache_ = new pstj.ds.Cache('Agent');

  /**
   * The type to check the values in the cache against.
   *
   * @type {*}
   * @private
   */
  this.type_ = type || null;

  if (goog.DEBUG) {
    pstj.debug.bus.subscribe(pstj.debug.Topic, this.dumpCache, this);
  }
};
goog.addSingletonGetter(pstj.ui.Agent);


/**
 * @protected
 * @type {goog.debug.Logger}
 */
pstj.ui.Agent.prototype.logger = goog.log.getLogger('pstj.ui.Agent');


/**
 * Method used for code instrumentation. Should be removed by the compiler in
 * advanced mode.
 *
 * @protected
 */
pstj.ui.Agent.prototype.dumpCache = function() {
  goog.log.info(this.logger, this.components_.length.toString());
};


/**
 * Accessor for the cache for subclasses.
 * @return {pstj.ds.Cache}
 */
pstj.ui.Agent.prototype.getCache = function() {
  return this.cache_;
};


/**
 * Attaches the component to the agent. At the same execution loop the
 * component's cache will be updated automatically.
 *
 * The method explicitly checks if the components is not already in the
 * agent to prevent double registration in the same agent, so it is safe to
 * call this method multiple times.
 *
 * @param {goog.ui.Component} component The component to add to the agent.
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
 * Detaches the component from the agent. Once you no longer need the
 * features of the agent is safe to remove it manually from any
 * agent it is already subscribed to.
 *
 * Note however that this is not nessesary as the attachment of a component
 * automatically registers dispose time handler that will remove it
 * from the agent.
 *
 * @param {goog.ui.Component} component The component to remove.
 */
pstj.ui.Agent.prototype.detach = function(component) {
  if (goog.array.contains(this.components_, component)) {
    this.getCache().remove(component.getId());
    this.components_[goog.array.indexOf(this.components_, component)] = null;
  }
};


/**
 * Internal type check for the cached values. The check is performed only
 * for constructor types and only if the type is set. If DEBUG flag is not
 * raised the method is not used.
 *
 * @param {*} val The value to check for type instance relation.
 */
pstj.ui.Agent.prototype.checkValue = function(val) {
  if (goog.isDefAndNotNull(this.type_) &&
      goog.asserts.assertFunction(this.type_)) {
    goog.asserts.assertInstanceof(val, this.type_);
  }
};


/**
 * Method designed to be overriden: should be used to update the cache object
 * on the given component.
 *
 * @protected
 * @param {goog.ui.Component} component The component to update the cache for.
 */
pstj.ui.Agent.prototype.updateCache = function(component) {};


/**
 * Call function for each cached component. The function is executed on the
 * components in the order they have been added to the agent.
 *
 * @param {function(this: T, S, number, Array.<S>): undefined} fn The function
 *    to execute.
 * @param {T=} opt_obj The this object.
 * @template T,S
 */
pstj.ui.Agent.prototype.forEach = function(fn, opt_obj) {
  goog.array.forEach(this.components_, fn, opt_obj);
};


/**
 * Helper function to retrieve the index of the component in out list.
 *
 * @deprecated Use #insexOf instead.
 * @param {goog.ui.Component} component The component to look up.
 * @return {number} The index or -1.
 */
pstj.ui.Agent.prototype.getComponentIndex = function(component) {
  return this.indexOf(component);
};


/**
 * Convenience method to retrieve the index of the particular component in
 * in the agent cache.
 *
 * @param {goog.ui.Component} component The component to look up.
 * @return {number}
 */
pstj.ui.Agent.prototype.indexOf = function(component) {
  return goog.array.indexOf(this.components_, component);
};


/**
 * Retrieves a component registered in the agent by its index. Note that
 * the component might not be in the agent and in this case null is returned.
 *
 * @param {number} index The index we want to retrieve.
 * @return {?goog.ui.Component}
 */
pstj.ui.Agent.prototype.item = function(index) {
  if (index > -1 && index < this.components_.length) {
    return this.components_[index];
  }
  return null;
};


/**
 * Gets the component by its index.
 *
 * @deprecated Use #item instead.
 * @param {number} index The index of the looked component.
 * @return {?goog.ui.Component} The component or null.
 */
pstj.ui.Agent.prototype.getComponentByIndex = function(index) {
  return this.item(index);
};

