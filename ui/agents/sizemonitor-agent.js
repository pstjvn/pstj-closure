goog.provide('pstj.ui.SizeMonitorAgent');

goog.require('goog.array');
goog.require('goog.async.Throttle');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');
goog.require('goog.object');
goog.require('goog.style');
goog.require('pstj.ui.Agent');

/**
 * @fileoverview Size monitor agent is used to allow components to receive
 * notifications about the window resize activities without actually
 * inheriting this capability from ancestor and the behaviour could be
 * applied to any component.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Allows component instances to receive size change events from window size
 * monitor without actually implementing the monitoring and related code paths
 * for throthling etc.
 *
 * Note that the component should dispatch the resize event on its own when
 * entering the document as only actual window resizes trigger the checks.
 * Also it is possible that no cache is added for the component when added
 * to the document and when window resize occurs the dispatching of the
 * resize event might be triggered even if the actual size of the
 * component has not changed. Thus it is advisable to attach the
 * components on enterDocument, the component is specifically checked for
 * duplicates, thus entering and leaving the document multiple times will
 * not affect performance.
 *
 * @constructor
 * @extends {pstj.ui.Agent}
 */
pstj.ui.SizeMonitorAgent = function() {
  goog.base(this, goog.math.Size);
  // bind listener for resize monitoring.
  goog.events.listen(goog.dom.ViewportSizeMonitor.getInstanceForWindow(),
    goog.events.EventType.RESIZE, (new goog.async.Throttle(
      this.handleWindowResize_, pstj.ui.SizeMonitorAgent.THROTHLE_INTERVAL,
      this)));
};
goog.inherits(pstj.ui.SizeMonitorAgent, pstj.ui.Agent);
goog.addSingletonGetter(pstj.ui.SizeMonitorAgent);

/**
 * @define {number} Number of milliseconds to wait before allowsing invokation
 * of the real event handler for the resize event in size monigor agent for UI
 * components.
 */
goog.define('pstj.ui.SizeMonitorAgent.THROTHLE_INTERVAL', 500);

/**
 * Handles the resize event from the viewport monitor after throttling.
 *
 * @private
 */
pstj.ui.SizeMonitorAgent.prototype.handleWindowResize_ = function() {
  this.forEach(this.notifyResize_, this);
};

/**
 * Iterative callback for each component currently attached to listen for
 * resize of the window.
 *
 * @param {goog.ui.Component} item The component / item to check.
 * @private
 */
pstj.ui.SizeMonitorAgent.prototype.notifyResize_ = function(item) {
  if (!goog.isNull(item) && item.isInDocument()) {
    var newSize = goog.style.getSize(item);
    if (!goog.math.Size.equals(
      this.checkValue(this.getCache().get(item.getId())) || null, newSize)) {

      this.getCache().set(item.getId(), newSize);
      item.dispatchEvent(goog.events.EventType.RESIZE);

    }
  }
};

/** @inheritDoc */
pstj.ui.SizeMonitorAgent.prototype.updateCache = function(comp) {
  if (comp.isInDocument()) {
    this.getCache().set(comp.getId(), goog.style.getSize(comp.getElement()));
  }
};

/**
 * Returns the cached size of a component. Notice that if the component is
 * not already attached in size monitor it will be. If the component is
 * not in the document we cannot determine the size and a cached version
 * will be returned. If no cached version is available (for example the
 * component was never in the document and was just attached but is not in
 * the document) null will be returned because we cannot determine the
 * size.
 *
 * @param {goog.ui.Component} component The component to check the cached
 * size of.
 * @return {goog.math.Size} The cached size or null if we cannot retrieve
 * it.
 */
pstj.ui.SizeMonitorAgent.prototype.getCachedSize = function(component) {
  this.attach(component);
  return this.checkValue(this.getCache().get(component.getId())) || null;
};
