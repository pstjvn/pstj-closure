goog.provide('pstj.ui.gestureAgent');
goog.provide('pstj.ui.gestureAgent.EventType');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.async.AnimationDelay');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.ui.Control');
goog.require('pstj.ui.Agent');
goog.require('pstj.ui.Touch');
goog.require('pstj.ui.TouchPool');



/**
 * The agent is designed to address the common movement on touch screens and
 * abstract the nuances of detection into a class that can be utilized to
 * emit the needed events only once per frame and thus allow the caching of
 * values and calculation into a central place.
 *
 * Notice that once a component is subscribed to this agent all defaults of
 * touch and mouse events will be prevented and thus you have to listen for
 * the agent's defined events to react on user action. Notice also that the
 * events are emitted with raf so you do not need to created RAFs on the
 * component to be in sync with the drawing of the screen.
 *
 * @constructor
 * @extends {pstj.ui.Agent}
 */
pstj.ui.gestureAgent = function() {
  goog.base(this, null);
  /**
   * Referrence to the component that was initially touched. All moves and
   * subsequent touches are assumed to be relevant to this component and its
   * element.
   * @type {goog.ui.Control}
   * @private
   */
  this.currentComponent_ = null;
  /**
   * Referrence to the element that was initially touched. All moves and
   * subsequent touches are assumed to be relevant to this element and to its
   * component.
   * @type {Element}
   * @private
   */
  this.currentElement_ = null;
  /**
   * List of elements so we can match the element to its component more easily.
   * @type {Array.<Element>}
   * @private
   */
  this.elements_ = [];
  /**
   * The cache we will use to recreate the touches and calculations.
   * @type {Array.<number>}
   * @private
   */
  this.tc_ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  /**
   * Second touch cache values. Note that this is utilized only when a second
   * touch is detected. The developer shoud always chekc if the touch was
   * double.
   * @type {Array.<number>}
   * @private
   */
  this.tc2_ = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  /**
   * Bound event handler to use for the browse events.
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);
  /**
   * RAF-y the handler for move events. We cap the events at one per frame
   * in orer to allow the developer code to not hane to handle frame rates.
   * @type {goog.async.AnimationDelay}
   * @private
   */
  this.raf_ = new goog.async.AnimationDelay(this.onRaf, undefined, this);
};
goog.inherits(pstj.ui.gestureAgent, pstj.ui.Agent);
goog.addSingletonGetter(pstj.ui.gestureAgent);


/**
 * Provides named access to the cache system.
 * @enum {number}
 * @private
 */
pstj.ui.gestureAgent.Cache_ = {
  TOUCHSTART_X: 0,
  TOUCHSTART_Y: 1,
  TOUCHSTART_TS: 2,
  TOUCHLAST_X: 3,
  TOUCHLAST_Y: 4,
  TOUCHLAST_TS: 5,
  TOUCHCURRENT_X: 6,
  TOUCHCURRENT_Y: 7,
  TOUCHCURRENT_TS: 8,
  TOUCHREALLST_X: 9,
  TOUCHREALLAST_Y: 10
};


/**
 * The maximum velocity to use when calculatinc veloticy for kinetic effects.
 * @type {number}
 * @const
 */
pstj.ui.gestureAgent.MaxVelocity = 30;


/**
 * Provides the list of event types the gesture system recognizes.
 * @enum {string}
 */
pstj.ui.gestureAgent.EventType = {
  PRESS: goog.events.getUniqueId('start'),
  LONGPRESS: goog.events.getUniqueId('longpress'),
  MOVE: goog.events.getUniqueId('move'),
  PINCH: goog.events.getUniqueId('pinch'),
  ZOOM: goog.events.getUniqueId('zoom'),
  RELEASE: goog.events.getUniqueId('release'),
  CANCEL: goog.events.getUniqueId('cancel')
};


