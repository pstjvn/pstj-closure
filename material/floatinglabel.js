goog.provide('pstj.material.FloatingLabel');

goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.FloatingLabelRenderer');



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
};
goog.inherits(pstj.material.FloatingLabel, pstj.material.Element);


// Register the default renderer for this class/element.
goog.ui.registry.setDefaultRenderer(pstj.material.FloatingLabel,
    pstj.material.FloatingLabelRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.FloatingLabelRenderer.CSS_CLASS, function() {
      return new pstj.material.FloatingLabel(null);
    });
