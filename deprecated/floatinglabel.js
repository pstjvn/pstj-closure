goog.provide('pstj.material.FloatingLabel');
goog.provide('pstj.material.FloatingLabelRenderer');

goog.require('goog.dom');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.State');
goog.require('pstj.material.template');



/**
 * Provides the renderer abstraction for the floating label helper
 * element.
 * @constructor
 * @extends {pstj.material.ElementRenderer}
 * @struct
 */
pstj.material.FloatingLabelRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.FloatingLabelRenderer,
    pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.FloatingLabelRenderer);


/**
 * The CSS class name to recognize the floating label for an input.
 * @type {string}
 * @final
 */
pstj.material.FloatingLabelRenderer.CSS_CLASS = goog.getCssName(
    'floating-label');


/** @override */
pstj.material.FloatingLabelRenderer.prototype.getTemplate = function(m) {
  return pstj.material.template.FloatingLabel(m);
};


/** @override */
pstj.material.FloatingLabelRenderer.prototype.generateTemplateData = function(
    control) {
  return {
    label: control.getContent()
  };
};


/** @override */
pstj.material.FloatingLabelRenderer.prototype.setContent = function(
    element, content) {
  // we require the content to be a string...
  goog.asserts.assertString(content);
  goog.dom.setTextContent(
      goog.dom.getElementByClass(
          goog.getCssName(
              pstj.material.FloatingLabelRenderer.CSS_CLASS, 'text'),
          element), content);
};


/** @override */
pstj.material.FloatingLabelRenderer.prototype.getCssClass = function() {
  return pstj.material.FloatingLabelRenderer.CSS_CLASS;
};



/**
 * Provides the optional floating label for the material input.
 * This is a very simple element, internally used by the input.
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
pstj.material.FloatingLabel = function(
    opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
  this.setSupportedState(goog.ui.Component.State.INVISIBLE, true);
};
goog.inherits(pstj.material.FloatingLabel, pstj.material.Element);


/** @override */
pstj.material.FloatingLabel.prototype.setVisible = function(visible) {
  if (this.hasState(goog.ui.Component.State.INVISIBLE) == visible) {
    this.setState(goog.ui.Component.State.INVISIBLE, !visible);
    return true;
  }
  return false;
};


/** @override */
pstj.material.FloatingLabel.prototype.isVisible = function() {
  return !this.hasState(goog.ui.Component.State.INVISIBLE);
};


// Register the default renderer for this class/element.
goog.ui.registry.setDefaultRenderer(pstj.material.FloatingLabel,
    pstj.material.FloatingLabelRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.FloatingLabelRenderer.CSS_CLASS, function() {
      return new pstj.material.FloatingLabel(null);
    });
