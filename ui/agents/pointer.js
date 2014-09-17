goog.provide('pstj.agent.Pointer');

goog.require('goog.asserts');
goog.require('goog.async.AnimationDelay');
goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.math.Coordinate');
goog.require('pstj.ui.Agent');
goog.require('pstj.ui.element.EventType');



pstj.agent.Pointer = goog.defineClass(pstj.ui.Agent, {
  /**
   * Provides modern event abstractions for touch mouse and pen. Use
   * as regular Agent.
   *
   * @constructor
   * @struct
   * @extends {pstj.ui.Agent}
   */
  constructor: function() {
    pstj.ui.Agent.call(this, null);
    /**
     * Reference to the currently locked element.
     * @type {Element}
     * @private
     */
    this.currentElement_ = null;
    /**
     * Reference to the currently locked component.
     * @type {goog.ui.Component}
     * @private
     */
    this.currentComponent_ = null;
    /**
     * The type of the current event. Some differences in Mouse and Touch.
     * @type {pstj.agent.Pointer.Type}
     * @private
     */
    this.currentEventType_ = pstj.agent.Pointer.Type.UNKNOWN;
    /**
     * List of attached elements for easier access by index.
     * @type {Array.<Element>}
     * @private
     */
    this.elements_ = [];
    /**
     * Rerefence to the original target of the event. This is useful for when
     * the component need to react differently based on the tap initial target.
     * For example when there are several areas and to spare the need of several
     * distinct component but instead filter the behaviour based on the pressed
     * aarea.
     *
     * @type {Element}
     * @private
     */
    this.sourceElement_ = null;


    /**
     * Our bound event handler.
     * @type {goog.events.EventHandler}
     * @protected
     */
    this.handler = new goog.events.EventHandler(this);
    /**
     * Bound to RAF handler.
     * @type {goog.async.AnimationDelay}
     * @private
     */
    this.raf_ = new goog.async.AnimationDelay(this.onRaf, undefined, this);
    /**
     * The delayed long press event dispatcher.
     * @type {goog.async.Delay}
     * @private
     */
    this.longPressDelay_ = new goog.async.Delay(
        this.fireLongPress,
        1650, this);

    // generate our point and keep them for the app live cycle.
    this.startPoint_ = new pstj.agent.Point_();
    this.currentPoint_ = new pstj.agent.Point_();
    this.lastPoint_ = new pstj.agent.Point_();

    /**
     * Flag if the mouse was used to lock the element and we should monitor
     * the document for move and unlock.
     * @type {boolean}
     * @private
     */
    this.isDocumentBound_ = false;
  },


  /**
   * Attempts to find the component instance that corresponds to the
   * element triggered the browser event.
   * @param {Element} element
   * @return {goog.ui.Component}
   */
  resolveComponent: function(element) {
    return this.item(goog.array.indexOf(this.elements_, element));
  },


  /** @override */
  updateCache: function(component) {
    // We need the element in out list so we can easily resolve
    // between elements and component.
    this.elements_[this.indexOf(component)] = component.getElement();

    // We need to make sure we are bound to the document for mouse events as
    // they seem to often escape the boundaries of the target element
    if (!this.isDocumentBound_) {
      this.handler.listen(goog.dom.getDocument(), [
        goog.events.EventType.MOUSEMOVE,
        goog.events.EventType.MOUSEUP], this.handleEvents);
    }

    this.handler.listen(component.getElement(), [
      goog.events.EventType.TOUCHSTART,
      goog.events.EventType.TOUCHMOVE,
      goog.events.EventType.TOUCHEND,
      goog.events.EventType.TOUCHCANCEL,
      goog.events.EventType.MOUSEDOWN
    ], this.handleEvents);

    if (goog.userAgent.IE && goog.userAgent.isVersionOrHigher(11)) {
      this.handler.listen(component.getElement(), [
        goog.events.EventType.POINTERDOWN,
        goog.events.EventType.POINTERMOVE,
        goog.events.EventType.POINTERUP,
        goog.events.EventType.POINTERCANCEL
      ], this.handleEvents);
    }
  },


  /** @override */
  detach: function(component) {
    if (this.getTargetComponent() == component) {
      // we need to cancel all events..
      this.raf_.stop();
      this.currentElement_ = null;
      this.currentComponent_ = null;
    }

    var index = this.indexOf(component);
    if (index != -1 && this.elements_[index]) {
      this.handler.unlisten(this.elements_[index], [
        goog.events.EventType.TOUCHSTART,
        goog.events.EventType.TOUCHMOVE,
        goog.events.EventType.TOUCHEND,
        goog.events.EventType.TOUCHCANCEL,
        goog.events.EventType.MOUSEDOWN
      ], this.handleEvents);

      if (goog.userAgent.IE && goog.userAgent.isVersionOrHigher(11)) {
        this.handler.unlisten(component.getElement(), [
          goog.events.EventType.POINTERDOWN,
          goog.events.EventType.POINTERMOVE,
          goog.events.EventType.POINTERUP,
          goog.events.EventType.POINTERCANCEL
        ], this.handleEvents);
      }
    }

    this.elements_[this.indexOf(component)] = null;
    goog.base(this, 'detach', component);
  },


  /**
   * Method will be called synced to RAF so the listener does not need to
   * throttle this.
   *
   * @param {number} ts The timestamp of the RAF.
   * @protected
   */
  onRaf: function(ts) {
    this.getTargetComponent().dispatchEvent(pstj.ui.element.EventType.MOVE);
    this.lastPoint_.copy(this.currentPoint_);
  },


  /**
   * Allows the listener(s) to have access to the current touch point (i.e.
   * the last move taht occured).
   *
   * @return {pstj.agent.Point_}
   */
  getCurrentPoint: function(opt_idx) {
    return this.currentPoint_;
  },


  /**
   * Handle all events coming from a registered element. We capture those
   * and attempt to provide higher order events to ease the development
   * of cross device element.
   *
   * @param {goog.events.BrowserEvent} e The wrapped bower event.
   * @protected
   */
  handleEvents: function(e) {
    // stop all events. This might break chrome's new scroll
    // paradigm, but if the developer wants to listen for the events we
    // assume he really wants to do so.
    e.stopPropagation();
    e.preventDefault();

    if (e.type == goog.events.EventType.TOUCHSTART ||
        e.type == goog.events.EventType.POINTERDOWN ||
        e.type == goog.events.EventType.MOUSEDOWN) {

      if (!this.isLocked()) {
        this.lock(goog.asserts.assertInstanceof(e.currentTarget, Element));
      }
      // PRESS
      if (e.type == goog.events.EventType.TOUCHSTART) {
        if (this.getTouchesCount(e) == 1) {
          this.currentEventType_ = pstj.agent.Pointer.Type.TOUCH;
          // this is the primary touch so we assume it is a single finger
          // touch for now
          var touch = this.getTouchByIndex(this.getTouchEvent(e));
          this.startPoint_.update(
              touch.clientX,
              touch.clientY,
              this.getTouchEvent(e).timeStamp);
          this.sourceElement_ = /** @type {Element} */(e.target);
        } else {
          this.longPressDelay_.stop();
          // TODO: handle multiple touches.
          return;
        }
      } else if (e.type == goog.events.EventType.MOUSEDOWN) {
        // there is only one mause assuming...
        this.currentEventType_ = pstj.agent.Pointer.Type.MOUSE;
        var event = this.getMouseEvent(e);
        this.startPoint_.update(event.clientX, event.clientY, event.timeStamp);
        // Start listening on the document for move events as mouse
        // events are not bound to their original target.
        this.isDocumentBound_ = true;
      } else if (e.type == goog.events.EventType.POINTERDOWN) {
        //TODO: handle the MS events.
      }
      // Reset all points
      this.currentPoint_.copy(this.startPoint_);
      this.lastPoint_.copy(this.startPoint_);
      this.longPressDelay_.start();
      // Finally notify listeners.
      this.getTargetComponent().dispatchEvent(pstj.ui.element.EventType.PRESS);

    // MOVE
    } else if (e.type == goog.events.EventType.TOUCHMOVE ||
        e.type == goog.events.EventType.MOUSEMOVE ||
        e.type == goog.events.EventType.POINTERMOVE) {

      if (this.isLocked()) {
        if (e.type == goog.events.EventType.MOUSEMOVE) {
          // cancel event handling if the document is not bound
          if (!this.isDocumentBound_) return;
          // assuming this is coming from the document now...
          var event = this.getMouseEvent(e);
          this.currentPoint_.update(
              event.clientX,
              event.clientY,
              event.timeStamp);

        } else if (e.type == goog.events.EventType.TOUCHMOVE) {
          if (this.getTouchesCount(e) == 1) {
            var touch = this.getTouchByIndex(this.getTouchEvent(e));
            this.currentPoint_.update(
                touch.clientX,
                touch.clientY,
                this.getTouchEvent(e).timeStamp);
          } else {
            // TODO: handle multiple touches.
          }
        } else if (e.type == goog.events.EventType.POINTERMOVE) {
          // TODO: handle pointer events
        }
        this.longPressDelay_.stop();
        if (!this.raf_.isActive()) this.raf_.start();
      }
    // RELEASE
    } else if (e.type == goog.events.EventType.TOUCHEND ||
        e.type == goog.events.EventType.MOUSEUP ||
        e.type == goog.events.EventType.POINTERUP) {

      if (this.isLocked()) {
        if (e.type == goog.events.EventType.TOUCHEND) {
          if (this.getTouchesCount(e) == 0) {
            this.currentPoint_.timestamp = this.getTouchEvent(e).timeStamp;
          } else {
            // TODO: figure out how to handle multiple touches.
            // for now just ignore the event completely
            return;

          }
        } else if (e.type == goog.events.EventType.MOUSEUP) {
          this.currentPoint_.timestamp = this.getMouseEvent(e).timeStamp;
          this.isDocumentBound_ = false;
        } else if (e.type == goog.events.EventType.POINTERUP) {
          // TODO: handle pointer events for IE
        }

        this.raf_.stop();
        this.longPressDelay_.stop();
        this.getTargetComponent().dispatchEvent(
            pstj.ui.element.EventType.RELEASE);

        if (goog.math.Coordinate.distance(
            this.startPoint_, this.currentPoint_) < 2 &&
            this.currentPoint_.timestamp - this.startPoint_.timestamp <
                pstj.agent.Pointer.TapDelay) {
          this.getTargetComponent().dispatchEvent(new pstj.agent.PointerEvent(
              pstj.ui.element.EventType.TAP,
              this.getTargetComponent(), this.sourceElement_));
        }
        // makes sure this does not get stuck.
        this.currentEventType_ = pstj.agent.Pointer.Type.UNKNOWN;
        this.sourceElement_ = null;
        this.unlock(this.currentElement_);
      }
    // CANCEL
    } else if (e.type == goog.events.EventType.TOUCHCANCEL ||
        e.type == goog.events.EventType.POINTERCANCEL) {
      // TODO: handle cancel events
    }
  },


  /**
   * Locks the state machine to a particular element. Once
   * locked all events will be matches agains that element even
   * the mouse events even though they do not follow the
   * element once ouse is outside of it. This makes all event
   * behave like the touch events.
   *
   * @param {Element} element The element to lock to.
   */
  lock: function(element) {
    if (this.isLocked()) throw new Error('Agent already locked');

    this.currentElement_ = element;
    this.currentComponent_ = this.resolveComponent(element);
  },


  /**
   * Inlocks the state machine and allows for other elements to lock in.
   *
   * @param {Element} element The element that was locking state.
   */
  unlock: function(element) {
    if (!this.isLocked() || this.currentElement_ != element) {
      throw new Error('Unlocking with wrong element');
    }
    this.currentElement_ = null;
    this.currentComponent_ = null;
  },


  /**
   * Checks if the events are fixated on an element currently.
   *
   * @return {boolean}
   */
  isLocked: function() {
    return !goog.isNull(this.currentElement_);
  },


  /**
   * Checks how many touches are currently registered.
   *
   * @return {number}
   */
  getTouchesCount: function(e) {
    return this.getTouchEvent(e).touches.length;
  },


  /**
   * Retrieves the desired touch object from the touch event by its index.
   * @param {TouchEvent} e The original browser generated touch event.
   * @param {number=} opt_idx Optional index of the Touch to retrurn.
   * @return {?Touch}
   */
  getTouchByIndex: function(e, opt_idx) {
    var touch = e.touches.item(opt_idx || 0);
    if (!touch) return null;
    return touch;
  },


  /**
   * Wrapper for retrieving the ToucEvent from the wrapped event asserting
   * its identity.
   *
   * @param {goog.events.BrowserEvent} e The wrapped event.
   * @return {TouchEvent} The unwrapped browser event.
   */
  getTouchEvent: function(e) {
    return goog.asserts.assertInstanceof(e.getBrowserEvent(), TouchEvent);
  },

  /**
   * Unwraps the mouse event.
   *
   * @param {goog.events.BrowserEvent} e
   * @return {MouseEvent}
   */
  getMouseEvent: function(e) {
    return goog.asserts.assertInstanceof(e.getBrowserEvent(), MouseEvent);
  },


  /**
   * Getter for the currently locked in component.
   *
   * @return {goog.ui.Component}
   */
  getTargetComponent: function() {
    return this.currentComponent_;
  },


  /**
   * Fires the component LONGPRESS event.
   * @protected
   */
  fireLongPress: function() {
    this.getTargetComponent().dispatchEvent(
        pstj.ui.element.EventType.LONGPRESS);
  },


  /**
   * Provides access to the original source of the event.
   *
   * @return {Element}
   */
  getSourceTarget: function() {
    return this.sourceElement_;
  },


  statics: {
    /**
     * The type of initiation event.
     * @enum {number}
     */
    Type: {
      UNKNOWN: 0,
      TOUCH: 1,
      MOUSE: 2,
      POINTER: 3
    }
  }

});
goog.addSingletonGetter(pstj.agent.Pointer);


