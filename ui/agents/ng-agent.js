/**
 * @fileoverview Allows any class to subscribe for being an 'ng' instance by
 *   only overriding the setModel implementation. Instead of inheriting the
 *   capability from parents we can 'hot plug' it in the components / control
 *   by attaching to the ng agent in the already existing method.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.ngAgent');

goog.require('goog.asserts');
goog.require('goog.async.nextTick');
goog.require('pstj.configure');
goog.require('pstj.ds.PoolCache');
/** @suppress {extraRequire} */
goog.require('pstj.ng.filters');
goog.require('pstj.ui.Agent');
goog.require('pstj.ui.NGPool');



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
  this.poolCache_ = new pstj.ds.PoolCache(pstj.ui.NGPool.getInstance());
};
goog.inherits(pstj.ui.ngAgent, pstj.ui.Agent);
goog.addSingletonGetter(pstj.ui.ngAgent);


/**
 * @type {boolean}
 */
pstj.ui.ngAgent.USE_NEXT_TICK = goog.asserts.assertBoolean(
    pstj.configure.getRuntimeValue('USE_NEXT_TICK', false, 'PSTJ.NGAGENT'));


/** @inheritDoc */
pstj.ui.ngAgent.prototype.getCache = function() {
  return this.poolCache_;
};


/** @inheritDoc */
pstj.ui.ngAgent.prototype.updateCache = function(component) {
  // we can update this cache only if we already have the element.
  if (!goog.isNull(component.getElement())) {
    var cache = pstj.ui.NGPool.getInstance().getObject();
    cache.bindToComponent(component);
    this.getCache().set(component.getId(), cache);
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
pstj.ui.ngAgent.prototype.apply = function(component) {
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
pstj.ui.ngAgent.prototype.apply_ = function(component) {
  this.attach(component);
  if (component.isInDocument()) {
    var cache = /** @type {pstj.ui.NGCache} */(
        this.getCache().get(component.getId()));
    cache.applyModel();
  }
};
