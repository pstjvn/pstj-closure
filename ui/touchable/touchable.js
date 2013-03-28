goog.provide('pstj.ui.Touchable');
goog.provide('pstj.ui.Touchable.Event');
goog.provide('pstj.ui.Touchable.EventType');
goog.provide('pstj.ui.Touchable.PubSub');

goog.require('goog.events');
goog.require('goog.functions');
goog.require('goog.pubsub.PubSub');
goog.require('goog.ui.Component.EventType');
goog.require('pstj.ui.Async');

/**
 * @fileoverview Provides abstracted component that can be accessed as
 *   touchable or regular component, i.e. TOUCH and MOUSE events are merged
 *   into a cohesive higher order events that can be tracked with the internal
 *   eventing system. The class is provided as a base for touch enabled
 *   interfaces, however note that the pre-processing of the events come at an
 *   expense, test your code and frame rate before including touchables in it!
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides the base for touchable components. The touch is abstracted to work
 *   with touch and mouse in the same manner.
 * @constructor
 * @extends {pstj.ui.Async}
 */
pstj.ui.Touchable = function() {
  goog.base(this);

  /**
   * @private
   * @type {boolean}
   */
  this.pressed_ = false;
  /**
   * @private
   * @type {boolean}
   */
  this.moved_ = false;
  /**
   * @private
   * @type {boolean}
   */
  this.lpressed_ = false;
  /**
   * @private
   * @type {number}
   */
  this.ignoringEvents_ = 0x00;

  /**
   * @type {function(): undefined}
   * @private
   */
  this.longTouchHandlerBound_ = goog.bind(function() {
    this.dispatchEvent(pstj.ui.Touchable.EventType.LONG_PRESS);
  }, this);
};
goog.inherits(pstj.ui.Touchable, pstj.ui.Async);

/**
 * Extraxtec function that releases the double press state after a timeout.
 * @private
 */
pstj.ui.Touchable.releaseDoublePress_ = function() {
  pstj.ui.Touchable.doubleTouchApplied_ = false;
  pstj.ui.Touchable.PubSub.publish(pstj.ui.Touchable.PubSub.DCLEAR);
};

/**
 * Starts a global long press timeout if one is not started already. This is
 *   when a user presses on an item without moving the mouse.
 * @private
 */
pstj.ui.Touchable.prototype.startLongTouch_ = function() {
  if (pstj.ui.Touchable.longTouchTimeout_ == -1) {
    pstj.ui.Touchable.longTouchTimeout_ = setTimeout(
      this.longTouchHandlerBound_, 800);
  }
};

/**
 * Ends the global listened for long press, this is if user performs a
 *   canceling action.
 * @private
 */
pstj.ui.Touchable.prototype.cancelLongTouch_ = function() {
  clearTimeout(pstj.ui.Touchable.longTouchTimeout_);
  pstj.ui.Touchable.longTouchTimeout_ = -1;
};

/**
 * Handles the browser events as submitted by the closure event system.
 * @param {goog.events.Event} e The wrapped closure event.
 * @protected
 */
pstj.ui.Touchable.prototype.handleBrowerEvent = function(e) {
  e.preventDefault();
  e.stopPropagation();
  if (!this.pressed_) {
    if (e.type == goog.events.EventType.TOUCHMOVE ||
      e.type == goog.events.EventType.MOUSEMOVE) {
      return;
    }
  }
  if (e.type.indexOf('touch') != -1) {
    if (!this.isIgnoringEvent(pstj.ui.Touchable.IGNORING_EVENT_NAME.TOUCH)) {
      this.handleTouchEvent(/** @type {goog.events.BrowserEvent} */(e));
    }
  } else {
    if (!this.isIgnoringEvent(pstj.ui.Touchable.IGNORING_EVENT_NAME.MOUSE)) {
      this.handleMouseEvent(/** @type {goog.events.BrowserEvent} */(e));
    }
  }
};

/**
 * Sets the state of double touch globally.
 * @param {boolean} enable If true this will mean for all application level
 *   that there is double touch.
 * @protected
 */
pstj.ui.Touchable.prototype.setDoubleTouchesState = function(enable) {
  pstj.ui.Touchable.doubleTouchApplied_ = enable;
};

/**
 * Checks if there is a double touch currently applied system wide.
 * @protected
 * @return {boolean} True if there is a double touch applied system wide.
 */
pstj.ui.Touchable.prototype.isDoubleTOuchApplied = function() {
  return pstj.ui.Touchable.doubleTouchApplied_;
};

/**
 * Handles the touch events coming from the DOM.
 * @param {goog.events.BrowserEvent} e The browser event.
 * @protected
 */
