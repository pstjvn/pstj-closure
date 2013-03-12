goog.provide('pstj.graphics.Draw');

goog.require('goog.Disposable');

/**
 * @fileoverview Provides abstracted method to draw on the same context.
 * Encompasses the basic forms used when drawing on canvas.
 * TODO: add the rest of the simple shapes (circle, oval and other).
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Abstract the drawing of primitives bound to a context.
 * @constructor
 * @extends {goog.Disposable}
 * @param {CanvasRenderingContext2D} context The context to use for all
 *   drawing operations.
 */
pstj.graphics.Draw = function(context) {
  goog.base(this);
  this.context_ = context;
};
goog.inherits(pstj.graphics.Draw, goog.Disposable);

/**
 * Reference to the drawing context in which to execute the drawing
 *   operations.
 * @type {CanvasRenderingContext2D}
 * @private
 */
pstj.graphics.Draw.prototype.context_;

/**
 * @type {string}
 * @private
 */
pstj.graphics.Draw.prototype.font_ = 'normal 10px Arial';

/**
 * @type {string}
 * @private
 */
pstj.graphics.Draw.prototype.textColor_ = '#ffffff';

/**
 * @type {string}
 * @private
 */
pstj.graphics.Draw.prototype.borderColor_ = '#ffffff';

/**
 * Sets the default font to be used when drawing text.
 * @param {string} font The font directive.
 */
pstj.graphics.Draw.prototype.setFont = function(font) {
  this.font_ = font;
};

/**
 * Sets the default text color to be used when drawing text.
 * @param {string} color The hex color definition.
 */
pstj.graphics.Draw.prototype.setTextColor = function(color) {
  this.textColor_ = color;
};

/**
 * Sets the default border color to use when drawing rectangles with border.
 * @param {string} color The hex color definition.
 */
pstj.graphics.Draw.prototype.setBorderColor = function(color) {
  this.borderColor_ = color;
};

/**
 * Adds text on the canvas.
 * @param {string} content The text to visualize.
 * @param {!number} x The X coordinate start of the text (top).
 * @param {!number} y The Y coordinate start of the text (left).
 * @param {string=} color Optional color to use for the text.
 */
pstj.graphics.Draw.prototype.text = function(content, x, y, color) {
  this.context_.fillStyle = color || this.textColor_;
  this.context_.font = this.font_;
  this.context_.fillText(content, x, y);
};

/**
 * Adds a line on the canvas.
 * @param {!number} x1 The X coordinate for start of the line.
 * @param {!number} y1 The Y coordinate for start of the line.
 * @param {!number} x2 The X coordinate for end of the line.
 * @param {!number} y2 The Y coordinate for end of the line.
 * @param {string=} color The color to use to draw the line.
 */
pstj.graphics.Draw.prototype.line = function(x1, y1, x2, y2, color) {
  this.context_.strokeStyle = color || this.textColor_;
  this.context_.lineWidth = 1;
  this.context_.beginPath();
  this.context_.moveTo(x1, y1);
  this.context_.lineTo(x2, y2);
  this.context_.stroke();
};

/**
 * Draws a rectangle on the canvas, optionally using a border line around
 *   it.
 * @param {!number} x The X coordinate for start of shape (left).
 * @param {!number} y The Y coordinate for start of shape (top).
 * @param {!number} w The width of the shape.
 * @param {!number} h The height of the shape.
 * @param {string} color The color value to use for the shape filling.
 * @param {boolean=} use_stroke If true a border around the shape will be
 *   drawn with the default border color.
 */
pstj.graphics.Draw.prototype.rect = function(x, y, w, h, color, use_stroke) {
  if (use_stroke) {
    this.context_.strokeStyle = this.borderColor_;
    this.context_.lineWidth = 1;
    this.context_.strokeRect(x, y, w, h);
  }
  this.context_.fillStyle = color;
  this.context_.fillRect(x, y, w, h);
};

/** @inheritDoc */
pstj.graphics.Draw.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.context_ = null;
};
