goog.provide('pstj.material.Checkbox');
goog.provide('pstj.material.CheckboxRenderer');

goog.require('goog.events.EventType');
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
 * The implementation for the Custom element.
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
pstj.material.Checkbox = function(opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
  this.setSupportedState(goog.ui.Component.State.CHECKED, true);
  this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
  this.setAutoStates(goog.ui.Component.State.CHECKED, true);
  this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.TAP);
  // We want to be active/slickable by default.
  this.setUsePointerAgent(true);
};
goog.inherits(pstj.material.Checkbox, pstj.material.Element);


/**
 * Creates a new instance from a JSON config.
 * @param {MaterialConfig} json
 */
pstj.material.Checkbox.fromJSON = function(json) {
  var i = new pstj.material.Checkbox();
  pstj.material.Element.fromJSON(json, i);
  if (json && json.checked) {
    i.setChecked(true);
  }
  return i;
};



/**
 * Implements the renderer for the element.
 * @constructor
 * @struct
 * @extends {pstj.material.ElementRenderer}
 */
pstj.material.CheckboxRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.CheckboxRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.CheckboxRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.CheckboxRenderer.CSS_CLASS = goog.getCssName('material-checkbox');


var _ = pstj.material.Checkbox.prototype;
var r = pstj.material.CheckboxRenderer.prototype;


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.getRenderer().getIconElement(this.getElement()),
      goog.events.EventType.ANIMATIONEND, this.onTransitionEnd);
};


/** @inheritDoc */
_.onTap = function(e) {
  if (this.isEnabled()) {
    this.setChecked(!this.isChecked());
    this.setTransitioning(true);
    this.getChildAt(0).onTap(e);
  }
};


/**
 * Handles the end of the animation in the checkbox.
 * @param {goog.events.Event} e The event on end of animation.
 * @protected
 */
_.onTransitionEnd = function(e) {
  this.setTransitioning(false);
};


/** @inheritDoc */
r.getCssClass = function() {
  return pstj.material.CheckboxRenderer.CSS_CLASS;
};


/** @inheritDoc */
r.getTemplate = function(model) {
  return pstj.material.template.Checkbox(model);
};


/** @inheritDoc */
r.getContentElement = function(el) {
  return goog.dom.getElementByClass(goog.getCssName(this.getCssClass(),
      'content'), el);
};


/**
 * Getter for the icon element. We need it in the control to setup
 * animations.
 * @param {Element} el
 * @return {Element}
 */
r.getIconElement = function(el) {
  return goog.dom.getElementByClass(goog.getCssName(this.getCssClass(),
      'icon'), el);
};


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Checkbox,
    pstj.material.CheckboxRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.CheckboxRenderer.CSS_CLASS, function() {
      return new pstj.material.Checkbox(null);
    });

});  // goog.scope
