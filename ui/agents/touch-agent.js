goog.provide('pstj.ui.TouchAgent');

goog.require('goog.async.AnimationDelay');
goog.require('goog.async.nextTick');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.Key');
goog.require('pstj.ui.Agent');

/**
 * Provides easy access to touch optimized behaviour for regular control
 * elements (i.e. ones that do not require specific touch bahaviour).
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
};
goog.inherits(pstj.ui.TouchAgent, pstj.ui.Agent);
goog.addSingletonGetter(pstj.ui.TouchAgent);

goog.scope(function() {
  var _ = pstj.ui.TouchAgent.prototype;

  /** @inheritDoc */
  _.updateCache = function(control) {
    // little hack
    this.getCache().set(control.getId(),
      goog.events.listen(control.getElement(),
      [goog.events.EventType.TOUCHSTART, goog.events.EventType.TOUCHMOVE,
      goog.events.EventType.TOUCHEND],
      goog.bind(this.handleTouchEvents, this, control)));
  };

  /** @inheritDoc */
  _.detach = function(control) {
    goog.events.unlistenByKey(/** @type {goog.events.Key} */ (
      this.getCache().get(control.getId())));
    goog.base(this, 'detach', control);
  };

  /**
   * Perform action when RAF-ing
   * @param {number} time The time of the RAF call.
   * @private
   */
  _.onRaf_ = function(time) {
    if (Math.abs(this.touchCache_[0] - this.touchCache_[2]) > 5 ||
      Math.abs(this.touchCache_[1] - this.touchCache_[3]) > 5) {
        this.control_.setActive(false);
    }
  };

  /**
   * Handles the touch events from registered component.
   * @param {goog.ui.Control} control The control instance that is bound to the event handler.
   * @param {goog.events.Event} e The touch event wrapped by Closure.
   * @protected
   */
  _.handleTouchEvents = function(control, e) {
    //e.preventDefault();
    if (e.type == goog.events.EventType.TOUCHSTART) {
      this.touchCache_[0] = e.getBrowserEvent()['changedTouches'][0]['clientX'];
      this.touchCache_[1] = e.getBrowserEvent()['changedTouches'][0]['clientY'];
      this.control_ = control;
      this.control_.setActive(true);
    } else if (e.type == goog.events.EventType.TOUCHMOVE) {
      this.touchCache_[2] = e.getBrowserEvent()['changedTouches'][0]['clientX'];
      this.touchCache_[3] = e.getBrowserEvent()['changedTouches'][0]['clientY'];
      if (!this.raf_.isActive()) {
        this.raf_.start();
      }
    } else if (e.type == goog.events.EventType.TOUCHEND) {
      e.preventDefault();
      this.touchCache_[2] = e.getBrowserEvent()['changedTouches'][0]['clientX'];
      this.touchCache_[3] = e.getBrowserEvent()['changedTouches'][0]['clientY'];
      goog.async.nextTick(function() {
        if (control.isActive()) {
          if (Math.abs(this.touchCache_[0] - this.touchCache_[2]) < 10 &&
            Math.abs(this.touchCache_[1] - this.touchCache_[3]) < 10) {

            control.dispatchEvent(new goog.events.Event(goog.ui.Component.EventType.ACTION,
      control));
          }
          control.setActive(false);
        }
      }, this);
    }
  };
});
