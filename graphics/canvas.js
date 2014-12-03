/**
 * @fileoverview Provides nice abstraction on creating and maintaining a
 *   canvas with its context.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */
goog.provide('pstj.graphics.Canvas');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.style');



/**
 * Provides abstracted access to canvas element. Expecting an element and
 * renders the canvas with the size of the element. It will emit the resize
 * event. You should call {#fit} method if the parent element size ever
 * changes.
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 * @param {Element} parent The parent element to seed the canvas is.
 */
pstj.graphics.Canvas = function(parent) {
  goog.base(this);
  /**
   * @type {goog.math.Size}
   * @private
   */
  this.size_ = null;
  /**
   * The parent element of the canvas, used only as reference to recalculate the
   * size of the canvas.
   * @type {Element}
   * @private
   */
  this.element_ = parent;
  /**
   * The canvas element reference.
   * @type {HTMLCanvasElement}
   * @private
   */
  this.canvas_ = /** @type {!HTMLCanvasElement} */ (document.createElement(
      'canvas'));
  if (goog.isNull(this.canvas_)) {
    throw new Error('Cannot create canvas element');
  }
  /**
   * The context for drawing.
   * @type {CanvasRenderingContext2D}
   * @private
   */
  this.context_ = /** @type {!CanvasRenderingContext2D} */ (
      this.canvas_.getContext('2d'));

  this.element_.appendChild(this.canvas_);
  this.fit();
};
goog.inherits(pstj.graphics.Canvas, goog.events.EventTarget);


/**
 * Getter for the drawing context.
 * @return {CanvasRenderingContext2D} The drawing context of the canvas
 *   object.
 */
pstj.graphics.Canvas.prototype.getContext = function() {
  return this.context_;
};


/**
 * Getter for the canvas element.
 * @return {HTMLCanvasElement} The canvas element reference.
 */
pstj.graphics.Canvas.prototype.getCanvas = function() {
  return this.canvas_;
};


/**
 * Getter for the last stored size of the element / canvas. It will return
 * cached values (ones set the list time the fit method was called or the
 * values determined at instantiation time).
 * @return {goog.math.Size} The size (width / height).
 */
pstj.graphics.Canvas.prototype.getSize = function() {
  return this.size_;
};


/**
 * Forces the canvas to fit inside the container. This method should be called
 * when the parent element has been resized.
 */
pstj.graphics.Canvas.prototype.fit = function() {
  this.size_ = goog.style.getSize(this.element_);
  this.canvas_.width = this.size_.width;
  this.canvas_.height = this.size_.height;
  this.dispatchEvent(goog.events.EventType.RESIZE);
};


/** @inheritDoc */
pstj.graphics.Canvas.prototype.disposeInternal = function() {
  goog.dom.removeNode(this.canvas_);
  this.element_ = null;
  this.context_ = null;
  this.canvas_ = null;
  this.size_ = null;
  goog.base(this, 'disposeInternal');
};
