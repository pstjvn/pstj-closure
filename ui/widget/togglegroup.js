goog.provide('pstj.widget.ToggleGroup');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('pstj.widget.ControlGroup');



/**
 * Provides button group with indication on the last activated button. Can be
 * used as a toggle-exclusive button group. All child buttons are emiting
 * the select event and the widget remembers the last selected item.
 *
 * @constructor
 * @extends {pstj.widget.ControlGroup}
 * @param {pstj.ui.Template=} opt_template Optional template to use for DOM
 * construction.
 * @param {goog.ui.ButtonRenderer=} opt_button_renderer Optional renderer to
 * use for the control buttons.
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


/** @inheritDoc */
pstj.widget.ToggleGroup.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);

  this.forEachChild(function(child) {
    child.setSupportedState(goog.ui.Component.State.SELECTED, true);
    child.setDispatchTransitionEvents(goog.ui.Component.State.SELECTED, true);
  });

  this.currentActive_ = /** @type {pstj.ui.Button} */ (
      this.getChildAt(0));

  this.currentActive_.setSelected(true);
};


/** @inheritDoc */
pstj.widget.ToggleGroup.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
      this.handleButtonAction);
};


/**
 * Retrieves the action name of the selected / toggled button.
 * @return {string} The action name.
 */
pstj.widget.ToggleGroup.prototype.getCheckedAction = function() {
  return this.currentActive_.getActionName() || '';
};


/**
 * Handles the toggle event of a button and makes sure the other buttons are
 * not left toggled.
 * @param {goog.events.Event} e The ACTION button event.
 * @protected
 */
pstj.widget.ToggleGroup.prototype.handleButtonAction = function(e) {
  e.stopPropagation();
  var button = /** @type {pstj.ui.Button} */ (e.target);
  if (button != this.currentActive_) {
    this.currentActive_.setSelected(false);
    this.currentActive_ = button;
    this.currentActive_.setSelected(true);
  }
};
