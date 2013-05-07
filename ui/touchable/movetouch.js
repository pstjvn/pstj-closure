goog.provide('pstj.ui.MoveTouch');

goog.require('pstj.ui.Touchable');
goog.require('pstj.ui.Touchable.EventType');

/**
 * @fileoverview Provides a special class of component that requires long
 *   press activation for its moveable state to be triggered and it can be
 *   checked to see if the component should react to a move event. It could
 *   also potentially prevent the bubbling of the move event to the parent.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Basic touch component that requires to be long pressed before its move
 *   enabled flag is up.
 * @constructor
 * @extends {pstj.ui.Touchable}
 * @param {pstj.ui.Template=} opt_template Optional template.
 */
pstj.ui.MoveTouch = function(opt_template) {
  goog.base(this, opt_template);
  /**
   * @private
   * @type {boolean}
   */
  this.moveEnabled_ = false;
};
goog.inherits(pstj.ui.MoveTouch, pstj.ui.Touchable);

/** @inheritDoc */
pstj.ui.MoveTouch.prototype.isMoveEnabled = function() {
  return this.moveEnabled_;
};

/** @inheritDoc */
pstj.ui.MoveTouch.prototype.addListeners = function() {
  goog.base(this, 'addListeners');
  this.getHandler().listen(this, pstj.ui.Touchable.EventType.LONG_PRESS,
    this.handleLongPress);

  this.getHandler().listen(this, pstj.ui.Touchable.EventType.RELEASE,
    this.handleRelease);
};

/**
 * Handles the long press event for this subclass, enabling the movement.
 * @param {pstj.ui.Touchable.Event} e The long press touchable event.
 * @protected
 */
pstj.ui.MoveTouch.prototype.handleLongPress = function(e) {
  e.stopPropagation();
  this.setMoveEnabled(true);
};

/**
 * Sets the move enabled state.
 * @param {boolean} enable True to enable move events (checked via
 *   isMoveEnabled).
 */
pstj.ui.MoveTouch.prototype.setMoveEnabled = function(enable) {
  this.moveEnabled_ = enable;
};

/**
 * Handles the release event from touchables.
 * @param {pstj.ui.Touchable.Event} e The release touchable event.
 * @protected
 */
pstj.ui.MoveTouch.prototype.handleRelease = function(e) {
  this.setMoveEnabled(false);
};
