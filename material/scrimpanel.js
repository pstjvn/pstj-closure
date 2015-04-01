/**
 * @fileoverview Provides a very simple panel element that has an overlay which
 * can be hidden/shown on demand.
 *
 * The main use case is in the drawer panel, where we
 * need to overlap the main panel's content when the drawer panel is on top of
 * it in order to be able to focus the user attention on the side/drawer.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.ScrimPanel');
goog.provide('pstj.material.ScrimPanelRenderer');

goog.require('goog.asserts');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.ScrimPanelRenderer');


goog.scope(function() {
var ER = pstj.material.ElementRenderer;


/**
 * @extends {pstj.material.Element}
 */
pstj.material.ScrimPanel = goog.defineClass(pstj.material.Element, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
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


/**
 * @extends {ER}
 */
pstj.material.ScrimPanelRenderer = goog.defineClass(ER, {
  constructor: function() {
    ER.call(this);
  },

  /** @override */
  getCssClass: function() {
    return pstj.material.ScrimPanelRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.material.template.ScrimPanel(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('scrim-panel')
  }
});


goog.addSingletonGetter(pstj.material.ScrimPanelRenderer);


goog.ui.registry.setDefaultRenderer(pstj.material.ScrimPanel,
    pstj.material.ScrimPanelRenderer);


goog.ui.registry.setDecoratorByClassName(
    pstj.material.ScrimPanelRenderer.CSS_CLASS, function() {
      return new pstj.material.ScrimPanel(null);
    });

});  // goog.scope

