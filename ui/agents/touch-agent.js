/**
 * @fileoverview Provides easy to use 'touch enabled' behaviour for controls
 * to allow the controls to react fast on touch events / mobile (i.e. shortcuts
 * the 300ms delays). It does not change the behaviour of the component in any
 * way, it only fires the ACTION event.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.ui.TouchAgent');

goog.require('goog.asserts');
goog.require('goog.async.nextTick');
goog.require('goog.async.AnimationDelay');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.Key');
goog.require('pstj.configure');
goog.require('pstj.ui.Agent');



/**
 * Provides easy access to touch optimized behaviour for regular control
 * elements (i.e. ones that do not require specific touch bahaviour). A control
 * can attach in the 'enterDocument' call as the agent guards against
 * duplicating the subscription thus numerous enters and exits of the document
 * during the lifecile of the component are allowed. The agent will unsubscribe
 * the components automatically on its disposal. Alternatively attach the
 * component at any time after it obtains reference to its element.
 *
 * @constructor
 * @extends {pstj.ui.Agent}
 */
pstj.ui.TouchAgent = function() {
  goog.base(this, null);
  /**
   * Holds the cache for the touch points
   * @type {Array.<number>}
   * @private
   */
  this.touchCache_ = [0, 0, 0, 0, 0];
  /**
   * A RAF implementation for the drawing
   * @type {goog.async.AnimationDelay}
   * @private
   */
  this.raf_ = new goog.async.AnimationDelay(this.onRaf_, undefined, this);
  /**
   * Reference to the current control that is being touched
   * @type {goog.ui.Control}
   * @private
   */
  this.control_ = null;
  /**
   * Locked state. If a control has locked on touch we should not let other
   * controls take over. Touch events should always remain in the same target.
   * @type {boolean}
   * @private
   */
  this.isLocked_ = false;
};
goog.inherits(pstj.ui.TouchAgent, pstj.ui.Agent);
goog.addSingletonGetter(pstj.ui.TouchAgent);


/**
 * The cache positions.
 * @enum {number}
 */
pstj.ui.TouchAgent.Cache = {
  TOUCH_START_X: 0,
  TOUCH_START_Y: 1,
  LAST_TOUCH_X: 2,
  LAST_TOUCH_Y: 3,
  SHOULD_ACTIVATE: 4
};

/**
 * @type {number}
 */
pstj.ui.TouchAgent.TOUCH_TRESHOLD = goog.asserts.assertNumber(
    pstj.configure.getRuntimeValue('TOUCH_TRESHOLD', 10, 'PSTJ.TOUCH'));


/** @inheritDoc */
pstj.ui.TouchAgent.prototype.updateCache = function(control) {
  // little hack, we need this to be a control instance as we use the 'set*'
  // methods from it.
  // At compile time with DEBUG turned off this will be stripped out.
  goog.asserts.assertInstanceof(control, goog.ui.Control,
      'The touch agent is designed for Control elements');

  // make sure there is actually such element.
  if (goog.isDefAndNotNull(control.getElement())) {
    this.getCache().set(control.getId(),
        goog.events.listen(control.getElement(),
        [
          goog.events.EventType.TOUCHSTART,
          goog.events.EventType.TOUCHMOVE,
          goog.events.EventType.TOUCHEND,
          goog.events.EventType.TOUCHCANCEL],
        goog.bind(this.handleTouchEvents, this, control)));
  } else {
    throw new Error('Touch agent should be attached only when component ' +
        'already has its dom element.');
  }
};


/** @inheritDoc */
pstj.ui.TouchAgent.prototype.detach = function(control) {
  goog.events.unlistenByKey(/** @type {goog.events.Key} */ (
      this.getCache().get(control.getId())));

  // prevent accessing controls that are no longer in the document.
  if (control == this.control_) {
    if (this.raf_.isActive()) {
      this.raf_.stop();
    }
  }

  goog.base(this, 'detach', control);
};


/**
 * Perform action when RAF-ing. Just monitor if the move treshold has been
 * passed and disable the component if yes.
 *
 * @param {number} time The time of the RAF call.
 * @private
 */
pstj.ui.TouchAgent.prototype.onRaf_ = function(time) {
  if (Math.abs(this.touchCache_[0] - this.touchCache_[2]) >
      pstj.ui.TouchAgent.TOUCH_TRESHOLD ||
      Math.abs(this.touchCache_[1] - this.touchCache_[3]) >
      pstj.ui.TouchAgent.TOUCH_TRESHOLD) {
    this.control_.setActive(false);
  } else {
    if (!this.control_.isActive()) {
      this.control_.setActive(true);
    }
  }
};


/**
 * Handles the touch events from registered component.
 *
 * @param {goog.ui.Control} control The control instance that is bound to the
 * event handler.
 * @param {goog.events.Event} e The touch event wrapped by Closure.
 * @protected
 */
pstj.ui.TouchAgent.prototype.handleTouchEvents = function(control, e) {
  if (e.type == goog.events.EventType.TOUCHSTART && !this.isLocked_) {
    this.isLocked_ = true;
    this.touchCache_[0] = e.getBrowserEvent()['changedTouches'][0]['clientX'];
    this.touchCache_[1] = e.getBrowserEvent()['changedTouches'][0]['clientY'];
    this.touchCache_[2] = this.touchCache_[0];
    this.touchCache_[3] = this.touchCache_[1];
    this.control_ = control;
    if (!this.control_.isActive()) {
      if (!this.raf_.isActive()) {
        this.raf_.start();
      }
    }
  } else if (e.type == goog.events.EventType.TOUCHMOVE) {
    this.touchCache_[2] = e.getBrowserEvent()['changedTouches'][0]['clientX'];
    this.touchCache_[3] = e.getBrowserEvent()['changedTouches'][0]['clientY'];
    if (this.control_.isActive()) {
      if (!this.raf_.isActive()) {
        this.raf_.start();
      }
    }
  } else if (e.type == goog.events.EventType.TOUCHEND) {
    e.preventDefault();
    this.touchCache_[2] = e.getBrowserEvent()['changedTouches'][0]['clientX'];
    this.touchCache_[3] = e.getBrowserEvent()['changedTouches'][0]['clientY'];
    if (control.isActive()) {
      if (Math.abs(this.touchCache_[0] - this.touchCache_[2]) <
          pstj.ui.TouchAgent.TOUCH_TRESHOLD &&
          Math.abs(this.touchCache_[1] - this.touchCache_[3]) <
          pstj.ui.TouchAgent.TOUCH_TRESHOLD) {

        goog.async.nextTick(function() {
          this.isLocked_ = false;
          control.dispatchEvent(new goog.events.Event(
              goog.ui.Component.EventType.ACTION, control));
        }, this);

      } else {
        this.isLocked_ = false;
      }
      control.setActive(false);
    } else {
      this.isLocked_ = false;
    }
  } else if (e.type == goog.events.EventType.TOUCHCANCEL) {
    if (this.control_.isActive()) {
      this.control_.setActive(false);
    }
    this.isLocked_ = false;
  }
};