pstj.ui.Touchable.prototype.handleTouchEvent = function(e) {
  switch (e.type) {
    case goog.events.EventType.TOUCHSTART:

      this.setIgnoreEvent(pstj.ui.Touchable.IGNORING_EVENT_NAME.MOUSE, true);

      this.moved_ = false;
      this.lpressed_ = false;

      // if we detect a start and the touches are more than one this is at last
      // double touch.
      if (e.getBrowserEvent()['touches'].length > 1) {
        pstj.ui.Touchable.PubSub.publish(pstj.ui.Touchable.PubSub.DINIT, e);
        return;
      }

      this.dispatchEvent(new pstj.ui.Touchable.Event(
        pstj.ui.Touchable.EventType.PRESS, this,
          e.getBrowserEvent()['changedTouches'][0]['clientX'],
          e.getBrowserEvent()['changedTouches'][0]['clientY']));

      this.startLongTouch_();

      break;

    case goog.events.EventType.TOUCHMOVE:

      if (e.getBrowserEvent()['touches'].length > 1) {

        this.cancelLongTouch_();
        this.setDoubleTouchesState(true);
        pstj.ui.Touchable.PubSub.publish(pstj.ui.Touchable.PubSub.DOUBLE, e);

      } else {

        if (e.getBrowserEvent()['touches'].length == 1 &&
          !this.isDoubleTOuchApplied()) {

          if (!this.pressed_) return;

          this.cancelLongTouch_();

          this.dispatchEvent(new pstj.ui.Touchable.Event(
            pstj.ui.Touchable.EventType.MOVE, this,
              e.getBrowserEvent()['changedTouches'][0]['clientX'],
              e.getBrowserEvent()['changedTouches'][0]['clientY']));

        }
      }

      break;

    case goog.events.EventType.TOUCHEND:

      this.cancelLongTouch_();

      if (e.getBrowserEvent()['touches'].length == 0) {

        if (this.isDoubleTOuchApplied()) {
          setTimeout(pstj.ui.Touchable.releaseDoublePress_, 100);
        } else {

          if (!this.pressed_) return;
          if (!this.moved_ && !this.lpressed_) {
            this.dispatchEvent(goog.ui.Component.EventType.ACTIVATE);
          }
          this.dispatchEvent(pstj.ui.Touchable.EventType.RELEASE);
        }

        this.setIgnoreEvent(pstj.ui.Touchable.IGNORING_EVENT_NAME.MOUSE, false);
      }

      break;

    case goog.events.EventType.TOUCHCANCEL:

      this.cancelLongTouch_();
      this.pressed_ = false;
      this.moved_ = false;
      this.lpressed_ = false;

      break;
  }
};

/**
 * Handles the mouse event from the DOM.
 * @param {goog.events.BrowserEvent} e The original wrapped mouse event.
 * @protected
 */
pstj.ui.Touchable.prototype.handleMouseEvent = function(e) {
  switch (e.type) {
    case goog.events.EventType.MOUSEDOWN:

      this.setIgnoreEvent(pstj.ui.Touchable.IGNORING_EVENT_NAME.TOUCH, true);

      this.moved_ = false;
      this.lpressed_ = false;

      this.dispatchEvent(new pstj.ui.Touchable.Event(
        pstj.ui.Touchable.EventType.PRESS, this, e.clientX, e.clientY));

      this.startLongTouch_();

      break;

    case goog.events.EventType.MOUSEMOVE:

      if (!this.pressed_) return;

      this.cancelLongTouch_();

      this.dispatchEvent(new pstj.ui.Touchable.Event(
        pstj.ui.Touchable.EventType.MOVE, this, e.clientX, e.clientY));

      break;

    case goog.events.EventType.MOUSEUP:

      this.cancelLongTouch_();

      if (!this.pressed_) return;
      if (!this.moved_ && !this.lpressed_) {
        this.dispatchEvent(goog.ui.Component.EventType.ACTIVATE);
      }
      this.dispatchEvent(pstj.ui.Touchable.EventType.RELEASE);

      this.setIgnoreEvent(pstj.ui.Touchable.IGNORING_EVENT_NAME.TOUCH, false);

      break;

  }
};

/**
 * Enables or disables ignoration of a particular event types.
 * @param {pstj.ui.Touchable.IGNORING_EVENT_NAME} event_type The state to
 *   enable/disable.
 * @param {boolean} enable If true, the state will be enabled, if false it
 *   will be removed from the ignoring state.
 * @protected
 */
pstj.ui.Touchable.prototype.setIgnoreEvent = function(event_type, enable) {
  this.ignoringEvents_ = (enable) ? this.ignoringEvents_ | event_type :
    this.ignoringEvents_ & ~event_type;
};

/**
 * Checks if this particular ignoring state is set.
 * @param {pstj.ui.Touchable.IGNORING_EVENT_NAME} event_type The evenrt type
 *   to check if it is ignored.
 * @return {boolean} True if this event type is currently ignored, false
 *   otherwise.
 * @protected
 */
pstj.ui.Touchable.prototype.isIgnoringEvent = function(event_type) {
  return !!(this.ignoringEvents_ & event_type);
};

/**
 * Attaches the DOM event listeners. By default all touch and mouse events are
 *   attched.
 * @protected
 */
pstj.ui.Touchable.prototype.attachTouchEvents = function() {
  this.getHandler().listen(this.getElement(), pstj.ui.Touchable.EVENTS,
    this.handleBrowerEvent);
};

