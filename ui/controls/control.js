goog.provide('pstj.ui.TouchControl');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('goog.ui.registry');
goog.require('pstj.ui.Template');

/**
 * My new class description
 * @constructor
 * @extends {goog.ui.Control}
 * @param {?string} content The content to use, this is not really used here.
 * @param {pstj.ui.ControlRenderer=} opt_renderer The renderer to use, it
 *   should understand templates.se.
 */
pstj.ui.TouchControl = function(content, opt_renderer) {
  goog.base(this, content, opt_renderer, opt_domHelper);
  /**
   * The cache to use to store touch coordinates without touching the DOM.
   * @type {Array.<number>}
   * @private
   */
  this.touchCoordinatesCache_ = [0, 0];
  /**
   * The events that should be ignored.
   * @type {pstj.ui.TouchControl.Ignore}
   * @private
   */
  this.ignoring_ = pstj.ui.TouchControl.Ignore.NONE;
  /**
   * Flag if an activation is pending.
   * @type {boolean}
   * @private
   */
  this.pendingActivation_ = false;
  /**
   * The current touch state of the control.
   * @type {pstj.ui.TouchControl.TouchState}
   * @private
   */
  this.touchState_ = pstj.ui.TouchControl.TouchState.NONE;
};
goog.inherits(pstj.ui.TouchControl, goog.ui.Control);

/**
 * @enum {number}
 */
pstj.ui.TouchControl.TouchState = {
  NONE: 0x00,
  PRESSED: 0x01,
  MOVED: 0x02,
  LONG_PRESSED: 0x04
};

/**
 * @enum {number}
 */
pstj.ui.TouchControl.Ignore = {
  NONE: 0x00,
  TOUCH: 0x01,
  MOUSE: 0x02,
  ALL: 0xFF
};

goog.scope(function() {

  var _ = pstj.ui.TouchControl.prototype;

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    if (this.isHandleTouchEvents()) {
      this.enableTouchEventsHandling_(true);
    }
  };

  /**
   * Getter for the template used by the control.
   * @return {pstj.ui.Template}
   */
  _.getTemplate = function() {
    return this.template_;
  };

  /**
   * Checks internally if the touch events should be handled.
   * @return {boolean} True if the touch events should be handled.
   */
  _.isHandleTouchEvents = function() {
    return this.handleTouchEvents_;
  };

  /**
   * Sets the flag responsible for determining if the touch events should be
   *   handled.
   * @param {boolean} enable True to enable the touch event handling.
   */
  _.setHandleTouchEvents = function(enable) {
    if (this.isInDocument() && this.handleTouchEvents_ != enable) {
      this.enableTouchEventsHandling_(enable);
    }
    this.handleTouchEvents_ = enable;
  };

  /**
   * Binds or unbinds the touch event handlers from the controler. The method
   *   is strictrly private.
   * @param {boolean} enable True to enable.
   * @private
   */
  _.enableTouchEventsHandling_ = function(enable) {
    if (enable) {
      this.getHandler().listen(this.getElement(), [
        goog.events.EventType.TOUCHSTART,
        goog.events.EventType.TOUCHMOVE,
        goog.events.EventType.TOUCHEND,
        goog.events.EventType.TOUCHCANCEL], this.handleTouchEvent);
    } else {
      this.getHandler().unlisten(this.getElement(), [
        goog.events.EventType.TOUCHSTART,
        goog.events.EventType.TOUCHMOVE,
        goog.events.EventType.TOUCHEND,
        goog.events.EventType.TOUCHCANCEL], this.handleTouchEvent);
    }
  };

  /**
   * Handles the touch events generated on the control component.
   * @param {goog.events.Event} e The TOUCH* event.
   * @protected
   */
  _.handleTouchEvent = function(e) {
    switch (e.type) {
      case goog.events.EventType.TOUCHSTART:
        this.handleTouchStart(e);
        break;
      case goog.events.EventType.TOUCHMOVE:
        this.handleTouchMove(e);
        break;
      case goog.events.EventType.TOUCHEND:
        this.handleTouchEnd(e);
        break;
      case goog.events.EventType.TOUCHCANCEL:
        this.handleTouchCancel(e);
        break;
    }
  };

  /**
   * Handles touch event
   * @param {goog.events.Event} e The touch* event.
   * @protected
   */
  _.handleTouchStart = function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.pendingActivation_ = true;
    this.touchCoordinatesCache_[0] = e.getBrowserEvent(
      )['changedTouches'][0]['clientX'];
    this.touchCoordinatesCache_[1] = e.getBrowserEvent(
      )['changedTouches'][0]['clientY'];
    this.setState(goog.ui.Component.State.HOVER, true);
    this.setState(goog.ui.Component.State.ACTIVE, true);
  };
  /**
   * Handles touch event
   * @param {goog.events.Event} e The touch* event.
   * @protected
   */
  _.handleTouchMove = function(e) {
    if (Math.abs(this.touchCoordinatesCache_[0] - e.getBrowserEvent(
      )['changedTouches'][0]['clientX']) > 5 || Math.abs(
      this.touchCoordinatesCache_[1] - e.getBrowserEvent(
      )['changedTouches'][0]['clientY']) > 5) {
      this.pendingActivation_ = false;
      this.setState(goog.ui.Component.State.ACTIVE, false);
    } else {
      e.stopPropagation();
      e.preventDefault();
    }
  };
  /**
   * Handles touch event
   * @param {goog.events.Event} e The touch* event.
   * @protected
   */
  _.handleTouchEnd = function(e) {
    if (this.pendingActivation_) {
      this.performActionInternal(e);
      e.stopPropagation();
      e.preventDefault();
    }
    this.setState(goog.ui.Component.State.ACTIVE, false);
    this.setState(goog.ui.Component.State.HOVER, false);
  };

  /**
   * Handles touch event
   * @param {goog.events.Event} e The touch* event.
   * @protected
   */
  _.handleTouchCancel = function(e) {
    throw new Error('This method is not defined: handletouchend');
  };

  /** @inheritDoc */
  _.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    this.touchCoordinatesCache_ = null;
    this.template_ = null;
  };

});
