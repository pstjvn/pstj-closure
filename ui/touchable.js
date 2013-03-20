goog.provide('pstj.ui.Touchable');

goog.require('goog.events');
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.math.Coordinate');
goog.require('goog.ui.Component.EventType');
goog.require('pstj.ui.Async');

/**
 * @fileoverview Provides a base component for touch / mouse enabled devices.
 *   Attempts to abstract the differences. The class should evolve to use the
 *   pointer events but as at the time of writing the protocol is not actually
 *   supported in anything else than ie10 we have to fall back to touches +
 *   mouse.
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * @constructor
 * @extends {pstj.ui.Async}
 */
pstj.ui.Touchable = function() {
  goog.base(this);
  /**
   * @private
   * @type {goog.events.MouseWheelHandler}
   */
  this.mousewheelhandler_ = null;
  this.pressed_ = false;
  this.moved_ = false;
  this.ignoremove_ = false;
  this.longpressed_ = false;
  this.longpresstimeout_ = -1;

  this.ignoreMouse_ = false;
  this.ignoreTouches_ = false;

  this.initX_ = -1;
  this.initY_ = -1;

  this.lastX_ = -1;
  this.lastY_ = -1;

  this.handleLongPressBound_ = goog.bind(this.handleLongPress, this);
  /**
   * The original event.
   * @private
   * @type {goog.events.BrowserEvent}
   */
  this.originalEvent_ = null;
};
goog.inherits(pstj.ui.Touchable, pstj.ui.Async);

/**
 * The higher order event types.
 * @enum {string}
 */
pstj.ui.Touchable.EventType = {
  PRESS: goog.events.getUniqueId(goog.DEBUG ? 'press' : 'a'),
  LONG_PRESS: goog.events.getUniqueId(goog.DEBUG ? 'long-press' : 'b'),
  MOVE: goog.events.getUniqueId(goog.DEBUG ? 'move' : 'c'),
  RELEASE: goog.events.getUniqueId(goog.DEBUG ? 'release' : 'd')
};

/**
 * The list of events to listen for in the component.
 * @type {Array.<string>}
 */
pstj.ui.Touchable.EVENTS = [
  goog.events.EventType.TOUCHSTART,
  goog.events.EventType.TOUCHMOVE,
  goog.events.EventType.TOUCHEND,
  goog.events.EventType.TOUCHCANCEL,
  // The mouse events
  goog.events.EventType.MOUSEDOWN,
  goog.events.EventType.MOUSEMOVE,
  goog.events.EventType.MOUSEUP
  // Should we use scroll for zoom?
];

/** @inheritDoc */
pstj.ui.Touchable.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.attachTouchEvents();
};

/**
 * Attaches all events once the component is in the document.
 * @protected
 */
pstj.ui.Touchable.prototype.attachTouchEvents = function() {
  this.getHandler().listen(this.getElement(), pstj.ui.Touchable.EVENTS,
    this.handleTouchEvent);
  this.mousewheelhandler_ = new goog.events.MouseWheelHandler(
    this.getElement());
  this.getHandler().listen(this.mousewheelhandler_,
    goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
    this.handleMouseWheel);
};

/**
 * Number of milliseconds before we consider a long press.
 * @type {number}
 * @protected
 */
pstj.ui.Touchable.prototype.longPressTimeout = 800;

/**
 * The nimumim distance from the original point to consider the move as actual
 *   movement.
 * @type {number}
 * @protected
 */
pstj.ui.Touchable.prototype.minimumMoveDistance = 5;

/**
 * Handles all touch events. This is an umbrella method to allow to shorten
 *   the created event listeneres per component.
 * @param {goog.events.BrowserEvent} e The event that we should handle, could
 *   be of any event type.
 * @protected
 */
