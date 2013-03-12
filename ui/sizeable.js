/**
 * @fileoverview Provides base class for components that can detect size
 * changes and call its sizeChange method.
 *
 * @author  regardingscot@gmail.com (Peter StJ)
 */
goog.provide('pstj.ui.Sizeable');
goog.provide('pstj.ui.Sizeable.EventType');

goog.require('goog.async.Throttle');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events.EventHandler');
goog.require('goog.ui.Component');

/**
 * Class designed to be inherited by components that need to react to window
 * size changes in such a way as to update the information for their own size.
 * Those are mostly components that use percentage to tell the browser drawing
 * engine how big they should be.
 *
 * It caches the width and height of the component, so the handlers can be
 * invoked only when the actual size of the component has changed. The new
 * size is calculated by a function that the developer is expected to
 * override.
 *
 * The size calculation is throttled to avoid frequent style access.
 *
 * Usage of this code is discourages as it suffers many limitations:
 * - if you have two widgets that are nested and monitor size change and you
 * will get the following scenario: parent enters the document first, it will
 * receive the resize signal first and will start its timer, the child will
 * receive the signal second (because it enters the document after the parent -
 * see goog.ui.Component) and till also trigger its delayed resize. The parent
 * will recalculate its size first and will adjust, it will dispatch its
 * internal resize event and complete, next the child will execute its size
 * recalculation and dispatch its resize event. It the parent is listening to
 * child resize event it might trigger the resize loop anew which will lead to
 * a new parent style access (slow down) which can potentially create a loop
 * condition.
 *
 * Possible solution: the component should have flag that should be set to
 * true only when a resize is detected on the window level and trigger
 * recalculation only if the flag is true and set it back to false right away.
 * This however poses the problem of children resizes being triggered before the
 * parent one. In this case if the child size actually depends on the parent
 * size (i.e. on window resize we change the size of the parent and we expect
 * the child to only register its new size) the child recorded size will be its
 * old size, then the parent style will be altered but the children will never
 * notice it because the custom resize event only bubbles from the parent
 * upwards.
 *
 * NOTE: the above issues should not really be a problem in practice as the
 * class is designed to work with elements that use percentage as its width
 * via CSS with / height and because the resize event handlers are delayed the
 * new style should be applied when the function is run. However if you want to
 * set size manually on resize make sure to test your code for the described
 * problems.
 *
 * @constructor
 *
 * @extends {goog.ui.Component}
 *
 * @param {goog.dom.DomHelper=} dh Optional dom helper.
 */
pstj.ui.Sizeable = function(dh) {
  goog.base(this, dh);

  this.windowResizeThrottled_ = new goog.async.Throttle(
    this.handleWindowResize, this.sizeUpdateInterval, this);
};
goog.inherits(pstj.ui.Sizeable, goog.ui.Component);


/**
 * Holds the throttled handleWindowResize method.
 *
 * @type {goog.async.Throttle}
 *
 * @private
 */
pstj.ui.Sizeable.prototype.windowResizeThrottled_;


/**
 * Cache for the current component size.
 *
 * @type {goog.math.Size}
 *
 * @private
 */
pstj.ui.Sizeable.prototype.currentSize_ = null;


/**
 * Throttle interval, this is how often the resize even will be allowed to
 * trigger the handler. Specified in milliseconds.
 *
 * @type {number}
 *
 * @protected
 */
pstj.ui.Sizeable.prototype.sizeUpdateInterval = 500;


/**
 * Getter for the currently recorded width.
 *
 * @return {number} Current width.
 */
pstj.ui.Sizeable.prototype.getWidth = function() {
  return this.currentSize_.width;
};


/**
 * Getter for the currently recorded height.
 *
 * @return {number} Current height.
 */
pstj.ui.Sizeable.prototype.getHeight = function() {
  return this.currentSize_.height;
};


/**
 * Getter for the size of the component. Note that the reported size will be
 * the one that was lastly calculated and not the actual size of the component
 * as drawn by the browser. This is mostly valid for components that use
 * percentage to set their size.
 *
 * @return {goog.math.Size} The size as lastly recorded.
 */
pstj.ui.Sizeable.prototype.getRecordedSize = function() {
  return this.currentSize_;
};

/** @inheritDoc */
pstj.ui.Sizeable.prototype.disposeInternal = function() {
  goog.dispose(this.windowResizeThrottled_);
  this.currentSize_ = null;
  this.windowResizeThrottled_ = null;
  goog.base(this, 'disposeInternal');
};

/**
 * Handler for the window resize event. This handler is throttled to once per
 * 500ms to avoid unneeded style calculations (avoid triggering paint).
 *
 * @protected
 */
pstj.ui.Sizeable.prototype.handleWindowResize = function() {
  var newSize = goog.style.getSize(this.getElement());
  if (!goog.math.Size.equals(newSize, this.currentSize_)) {
    this.currentSize_ = newSize;
    this.dispatchEvent(pstj.ui.Sizeable.EventType.RESIZE);
  }
};


/** @inheritDoc */
pstj.ui.Sizeable.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.sizeMonitorInstance_,
    goog.events.EventType.RESIZE, this.handleWindowResizeThrottled_);
  // call the handler directly, don't wait as this is right after the DOM
  // was attached to the document tree.
  this.handleWindowResize();
};


/** @inheritDoc */
pstj.ui.Sizeable.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
    // Stop all resize handlers pending.
  this.windowResizeThrottled_.stop();
};

/**
 * Handles all window resize events coming from the view port monitor and
 * calls the throttled handler. It will fire the actual handler based on the
 * specified interval. It will also start the delayed handler if it was
 * stopped.
 *
 * @private
 */
pstj.ui.Sizeable.prototype.handleWindowResizeThrottled_ = function() {
  this.windowResizeThrottled_.fire();
};


/**
 * Reference to the view port size monitor.
 *
 * @type {goog.dom.ViewportSizeMonitor}
 *
 * @final
 *
 * @private
 */
pstj.ui.Sizeable.prototype.sizeMonitorInstance_ =
  goog.dom.ViewportSizeMonitor.getInstanceForWindow();


/**
 * Custom resize event for the components.
 * @enum {string}
 */
pstj.ui.Sizeable.EventType = {
  RESIZE: goog.events.getUniqueId(goog.DEBUG ? 'resize' : 'a')
};