/**
 * @define {number} The maximum delay between the initiation of the tap and its
 * end to consider the gesture as tap event.
 */
goog.define('pstj.agent.Pointer.TapDelay', 150);


pstj.agent.Point_ = goog.defineClass(goog.math.Coordinate, {
  /**
   * Notion of timestamped touch / pen / mouse point.
   *
   * @constructor
   * @extends {goog.math.Coordinate}
   * @private
   * @suppress {checkStructDictInheritance}
   */
  constructor: function() {
    goog.math.Coordinate.call(this);
    this.timestamp = 0;
  },


  /**
   * Updates the values of the point.
   * @param {number} x
   * @param {number} y
   * @param {number} timestamp
   */
  update: function(x, y, timestamp) {
    this.x = x;
    this.y = y;
    this.timestamp = timestamp;
  },


  /**
   * Copies the values from another point to the current instance.
   * @param {pstj.agent.Point_} point
   */
  copy: function(point) {
    this.x = point.x;
    this.y = point.y;
    this.timestamp = point.timestamp;
  }
});


pstj.agent.PointerEvent = goog.defineClass(goog.events.Event, {
  /**
   * Provides custom event for higher order events (like TAP for example).
   * This is usedful for decoupling the event listeners from the agent but comes
   * at the cost of producing garbage. One can reduce it by using a simple
   * event instance and update it, however the default event system
   * implementation does not allow for that. We choose to use the default
   * system and create garbage in favor of compatibility.
   *
   * @param {string} type The event type.
   * @param {goog.ui.Component} target The target of the event.
   * @param {Element} source The source element that triggered the creation
   *    of the high level event.
   * @constructor
   * @extends {goog.events.Event}
   * @struct
   * @suppress {checkStructDictInheritance}
   */
  constructor: function(type, target, source) {
    goog.events.Event.call(this, type, target);
    this.source = source;
  },

  /** @override */
  disposeInternal: function() {
    this.source = null;
  }
});
