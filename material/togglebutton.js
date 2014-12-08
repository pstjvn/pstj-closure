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
 * The component is a rip off of the radio button component and as such does
 * not have its own logic, is timply follows the commands of the sub-component.
 *
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
  /**
   * The name of the item - useful for form controllers.
   * @type {string}
   */
  this.name = '';
  /**
   * Accessor for the value of the toggle button (0 or 1) - useful for form
   * controllers. Note that the value is not taken from the HTML, instead it is
   * a utility accessor for the state of the toggle button.
   * @type {number}
   */
  this.value = 0;

  this.setSupportedState(goog.ui.Component.State.CHECKED, true);
  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
  this.setAutoStates(goog.ui.Component.State.FOCUSED, true);
  this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.TAP);
  this.setUsePointerAgent(true);
};
goog.inherits(pstj.material.ToggleButton, pstj.material.Element);



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
  var e = this.getElementStrict();
  this.name = e.getAttribute('name') || '';
};


/** @inheritDoc */
_.onTap = function(e) {
  if (this.isEnabled()) {
    this.setChecked(!this.isChecked());
    this.getChildAt(0).getChildAt(0).onTap(e);
  }
};


/**
 * Overriding this method so that we can have the chance to sync the states
 * of the main component with its internal sub-component.
 * @override
 */
_.addMaterialChildren = function() {
  goog.base(this, 'addMaterialChildren');
  var radio = /** @type {pstj.material.RadioButton} */ (this.getChildAt(0));
  // make sure the radio does not subscribe to the pointer agent.
  radio.setUsePointerAgent(false);
  // Synchronize visual states with sub-component (radio button);
  if (this.isEnabled()) radio.setEnabled(true);
  else {
    this.setEnabled(true);
    radio.setEnabled(false);
    this.setEnabled(false);
  }
  radio.setChecked(this.isChecked());
};


/** @inheritDoc */
_.setChecked = function(enable) {
  goog.base(this, 'setChecked', enable);
  // Sync child.
  if (this.getChildCount() > 0) {
    this.getChildAt(0).setChecked(enable);
  }
  this.value = enable ? 1 : 0;
};


/** @inheritDoc */
_.setEnabled = function(enable) {
  if (this.getChildCount() > 0) {
    // Sync child
    if (enable) {
      goog.base(this, 'setEnabled', true);
      this.getChildAt(0).setEnabled(true);
    } else {
      this.getChildAt(0).setEnabled(false);
      goog.base(this, 'setEnabled', false);
    }
  } else {
    goog.base(this, 'setEnabled', enable);
  }
};


/** @inheritDoc */
r.getCssClass = function() {
  return pstj.material.ToggleButtonRenderer.CSS_CLASS;
};


/** @inheritDoc */
r.getTemplate = function(model) {
  return pstj.material.template.ToggleButton(model);
};


/** @inheritDoc */
r.generateTemplateData = function(control) {
  goog.asserts.assertInstanceof(control, pstj.material.ToggleButton);
  return {
    name: control.name
  };
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
