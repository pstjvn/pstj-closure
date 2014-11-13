goog.provide('pstj.material.Panel');

goog.require('goog.ui.Component.State');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Shadow');
goog.require('pstj.material.State');

goog.scope(function() {
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;
var Shadow = pstj.material.Shadow;
var State = goog.ui.Component.State;


/**
 * Implements a regular panel that can be screened and can have shadow as well.
 */
pstj.material.Panel = goog.defineClass(E, {
  /**
   * @constructor
   * @extends {E}
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
    this.setSupportedState(State.SCRIM, true);
  },


  /**
   * Getter for the shadow element.
   * @return {Shadow}
   */
  getShadow: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(0), Shadow);
  },


  /**
   * Getter for the scrim element.
   * @return {E}
   */
  getScrim: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(1), E);
  },


  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.setShadow(this.isShadow());
  },

  setShadow: function(enable) {
    goog.base(this, 'setShadow', enable);
    if (this.getElement()) {
      this.getShadow().setDepth(enable ? this.shadowDepth : 0);
    }
  }
});


/** Implementeation for the default renderer */
pstj.material.PanelRenderer = goog.defineClass(ER, {
  /**
   * @constructor
   * @extends {ER}
   */
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
