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
 */
pstj.ui.MoveTouch = function() {
  goog.base(this);
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
    function(e) {
      e.stopPropagation();
      this.moveEnabled_ = true;
    });

  this.getHandler().listen(this, pstj.ui.Touchable.EventType.RELEASE,
    function(e) {
      this.moveEnabled_ = false;
    });
};
