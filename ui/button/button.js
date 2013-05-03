goog.provide('pstj.ui.Button');

goog.require('goog.dom.dataset');
goog.require('goog.events.EventType');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.registry');
goog.require('pstj.ui.CustomButtonRenderer');

/**
 * Provides shorthand for our button. The button is also optimized for touch
 *   events (i.e. it handles the touches directly and thus is much more
 *   responsive than regular buttons that awai the click simulation).
 * @constructor
 * @param {goog.ui.ButtonRenderer=} opt_renderer Optional renderer to use.
 * @extends {goog.ui.CustomButton}
 */
pstj.ui.Button = function(opt_renderer) {
  goog.base(this, '', opt_renderer ||
    pstj.ui.CustomButtonRenderer.getInstance());
  /**
   * @private
   * @type {Array.<number>}
   */
  this.cache_ = [0, 0];
};
goog.inherits(pstj.ui.Button, goog.ui.CustomButton);

/**
 * Custom method to allow the templates to give names to the actions and thus
 *   allow controllers to bind indirectly to component and sub-component
 *   actions.
 * @return {?string} The action name if any, null if none.
 */
pstj.ui.Button.prototype.getActionName = function() {
  return goog.dom.dataset.get(this.getElement(), 'action');
};

/** @inheritDoc */
pstj.ui.Button.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.getElement(),
    goog.events.EventType.TOUCHSTART, this.handleTouchStart);
  this.getHandler().listen(this.getElement(),
    goog.events.EventType.TOUCHEND, this.handleTouchEnd);
};

/** @inheritDoc */
pstj.ui.Button.prototype.disposeInternal = function() {
  this.cache_ = null;
  goog.base(this, 'disposeInternal');
};

/**
 * Handles the touch start on buttons.
 * @param {goog.events.Event} e The touchstart event.
 * @protected
 */
pstj.ui.Button.prototype.handleTouchStart = function(e) {
  e.preventDefault();
  this.cache_[0] = e.getBrowserEvent()['changedTouches'][0]['clientX'];
  this.cache_[1] = e.getBrowserEvent()['changedTouches'][0]['clientY'];
  this.setActive(true);
};

/**
 * Handles the touch end event.
 * @param {goog.events.Event} e The touchend event.
 * @protected
 */
pstj.ui.Button.prototype.handleTouchEnd = function(e) {
  e.preventDefault();
  if (this.isActive()) {
    if (Math.abs(this.cache_[0] -
      e.getBrowserEvent()['changedTouches'][0]['clientX']) < 10 &&
      Math.abs(this.cache_[1] -
        e.getBrowserEvent()['changedTouches'][0]['clientY']) < 10) {

      this.performActionInternal(e);
    }
    this.setActive(false);
  }
};

// Register a decorator factory function for pstj.ui.Button
goog.ui.registry.setDecoratorByClassName(pstj.ui.CustomButtonRenderer.CSS_CLASS,
  function() {
    return new pstj.ui.Button();
  });
