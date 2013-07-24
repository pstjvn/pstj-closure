goog.provide('pstj.ui.TouchAgent');

goog.require('goog.async.nextTick');
goog.require('goog.events');
goog.require('goog.events.EventType');
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
  this.touchCache_ = [0, 0, 0, 0];
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
      [goog.events.EventType.TOUCHSTART, goog.events.EventType.TOUCHEND],
      goog.bind(this.handleTouchEvents, this, control)));
  };

  /** @inheritDoc */
  _.detach = function(control) {
    goog.events.unlistenByKey(this.getCache().get(control.getId()));
    goog.base(this, 'detach', control);
  };

  /**
   * Handles the touch events from registered component.
   * @param {goog.ui.Control} control The control instance that is bound to the event handler.
   * @param {goog.events.Event} e The touch event wrapped by Closure.
   * @protected
   */
  _.handleTouchEvents = function(control, e) {
    e.preventDefault();
    if (e.type == goog.events.EventType.TOUCHSTART) {
      this.touchCache_[0] = e.getBrowserEvent()['changedTouches'][0]['clientX'];
      this.touchCache_[1] = e.getBrowserEvent()['changedTouches'][0]['clientY'];
      goog.async.nextTick(function() {
        control.setActive(true);
      });
    } else if (e.type == goog.events.EventType.TOUCHEND) {
      this.touchCache_[2] = e.getBrowserEvent()['changedTouches'][0]['clientX'];
      this.touchCache_[3] = e.getBrowserEvent()['changedTouches'][0]['clientY'];
      goog.async.nextTick(function() {
        if (control.isActive()) {
          if (Math.abs(this.touchCache_[0] - this.touchCache_[2]) < 10 &&
            Math.abs(this.touchCache_[1] - this.touchCache_[3]) < 10) {

            control.performActionInternal(e);
          }
          control.setActive(false);
        }
      }, this);
    }
  };
});