goog.scope(function() {
var _ = pstj.ui.gestureAgent.prototype;
var GE = pstj.ui.gestureAgent.EventType;
var C = pstj.ui.gestureAgent.Cache_;


/**
 * Utility function to mimic the component interface for easier work with
 * events.
 * @protected
 * @return {goog.events.EventHandler} The handler bound to the agent.
 */
_.getHandler = function() {
  return this.handler_;
};


/**
 * Getter for the cache. Utility function.
 * @return {Array.<number>}
 * @protected
 */
_.getTouchCache = function() {
  return this.tc_;
};


/**
 * Attempts to retrieve a component with the element as its root node.
 * @protected
 * @param {Element} element The DOM element to resolve the component for.
 * @return {goog.ui.Control} The component by its element.
 */
_.resolveComponent = function(element) {
  var idx = goog.array.indexOf(this.elements_, element);
  var component = this.item(idx);
  if (!goog.isNull(component)) {
    return goog.asserts.assertInstanceof(component, goog.ui.Control);
  } else {
    return null;
  }
};


/**
 * Locks the event system to a particular element and component.
 * @param {Element} element The target of the browser events.
 * @protected
 */
_.lock = function(element) {
  if (this.isLocked()) {
    throw new Error('Already locked');
  }
  this.currentElement_ = element;
  this.currentComponent_ = this.resolveComponent(element);
};


/**
 * Unlocks the lock of the event target for touch event and emitting the
 * component events.
 * @param {Element} element The element the code considers should be detached.
 * @protected
 */
_.unlock = function(element) {
  if (this.currentElement_ == element) {
    this.currentElement_ = null;
    this.currentComponent_ = null;
  }
};


/**
 * Checks if the system has locked on an element.
 * @protected
 * @return {boolean} True if there is an element locked for all touches.
 */
_.isLocked = function() {
  return !goog.isNull(this.currentElement_);
};


/**
 * We attach listeners to the component so we can monuitor its touch activity.
 * Basically this adds new element to handle the toches on.
 * @override
 */
_.updateCache = function(component) {
  goog.asserts.assertInstanceof(component, goog.ui.Control,
      'Only controls are allowed to receive gestures');

  // map the element that we will listen on to the component we want to
  // emit the events to.
  this.elements_[this.indexOf(component)] = component.getElement();
  this.getHandler().listen(component.getElement(), [
    goog.events.EventType.TOUCHSTART,
    goog.events.EventType.TOUCHMOVE,
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.TOUCHCANCEL], this.handleTouchEvents);
};


/** @inheritDoc */
_.detach = function(component) {
  goog.base(this, 'detach', component);
  var index = this.indexOf(component);
  if (index != -1) {
    this.getHandler().unlisten(component.getElement(), [
      goog.events.EventType.TOUCHSTART,
      goog.events.EventType.TOUCHMOVE,
      goog.events.EventType.TOUCHEND,
      goog.events.EventType.TOUCHCANCEL], this.handleTouchEvents);
    this.elements_[this.indexOf(component)] = null;
  }
};


/**
 * Getter for the browser native event (Touch).
 * @protected
 * @param {goog.events.Event} e The wrapped browser event.
 * @return {TouchEvent} The native touch event.
 */
_.getBrowserEvent = function(e) {
  return goog.asserts.assertInstanceof(e.getBrowserEvent(), TouchEvent);
};


/**
 * Wraps getting the touch count.
 * @param {goog.events.Event} e The wrapped browser/native touch event.
 * @return {number} The number of current touches on the screen.
 * @protected
 */
_.getTouchCount = function(e) {
  return this.getBrowserEvent(e).touches.length;
};


/**
 * Getter for a particular indexed touch.
 * @param {goog.events.Event} e The wrapper browser event.
 * @param {number=} opt_idx The index of the Touch to retrieve.
 * @return {?Touch}
 * @protected
 */
_.getTouch = function(e, opt_idx) {
  if (!goog.isDef(opt_idx)) {
    opt_idx = 0;
  }
  var touch = this.getBrowserEvent(e).touches.item(opt_idx);
  if (!touch) {
    return null;
  }
  return touch;
};


/**
 * Returns the distance traversed by the first last touch on the screen.
 * @return {number}
 */
_.getTouchDistance = function() {
  var dx = this.getTouchDistanceX();
  var dy = this.getTouchDistanceY();
  return Math.sqrt((dx * dx) + (dy * dy));
};


/**
 * Returns the distance travelled on the X coordinate in the touch.
 * @return {number}
 */
_.getTouchDistanceX = function() {
  return this.tc_[C.TOUCHSTART_X] - this.tc_[C.TOUCHCURRENT_X];
};


/**
 * Returns the distance travelled on the Y coordinate in the livetime of the
 * touch event.
 * @return {number}
 */
_.getTouchDistanceY = function() {
  return this.tc_[C.TOUCHSTART_Y] - this.tc_[C.TOUCHCURRENT_Y];
};


/**
 * Allows the component instance to request the details relevant to the
 * touch(es) that produced the component event. because we do not keep the
 * event objects around we need to extract the values from the cache.
 * @param {number=} opt_index Optionally the index of the touch to recreate,
 * relevant only with ZOOM events.
 * @return {pstj.ui.Touch} A touch object taht represent the data of the
 * touch.
 */
_.getTouchDetail = function(opt_index) {
  if (!goog.isDef(opt_index)) opt_index = 0;
  var touch = pstj.ui.TouchPool.getInstance().getObject();
  touch.setTouch(this.tc_[C.TOUCHCURRENT_X], this.tc_[C.TOUCHCURRENT_Y],
      this.tc_[C.TOUCHCURRENT_TS]);
  return goog.asserts.assertInstanceof(touch, pstj.ui.Touch);
};


/**
 * Releases the touch detail. Because we do not control the retrieval we
 * cannot really control the freeing of the touch objects so we must rely on
 * the developer to do the cleaup.
 * @param {pstj.ui.Touch} touch The touch to release.
 */
_.releaseTouchDetail = function(touch) {
  pstj.ui.TouchPool.getInstance().releaseObject(touch);
};


/**
 * Returns the touch duration in ms.
 * @return {number}
 */
_.getTouchDuration = function() {
  return this.tc_[C.TOUCHCURRENT_TS] - this.tc_[C.TOUCHSTART_TS];
};


/**
 * Returns the difference between the last announced MOVE event and the
 * current position on the X coordinate.
 * @return {number}
 */
_.getMoveDifferenceX = function() {
  return this.tc_[C.TOUCHLAST_X] - this.tc_[C.TOUCHCURRENT_X];
};


/**
 * Returns the difference between the last announced move event and the
 * ccurrent position on the Y coordinate.
 * @return {number}
 */
_.getMoveDifferenceY = function() {
  return this.tc_[C.TOUCHLAST_Y] - this.tc_[C.TOUCHCURRENT_Y];
};


/**
 * When zooming calculates the zoom diff.
 * @return {number}
 */
_.getZoomDistance = function() {
  return 0;
};


/**
 * Returns the calculated velocity of the scroll.
 * @return {number}
 */
_.getVelocityY = function() {
  var velocity = this.tc_[C.TOUCHCURRENT_Y] - this.tc_[C.TOUCHREALLAST_Y];
  if (velocity < -pstj.ui.gestureAgent.MaxVelocity) {
    velocity = -pstj.ui.gestureAgent.MaxVelocity;
  } else if (velocity > pstj.ui.gestureAgent.MaxVelocity) {
    velocity = pstj.ui.gestureAgent.MaxVelocity;
  }
  return velocity;
};


/**
 * Getter for the current component instance.
 * @return {?goog.ui.Control} The component if one is locked or null.
 */
_.getCurrentComponent = function() {
  return this.currentComponent_;
};


/**
 * Handles the RAF event of touch move.
 * @param {number} ts The timestamp of the RAF function call.
 * @protected
 */
_.onRaf = function(ts) {
  this.getCurrentComponent().dispatchEvent(GE.MOVE);
  // Update the last position to match the position we had on the time
  // of the MOVE event.
  this.tc_[C.TOUCHLAST_X] = this.tc_[C.TOUCHCURRENT_X];
  this.tc_[C.TOUCHLAST_Y] = this.tc_[C.TOUCHCURRENT_Y];
  this.tc_[C.TOUCHLAST_TS] = this.tc_[C.TOUCHCURRENT_TS];
};


/**
 * Globalized handler for all events subscribed without a listener.
 * @param {goog.events.Event} e The wrapped browser event, presuming touch.
 * @protected
 */
_.handleTouchEvents = function(e) {
  e.stopPropagation();
  e.preventDefault();
  var target = goog.asserts.assertInstanceof(e.currentTarget, Element);
  var type = e.type;
  // TOUCH START
  if (type == goog.events.EventType.TOUCHSTART) {
    // If we are not currently locked - lock to the target element.
    if (!this.isLocked()) {
      this.lock(goog.asserts.assertInstanceof(target, Element));
    }
    // If this is the first touch emit the press event for the component.
    if (this.getTouchCount(e) == 1) {
      var touch = this.getTouch(e);
      this.tc_[C.TOUCHCURRENT_X] =
          this.tc_[C.TOUCHLAST_X] =
          this.tc_[C.TOUCHSTART_X] =
          this.tc_[C.TOUCHREALLST_X] = touch.clientX;
      this.tc_[C.TOUCHCURRENT_Y] =
          this.tc_[C.TOUCHLAST_Y] =
          this.tc_[C.TOUCHSTART_Y] =
          this.tc_[C.TOUCHREALLAST_Y] = touch.clientY;
      this.tc_[C.TOUCHCURRENT_TS] = this.tc_[C.TOUCHLAST_TS] =
          this.tc_[C.TOUCHSTART_TS] = this.getBrowserEvent(e).timeStamp;

      this.getCurrentComponent().dispatchEvent(GE.PRESS);
    } else {
      // handle the cases of more than one touches
    }
  } else if (type == goog.events.EventType.TOUCHMOVE) {
    if (this.isLocked()) {
      if (this.getTouchCount(e) == 1) {
        var touch = this.getTouch(e);
        this.tc_[C.TOUCHREALLST_X] = this.tc_[C.TOUCHCURRENT_X];
        this.tc_[C.TOUCHREALLAST_Y] = this.tc_[C.TOUCHCURRENT_Y];
        this.tc_[C.TOUCHCURRENT_X] = touch.clientX;
        this.tc_[C.TOUCHCURRENT_Y] = touch.clientY;
        this.tc_[C.TOUCHCURRENT_TS] = this.getBrowserEvent(e).timeStamp;
        if (!this.raf_.isActive()) {
          this.raf_.start();
        }
      } else {
        // Handle multiple touches
      }
    } else if (goog.DEBUG) {
      console.log('This should not happen!');
    }
  } else if (type == goog.events.EventType.TOUCHEND) {
    if (this.isLocked()) {
      if (this.getTouchCount(e) == 0) {
        this.tc_[C.TOUCHCURRENT_TS] = this.getBrowserEvent(e).timeStamp;
        this.raf_.stop();
        this.getCurrentComponent().dispatchEvent(GE.RELEASE);
        this.unlock(goog.asserts.assertInstanceof(target, Element));
      }
    }
  } else if (type == goog.events.EventType.TOUCHCANCEL) {
    if (this.isLocked()) {
      if (this.getTouchCount(e) == 0) {
        this.raf_.stop();
        this.getCurrentComponent().dispatchEvent(GE.CANCEL);
        this.unlock(goog.asserts.assertInstanceof(target, Element));
      }
    }
  }
};

});  // goog.scope
