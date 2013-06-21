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
 *   notifications about the window resize activities without actually
 *   inheriting this capability from ancestor. This should simplify the
 *   inheritance tree.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Allows component instances to receive size change events from window size
 *   monitor.
 * @constructor
 * @extends {pstj.ui.Agent}
 */
pstj.ui.SizeMonitorAgent = function() {
  goog.base(this, goog.math.Size);

  /**
   * @private
   * @type {goog.async.Throttle}
   */
  this.handleWindowResizeThrottle_ = new goog.async.Throttle(
    this.handleWindowResize_, this.handleResizeInterval, this);

  /**
   * Reference to the view port size monitor.
   * @type {goog.dom.ViewportSizeMonitor}
   * @private
   */
  this.sizeMonitorInstance_ =
    goog.dom.ViewportSizeMonitor.getInstanceForWindow();

  // bind listener for resize monitoring.
  goog.events.listen(this.sizeMonitorInstance_, goog.events.EventType.RESIZE,
    this.handleWindowResizeThrottle_);
};
goog.inherits(pstj.ui.SizeMonitorAgent, pstj.ui.Agent);
goog.addSingletonGetter(pstj.ui.SizeMonitorAgent);

goog.scope(function() {

  var _ = pstj.ui.SizeMonitorAgent.prototype;

  /**
   * Throttle for the size checks to perform on resize window events. The
   *   value is considered to be in milliseconds.
   * @type {number}
   * @protected
   */
  _.handleResizeInterval = 500;

  /**
   * Handles the resize event from the viewport monitor after throttling.
   * @private
   */
  _.handleWindowResize_ = function() {
    this.forEach(this.notifyResize_, this);
  };

  /**
   * Iterative callback for each component currently attached to listen for
   *   resize of the window.
   * @param {goog.ui.Component} item The component / item to check.
   * @private
   */
  _.notifyResize_ = function(item) {
    if (!goog.isNull(item) && item.isInDocument()) {
      var newSize = goog.style.getSize(item);
      if (!goog.math.Size.equals(
        this.checkValue(this.getCache().get(item.getId())) || null, newSize)) {

        this.getCache().set(item.getId(), newSize);
        // TODO: async this one with next tick
        item.dispatchEvent(goog.events.EventType.RESIZE);
      }
    }
  };

  /** @inheritDoc */
  _.updateCache = function(comp) {
    if (comp.isInDocument()) {
      this.getCache().set(comp.getId(), goog.style.getSize(comp.getElement()));
    }
  };

  /**
   * Returns the cached size of a component. Notice that if the component is
   *   not already attached in size monitor it will be. If the component is
   *   not in the document we cannot determine the size and a cached version
   *   will be returned. If no cached version is available (for example the
   *   component was never in the document and was just attached but is not in
   *   the document) null will be returned because we cannot determine the
   *   size really.
   * @param {goog.ui.Component} component The component to check the cached
   *   size of.
   * @return {goog.math.Size} The cached size or null if we cannot retrieve
   *   it.
   */
  _.getCachedSize = function(component) {
    this.attach(component);
    return this.checkValue(this.getCache().get(component.getId())) || null;
  };

});
