/**
 * @fileoverview Provides a widget that consists of a frame and sheet surface
 *   inside of the frame. The frame is bound to react to resize events and
 *   record its size while the sheet inside of it is guaranteed to always be
 *   in-bounds with the parent frame. The sheet is allowed to scale larger and
 *   smalled than the bounding frame but its borders should not exceed the
 *   frame when the size of the sheet is larger than the size of the frame.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.SheetFrame');

goog.require('goog.async.Throttle');
goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('pstj.ui.ISheet');
goog.require('pstj.ui.Templated');



/**
 * Provides a basic sheet frame, intended to host an implementation of the
 *   ISheet interface.
 * @constructor
 * @extends {pstj.ui.Templated}
 * @param {pstj.ui.Template=} opt_template Optional template to use.
 */
pstj.ui.SheetFrame = function(opt_template) {
  goog.base(this, opt_template);
  /**
   * @private
   * @type {goog.async.Throttle}
   */
  this.throttle_ = new goog.async.Throttle(this.handleResize,
      this.resizehandlerThreshold, this);
  this.registerDisposable(this.throttle_);
  /**
   * The size that is currently recorded in memory
   * @type {goog.math.Size}
   */
  this.size = null;
};
goog.inherits(pstj.ui.SheetFrame, pstj.ui.Templated);


/**
 * The threshold to react to browser's resize events.
 * @type {number}
 * @protected
 */
pstj.ui.SheetFrame.prototype.resizehandlerThreshold = 350;


/**
 * Calculates current size based on the parent element's size. This is as if
 *   we want to match the size parameters of the direct parent node as
 *   calculated by the browser engine.
 * @protected
 * @return {goog.math.Size} The calculated size of the component.
 */
pstj.ui.SheetFrame.prototype.getUpdatedSize = function() {
  if (!this.isInDocument()) return this.size;
  var parent = goog.dom.getParentElement(this.getElement());
  if (!goog.dom.isElement(parent)) {
    throw new Error('Cannot find component\'s parent');
  }
  return goog.style.getSize(parent);
};


/**
 * The actual implmenetation that can handle the resizes.
 * @protected
 */
pstj.ui.SheetFrame.prototype.handleResize = function() {
  var newSize = this.getUpdatedSize();
  if (!goog.math.Size.equals(this.size, newSize)) {
    this.size = newSize;
    if (this.hasChildren()) {
      this.forEachChild(this.provisionChild, this);
    }
    this.getElement().style.width = this.size.width + 'px';
    this.getElement().style.height = this.size.height + 'px';
  }
};


/**
 * Let the child know about the parent size change.
 * @param {pstj.ui.ISheet} child The child to set parent size on and update.
 */
pstj.ui.SheetFrame.prototype.provisionChild = function(child) {
  var transpiled = /** @type {pstj.ui.ISheet} */ (child);
  transpiled.updateParentSize(this.size);
};


/** @inheritDoc */
pstj.ui.SheetFrame.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.getElement().style.position = 'relative';
  this.getElement().style.overflow = 'hidden';
};


/** @inheritDoc */
pstj.ui.SheetFrame.prototype.addChild = function(child, render) {
  goog.base(this, 'addChild', child, render);
  var transpiled = /** @type {pstj.ui.ISheet} */ (child);
  transpiled.updateParentSize(this.size);
};


/** @inheritDoc */
pstj.ui.SheetFrame.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.handleResize();
  this.getHandler().listen(goog.dom.ViewportSizeMonitor.getInstanceForWindow(),
      goog.events.EventType.RESIZE, this.handleOriginalResizeEvent_);
};


/** @inheritDoc */
pstj.ui.SheetFrame.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.throttle_ = null;
  this.size = null;
};


/**
 * Handler for the browser's resize event.
 * @private
 * @param {goog.events.Event} e The RESIZE event coming from the browser.
 */
pstj.ui.SheetFrame.prototype.handleOriginalResizeEvent_ = function(e) {
  this.throttle_.fire();
};
