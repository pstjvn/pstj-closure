/**
 * @fileoverview Provides a very simple panel element that has an overlay which
 * can be hidden/shown on demand. The main use in the drawer panel, where we
 * need to 'overlap' the main panel's content when the drawer panel is on top of
 * it in order to be able to focus the user attention on the side/drawer.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.ScrimPanel');

goog.require('goog.asserts');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ScrimPanelRenderer');


goog.scope(function() {


/**
 * Implements the main panel for the drawer panel with a scrim overlay.
 */
pstj.material.ScrimPanel = goog.defineClass(pstj.material.Element, {
  /**
   * Implementation for a main panel with scrim overlay. The element is designed
   * to be fully covered by an overlay that reacts on taping.
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   * @constructor
   * @extends {pstj.material.Element}
   * @struct
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
  },


  /**
   * Retrieves the last child in the container - it should be the scrim overlay.
   * @return {pstj.material.Element}
   */
  getScrim: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(
        this.getChildCount() - 1), pstj.material.Element);
  }

});


goog.ui.registry.setDefaultRenderer(pstj.material.ScrimPanel,
    pstj.material.ScrimPanelRenderer);


goog.ui.registry.setDecoratorByClassName(
    pstj.material.ScrimPanelRenderer.CSS_CLASS, function() {
      return new pstj.material.ScrimPanel(null);
    });

});  // goog.scope

