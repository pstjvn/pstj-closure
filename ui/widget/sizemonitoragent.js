goog.provide('pstj.ui.SizeMonitorAgent');

goog.require('goog.array');
goog.require('goog.async.Throttle');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');
goog.require('goog.object');
goog.require('goog.style');

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
 */
pstj.ui.SizeMonitorAgent = function() {

  /**
   * @private
   * @type {goog.async.Throttle}
   */
  this.handleWindowResizeThrottle_ = new goog.async.Throttle(
    this.handleWindowResize_, this.handleResizeInterval, this);

  /**
   * The list of registered components.
   * @type {Array.<goog.ui.Component>}
   * @private
   */
  this.components_ = [];

  /**
   * @type {Object.<!goog.math.Size>}
   * @private
   */
  this.sizeCache_ = {};

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
    goog.array.forEach(this.components_, this.notifyResize_, this);
  };

  /**
   * Iterative callback for each component currently attached to listen for
   *   resize of the window.
   * @param {goog.ui.Component} item The component / item to check.
   */
  _.notifyResize_ = function(item) {
    if (!goog.isNull(item) && item.isInDocument()) {
      var newSize = goog.style.getSize(item);
      if (!goog.math.Size.equals(
        goog.object.get(this.sizeCache_, item.getId()) || null,
        newSize)) {

        goog.object.set(this.sizeCache_, item.getId(), newSize);
        // TODO: async this one with next tick
        item.dispatchEvent(goog.events.EventType.RESIZE);
      }
    }
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
      if (component.isInDocument()) {
        goog.object.set(this.sizeCache_, component.getId(),
          goog.style.getSize(component.getElement()));
      }
    }
  };

  /**
   * Will remove the component from the list of objects that require
   *   notification on window size updates.
   * @param {goog.ui.Component} component The component to remove.
   */
  _.detach = function(component) {
    if (goog.array.contains(this.components_, component)) {
      goog.object.remove(this.sizeCache_, component.getId());
      this.components_[goog.array.indexOf(this.components_, component)] = null;
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
    return goog.object.get(this.sizeCache_, component.getId()) || null;
  };

});
