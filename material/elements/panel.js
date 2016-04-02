/**
 * @fileoverview Provides basic element to be used as panel.
 *
 * By itself the panel is just a conatiner element.
 *
 * In additional it has two children elements that can be used in relation to
 * the panel state:
 *
 * * shadow element attached to it for raising the panel visually
 * * scrim element to protect the panel content from interaction (similar to
 * guarding overlay)
 *
 * The panel can be used on its own, but the design is influenced to in such
 * a way as to be useful for the drawer panel implementation.
 */

goog.provide('pstj.material.Panel');
goog.provide('pstj.material.PanelRenderer');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Shadow');
/** @suppress {extraRequire} */
goog.require('pstj.material.State');
goog.require('pstj.material.template');


goog.scope(function() {
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;
var Shadow = pstj.material.Shadow;
var State = goog.ui.Component.State;


/**
 * @extends {E}
 */
pstj.material.Panel = goog.defineClass(E, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    goog.base(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * The shadow depth to apply when the panel is shadowed.
     * @type {number}
     * @protected
     */
    this.shadowDepth = 1;
    this.setSupportedState(State.SHADOW, true);
    this.setSupportedState(State.OVERLAY, true);
  },

  /**
   * Returns the shadow component - should be a child of the panel.
   *
   * The method is considered protected and should be only accessed by
   * extending classes.
   *
   * @package
   * @return {Shadow}
   */
  getShadowComponent: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(0), Shadow);
  },

  /**
   * Returns the overlay component - should be a child of the panel instance.
   *
   * The method is considered protected and should be only accessed from
   * extenders.
   *
   * @package
   * @return {E}
   */
  getOverlayComponent: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(
        this.getChildCount() - 1), E);
  },

  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.setShadow(this.isShadow());
  },

  /** @override */
  setShadow: function(enable) {
    goog.base(this, 'setShadow', enable);
    if (this.getElement()) {
      this.getShadowComponent().setDepth(enable ? this.shadowDepth : 0);
    }
  }
});


/** @extends {ER} */
pstj.material.PanelRenderer = goog.defineClass(ER, {
  constructor: function() {
    goog.base(this);
  },

  /** @inheritDoc */
  getTemplate: function(m) {
    return pstj.material.template.Panel(m);
  },


  /** @inheritDoc */
  getCssClass: function() {
    return pstj.material.PanelRenderer.CSS_CLASS;
  },

  /**
   * Attempts to find where to put all the children that are added.
   * @param {Element} rootElement
   * @return {Element} The element to put children in.
   */
  getContentElement: function(rootElement) {
    return goog.dom.getElementByClass(
        goog.getCssName(this.getCssClass(), 'content-holder'),
        rootElement);
  },

  statics: {
    /**
     * @type {string}
     * @final
     */
    CSS_CLASS: goog.getCssName('material-panel')
  }
});


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Panel,
    pstj.material.PanelRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.PanelRenderer.CSS_CLASS, function() {
      return new pstj.material.Panel(null);
    });

});  // goog.scope
