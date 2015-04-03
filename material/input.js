goog.provide('pstj.material.Input');
goog.provide('pstj.material.InputRenderer');

goog.require('goog.format.EmailAddress');
goog.require('goog.string');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.InputBase');
goog.require('pstj.material.InputBaseRenderer');
goog.require('pstj.material.State');

goog.scope(function() {
var IB = pstj.material.InputBase;
var IBR = pstj.material.InputBaseRenderer;
var state = goog.ui.Component.State;


/** @extends {IB} */
pstj.material.Input = goog.defineClass(IB, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    IB.call(this, opt_content, opt_renderer, opt_domHelper);
    // Enable additional states used by the material design.
    this.setSupportedState(state.INVISIBLE, true);
    this.setSupportedState(state.TRANSITIONING, true);
  }
});


/** @extends {IBR} */
pstj.material.InputRenderer = goog.defineClass(IBR, {
  constructor: function() {
    IBR.call(this);
  },

  /** @override */
  getCssClass: function() {
    return pstj.material.InputRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.material.template.Input(model);
  },

  statics: {
    /**
    * @type {string}
    * @const
    */
    CSS_CLASS: goog.getCssName('material-input')
  }
});
goog.addSingletonGetter(pstj.material.InputRenderer);

// Register the default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Input,
    pstj.material.InputRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.InputRenderer.CSS_CLASS, function() {
      return new pstj.material.Input(null);
    });

});  // goog.scope
