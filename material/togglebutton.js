/**
 * @fileoverview Provides the toggle button UI component.
 *
 * By default the newly created toggle buttons are in 'off' state.
 *
 * As currently decoration is not supported/working we assume only imperative
 * creation from a
 *
 */
goog.provide('pstj.material.ToggleButton');
goog.provide('pstj.material.ToggleButtonRenderer');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.RadioButton');
goog.require('pstj.material.State');
goog.require('pstj.material.template');


goog.scope(function() {



/**
 * @constructor
 * @struct
 * @extends {pstj.material.Element}
 * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
 *     to display as the content of the control (if any).
 * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 */
pstj.material.ToggleButton = function(
    opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
  /** @type {string} */
  this.name = '';
  /** @type {number} */
  this.value = 0;
  this.setSupportedState(goog.ui.Component.State.CHECKED, true);
  this.setAutoStates(goog.ui.Component.State.FOCUSED, true);
};
goog.inherits(pstj.material.ToggleButton, pstj.material.Element);


/**
 * Instance created from JSON config.
 * @param {ToggleButtonConfig} json
 * @return {pstj.material.ToggleButton}
 */
pstj.material.ToggleButton.fromJSON = function(json) {
  var i = new pstj.material.ToggleButton();
  i.name = json.name;
  i.value = json.value;
  return i;
};



/**
 * @constructor
 * @struct
 * @extends {pstj.material.ElementRenderer}
 */
pstj.material.ToggleButtonRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.ToggleButtonRenderer,
    pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.ToggleButtonRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.ToggleButtonRenderer.CSS_CLASS = goog.getCssName(
    'material-toggle-button');

var _ = pstj.material.ToggleButton.prototype;
var r = pstj.material.ToggleButtonRenderer.prototype;


/** @inheritDoc */
_.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  var checked = (this.value == 1);
  if (checked) {
    this.setChecked(checked);
    this.getChildAt(0).setChecked(true);
  }
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.getChildAt(0), [
    goog.ui.Component.EventType.CHECK,
    goog.ui.Component.EventType.UNCHECK], this.onCheckedChange);
};


/**
 * Listen for the check state of the child radio button and update our own
 * ckeched state to match.
 * @param {goog.events.Event} e
 * @protected
 */
_.onCheckedChange = function(e) {
  this.setChecked(e.type == goog.ui.Component.EventType.CHECK);
  this.value = this.isChecked() ? 1 : 0;
};


/** @inheritDoc */
r.getCssClass = function() {
  return pstj.material.ToggleButtonRenderer.CSS_CLASS;
};


/** @inheritDoc */
r.getTemplate = function(model) {
  return pstj.material.template.ToggleButton(null);
};


// Define the defaults for the ui system.
goog.ui.registry.setDefaultRenderer(pstj.material.ToggleButton,
    pstj.material.ToggleButtonRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.ToggleButtonRenderer.CSS_CLASS, function() {
      return new pstj.material.ToggleButton(null);
    });

});  // goog.scope
