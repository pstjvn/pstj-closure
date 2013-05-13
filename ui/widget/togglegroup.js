goog.provide('pstj.widget.ToggleGroup');

goog.require('pstj.widget.ControlGroup');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Component.EventType');
/**
 * My new class description
 * @constructor
 * @extends {pstj.widget.ControlGroup}
 * @param {pstj.ui.Template=} opt_template Optional template to use for DOM
 *   construction.
 * @param {goog.ui.ButtonRenderer=} opt_button_renderer Optional renderer to
 *   use for the control buttons.
 */
pstj.widget.ToggleGroup = function(opt_template, opt_button_renderer) {
  goog.base(this, opt_template, opt_button_renderer);
  /**
   * The currently active child.
   * @type {pstj.ui.Button}
   * @private
   */
  this.currentActive_ = null;
};
goog.inherits(pstj.widget.ToggleGroup, pstj.widget.ControlGroup);

goog.scope(function() {

  var _ = pstj.widget.ToggleGroup.prototype;

  /** @inheritDoc */
  _.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    this.currentActive_ = /** @type {pstj.ui.Button} */ (
      this.getChildAt(0));
    this.currentActive_.setState(goog.ui.Component.State.SELECTED, true);
  };

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
      this.handleButtonAction);
  };

  /**
   * Handles the toggle event of a button and makes sure the other buttons are
   *   not left toggled.
   * @param {goog.events.Event} e The ACTION button event.
   * @protected
   */
  _.handleButtonAction = function(e) {
    var button = /** @type {pstj.ui.Button} */ (e.target);
    if (button != this.currentActive_) {
      this.currentActive_.setState(goog.ui.Component.State.SELECTED, false);
      this.currentActive_ = button;
      this.currentActive_.setState(goog.ui.Component.State.SELECTED, true);
  };

});