pstj.ui.Touchable.prototype.handleTouchEvent = function(e) {
  var type = e.type;
  var be = e.getBrowserEvent();
  this.originalEvent_ = e;
  // We should stop the default behaviour on touch to prevent generation of
  // mouse click events.
  switch (type) {

// TOUCHES
    case goog.events.EventType.TOUCHSTART:
      e.preventDefault();

      if (this.ignoreTouches_) return;

      this.ignoreMouse_ = true;
      this.initX_ = be['touches'][0]['screenX'];
      this.initY_ = be['touches'][0]['screenY'];
      this.handleEventPress_();
      break;

    case goog.events.EventType.TOUCHMOVE:
      e.preventDefault();

      if (this.ignoreTouches_) return;

      if (this.pressed_ && !this.longpressed_) {
        // check to see if we already are in a movement
        if (be['touches'].length == 1) {
          // we are potentially in a move
          this.lastX_ = be['touches'][0]['screenX'];
          this.lastY_ = be['touches'][0]['screenY'];
          this.handleEventMoved_();
        } else {
          throw new Error('Not supported yet');
        }
      }
      break;

    case goog.events.EventType.TOUCHEND:
      e.preventDefault();

      if (this.ignoreTouches_) return;

      this.ignoreMouse_ = false;
      this.handleEventRelease_();
      break;

// MOUSE
    case goog.events.EventType.MOUSEDOWN:
      e.preventDefault();

      if (this.ignoreMouse_) return;

      this.ignoreTouches_ = true;
      this.initX_ = e.screenX;
      this.initY_ = e.screenY;
      this.handleEventPress_();
      break;

    case goog.events.EventType.MOUSEMOVE:
      e.preventDefault();

      if (this.ignoreMouse_) return;

      if (this.pressed_ && !this.longpressed_) {
        this.lastX_ = e.screenX;
        this.lastY_ = e.screenY;
        this.handleEventMoved_();
      }
      break;

    case goog.events.EventType.MOUSEUP:
      e.preventDefault();

      if (this.ignoreMouse_) return;

      this.ignoreTouches_ = false;
      this.handleEventRelease_();
      break;
  }
};

/**
 * Getter for the original position of the pointer event.
 * @return {goog.math.Coordinate} The coordinates wrapper.
 */
pstj.ui.Touchable.prototype.getOriginPosition = function() {
  return new goog.math.Coordinate(this.initX_, this.initY_);
};

/**
 * Getter for the current position of the pointer event.
 * @return {goog.math.Coordinate} The coordinates wrapper.
 */
pstj.ui.Touchable.prototype.getCurrentPosition = function() {
  return new goog.math.Coordinate(this.lastX_, this.lastY_);
};

/**
 * Common work to do when when handlong abstracted press event.
 * @private
 */
pstj.ui.Touchable.prototype.handleEventPress_ = function() {
  this.lastY_ = this.initX_;
  this.lastX_ = this.initX_;
  this.pressed_ = true;
  clearTimeout(this.longpresstimeout_);
  this.longpresstimeout_ = setTimeout(this.handleLongPressBound_,
    this.longPressTimeout);
  this.dispatchEvent(pstj.ui.Touchable.EventType.PRESS);
};

/**
 * Common path when release event is anticipated.
 * @private
 */
pstj.ui.Touchable.prototype.handleEventRelease_ = function() {

  clearTimeout(this.longpresstimeout_);
  this.dispatchEvent(pstj.ui.Touchable.EventType.RELEASE);
  if (!this.moved_ && !this.longpressed_) {
    // if it was a genuine touch/tap - issue activate after that
    this.dispatchEvent(goog.ui.Component.EventType.ACTIVATE);
  }

  this.longpressed_ = false;
  this.moved_ = false;
  this.ignoremove_ = false;
  this.pressed_ = false;
};

/**
 * Common path when move event is anticipated.
 * @private
 */
pstj.ui.Touchable.prototype.handleEventMoved_ = function() {
  // if we are not moving yet, check if we are now
  if (!this.moved_) {
    this.checkForMovement();
  }
  if (this.moved_) {
    // we are already moving, disptch the move event.
    this.dispatchEvent(pstj.ui.Touchable.EventType.MOVE);
  }
};

/**
 * Getter for the original event that triggered the abstracted event. This is
 *   useful if we want to do something with the coordinates.
 * @return {goog.events.BrowserEvent} The original browser event abstraction.
 */
pstj.ui.Touchable.prototype.getTriggeringEvent = function() {
  return this.originalEvent_;
};

/**
 * Checks if the detected deltas are enough to consider this a movement.
 * @protected
 */
pstj.ui.Touchable.prototype.checkForMovement = function() {
  if (Math.abs(this.lastX_ - this.initX_) > this.minimumMoveDistance) {
    this.moved_ = true;
  } else if (Math.abs(this.lastY_ - this.initY_) > this.minimumMoveDistance) {
    this.moved_ = true;
  }
  // if we are moving indeed, cancel the long press
  if (this.moved_) {
    clearTimeout(this.longpresstimeout_);
  }
};

/**
 * Handles the wheel event in particular to produce the zoom event.
 * @protected
 * @param {goog.events.MouseWheelEvent} e The MOUSEWHEEl event.
 */
pstj.ui.Touchable.prototype.handleMouseWheel = function(e) {

};

/**
 * Handles the long press when detected.
 * @protected
 */
pstj.ui.Touchable.prototype.handleLongPress = function() {
  this.longpressed_ = true;
  this.dispatchEvent(pstj.ui.Touchable.EventType.LONG_PRESS);
};