/**
 * Getter method to check if move events are allowed currently on the widget.
 *   This is checked when deciding if the widget should react to the move high
 *   order events. Used by widgets that need special activation before
 *   reacting to move.
 * @protected
 * @return {boolean} True if move events are interinsically allowed. False if
 *   not.
 */
pstj.ui.Touchable.prototype.isMoveEnabled = goog.functions.TRUE;

/**
 * Handles all touchable events with default actions. This is needed for the
 *   abstraction to work properly.
 * @param {goog.events.Event} e The abstracted touch events.
 * @private
 */
pstj.ui.Touchable.prototype.handleAllTouchables_ = function(e) {
  switch (e.type) {

    case pstj.ui.Touchable.EventType.PRESS:
      this.pressed_ = true;
      break;

    case pstj.ui.Touchable.EventType.MOVE:
      this.moved_ = true;
      break;

    case pstj.ui.Touchable.EventType.RELEASE:
      this.pressed_ = false;
      this.cancelLongTouch_();
      break;

    case pstj.ui.Touchable.EventType.LONG_PRESS:
      this.lpressed_ = true;
  }
};

/**
 * Adds the listeneres needed for the component to work properly. This
 *   includes all the DOM related listeners as well as the internal listeners
 *   that support the state of the widget in regard of its pressed / moved /
 *   long pressed state.
 * @protected
 */
pstj.ui.Touchable.prototype.addListeners = function() {

  this.attachTouchEvents();

  // listen with the default actions for high order events.
  this.getHandler().listen(this, [pstj.ui.Touchable.EventType.PRESS,
    pstj.ui.Touchable.EventType.MOVE, pstj.ui.Touchable.EventType.RELEASE,
    pstj.ui.Touchable.EventType.LONG_PRESS], this.handleAllTouchables_);

};

/** @inheritDoc */
pstj.ui.Touchable.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.addListeners();
};

/** @inheritDoc */
pstj.ui.Touchable.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.longTouchHandlerBound_;
};

/**
 * Holds the ID of the timeout for long touch.
 * @type {number}
 * @private
 */
pstj.ui.Touchable.longTouchTimeout_ = -1;

/**
 * Internal value for if the double press is active on the application level.
 * @type {boolean}
 * @private
 */
pstj.ui.Touchable.doubleTouchApplied_ = false;

/**
 * The subscription channel for multi touches.
 * @type {goog.pubsub.PubSub}
 */
pstj.ui.Touchable.PubSub = new goog.pubsub.PubSub();

/**
 * The double touch MOVE topic for the subscription channel.
 * @type {string}
 */
pstj.ui.Touchable.PubSub.DOUBLE = 'double';
/**
 * The double touch START topic for the subscription channel.
 * @type {string}
 */
pstj.ui.Touchable.PubSub.DINIT = 'init-double';
/**
 * The double touch END topic for the subscription channel.
 * @type {string}
 */
pstj.ui.Touchable.PubSub.DCLEAR = 'clear-double';

/**
 * The list of events to listen in the DOM in order to make this work.
 * @type {Array.<string>}
 * @protected
 */
pstj.ui.Touchable.EVENTS = [
  goog.events.EventType.TOUCHSTART,
  goog.events.EventType.TOUCHMOVE,
  goog.events.EventType.TOUCHEND,
  goog.events.EventType.TOUCHCANCEL,
  goog.events.EventType.MOUSEDOWN,
  goog.events.EventType.MOUSEMOVE,
  goog.events.EventType.MOUSEUP
];

/**
 * Lists the event types emitted by this class.
 * @enum {string}
 */
pstj.ui.Touchable.EventType = {
  PRESS: goog.events.getUniqueId(goog.DEBUG ? 'press' : 'a'),
  LONG_PRESS: goog.events.getUniqueId(goog.DEBUG ? 'long-press' : 'b'),
  MOVE: goog.events.getUniqueId(goog.DEBUG ? 'move' : 'c'),
  RELEASE: goog.events.getUniqueId(goog.DEBUG ? 'release' : 'd')
  // we also emit the Component's ACTIVATE event.
  // ZOOMIN/OUT events are externally bound and not supported within the
  // component.
};

/**
 * List of possible events to ignore when processing inputs.
 * @enum {number}
 */
pstj.ui.Touchable.IGNORING_EVENT_NAME = {
  ALL: 0xff,
  TOUCH: 0x01,
  MOUSE: 0x02
};

/**
 * Wraps the touch events.
 * @constructor
 * @extends {goog.events.Event}
 * @param {string} type The type of the event.
 * @param {pstj.ui.Touchable} target The target of the event.
 * @param {number} x The X coordinate of the event.
 * @param {number} y The Y coordinate of the event.
 */
pstj.ui.Touchable.Event = function(type, target, x, y) {
  goog.base(this, type, target);
  this.x = x;
  this.y = y;
};
goog.inherits(pstj.ui.Touchable.Event, goog.events.Event);
