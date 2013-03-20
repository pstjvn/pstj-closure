goog.provide('pstj.ui.Sheet');

goog.require('pstj.ui.Async');

/**
 * @fileoverview Provides the base sheet for two different implentations.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * This is a base class designed to be subclassed.
 * @constructor
 * @extends {pstj.ui.Async}
 */
pstj.ui.Sheet = function() {
  goog.base(this);
  /**
   * @private
   * @type {goog.math.Size}
   */
  this.boundingRect_ = null;
};
goog.inherits(pstj.ui.Sheet, pstj.ui.Async);

/**
 * Updates the record for the bounding parent size.
 * @param {goog.math.Size} size The repoter parent size bounding rect.
 */
pstj.ui.Sheet.prototype.updateParentSize = function(size) {
  this.boundingRect_ = size;
  this.update();
};

/**
 * Getter for the parent's bounding box size.
 * @return {goog.math.Size} The recorded bounding box.
 */
pstj.ui.Sheet.prototype.getParentBounds = function() {
  return this.boundingRect_;
};

/** @inheritDoc */
pstj.ui.Sheet.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.boundingRect_ = null;
};
