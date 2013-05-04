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
 *   should understand templates.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *   document interaction.
 * @param {pstj.ui.Template=} opt_template Optional template to use.
 */
pstj.ui.TouchControl = function(content, opt_renderer, opt_domHelper,
  opt_template) {

  goog.base(this, content, opt_renderer, opt_domHelper);
  /**
   * The template used by the custom control. Notice that the controls do not
   *   inherit from the templated component type, but still can use the
   *   Template interface as it is much more convenient.
   * @type {pstj.ui.Template}
   * @private
   */
  this.template_ = opt_template || pstj.ui.Template.getInstance();
  /**
   * Flag: if the touch events should be listened for. By default we listen
   *   for it.
   * @type {boolean}
   * @private
   */
  this.handleTouchEvents_ = true;
  /**
   * The cache to use to store touch coordinates without touching the DOM.
   * @type {Array.<number>}
   * @private
   */
  this.touchCoordinatesCache_ = [0, 0];
  /**
   * Flag if an activation is pending.
   * @type {boolean}
   * @private
   */
  this.pendingActivation_ = false;
};
goog.inherits(pstj.ui.TouchControl, goog.ui.Control);

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
