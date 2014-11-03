goog.provide('pstj.material.RadioButton');
goog.provide('pstj.material.RadioButtonRenderer');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.Ripple');
goog.require('pstj.material.State');
goog.require('pstj.material.template');


goog.scope(function() {



/**
 * Provides implementation for the material radio button.
 * @constructor
 * @extends {pstj.material.Element}
 * @struct
 * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
 *     to display as the content of the control (if any).
 * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 */
pstj.material.RadioButton = function(opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
  /** @type {string} */
  this.name = '';
  /** @type {string} */
  this.value = '';
  this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.TAP);
  this.setSupportedState(goog.ui.Component.State.CHECKED, true);
  this.setAutoStates(goog.ui.Component.State.FOCUSED |
      goog.ui.Component.State.DISABLED, true);
  this.setDispatchTransitionEvents(goog.ui.Component.State.FOCUSED |
      goog.ui.Component.State.DISABLED |
      goog.ui.Component.State.CHECKED, true);

  this.setUsePointerAgent(true);
};
goog.inherits(pstj.material.RadioButton, pstj.material.Element);



/**
 * Provides the default renderer for the radio button implementation.
 * @constructor
 * @extends {pstj.material.ElementRenderer}
 */
pstj.material.RadioButtonRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.RadioButtonRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.RadioButtonRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.RadioButtonRenderer.CSS_CLASS = goog.getCssName(
    'material-radio-button');


// Define our aliases
var _ = pstj.material.RadioButton.prototype;
var r = pstj.material.RadioButtonRenderer.prototype;


/** @inheritDoc */
_.decorateInternal = function(el) {
  var label = el.getAttribute('label');
  if (label) {
    this.setContent(label);
  }
  goog.base(this, 'decorateInternal', el);
  this.setChecked(el.hasAttribute('checked'));
  if (!this.name) this.name = el.getAttribute('name') || '';
  if (!this.value) this.value = el.getAttribute('value') || '';
};


/** @inheritDoc */
_.onTap = function(e) {
  this.setChecked(!this.isChecked());
};


/** @inheritDoc */
r.getCssClass = function() {
  return pstj.material.RadioButtonRenderer.CSS_CLASS;
};


/** @inheritDoc */
r.getTemplate = function(model) {
  return pstj.material.template.RadioButton(model);
};


/**
 * @override
 * @return {{label: string}}
 */
r.generateTemplateData = function(control) {
  var c = control.getContent();
  return {
    label: ((c) ? c.toString() : ''),
    name: control.name,
    value: control.value
  };
};


// Define the defaults for the ui system.
goog.ui.registry.setDefaultRenderer(pstj.material.RadioButton,
    pstj.material.RadioButtonRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.RadioButtonRenderer.CSS_CLASS, function() {
      return new pstj.material.RadioButton(null);
    });

});  // goog.scope
