goog.provide('pstj.material.Fab');
goog.provide('pstj.material.FabRenderer');

goog.require('goog.object');
goog.require('goog.ui.registry');
goog.require('pstj.material.Button');
goog.require('pstj.material.ButtonRenderer');
goog.require('pstj.material.IconContainer');
goog.require('pstj.material.Ripple');
goog.require('pstj.material.Shadow');
goog.require('pstj.material.template');

goog.scope(function() {
var BR = pstj.material.ButtonRenderer;



/**
 * The implementation for the Custom element.
 * @constructor
 * @struct
 * @extends {pstj.material.Button}
 * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
 *     to display as the content of the control (if any).
 * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
 *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 */
pstj.material.Fab = function(opt_content, opt_renderer, opt_domHelper) {
  goog.base(this, opt_content, opt_renderer, opt_domHelper);
  this.activeDepth = 4;
  // by default the FAB is raised
  this.setRaised(true);
};
goog.inherits(pstj.material.Fab, pstj.material.Button);



/**
 * Implements the renderer for the element.
 * @constructor
 * @struct
 * @extends {pstj.material.ButtonRenderer}
 */
pstj.material.FabRenderer = goog.defineClass(BR, {
  constructor: function() {
    goog.base(this);
    this.childrenNames = goog.object.create(
        pstj.material.Button.Children.ICON, 1,
        pstj.material.Button.Children.LABEL, -1,
        pstj.material.Button.Children.RIPPLE, 2,
        pstj.material.Button.Children.SHADOW, 0);
  },


  /** @inheritDoc */
  getCssClass: function() {
    return pstj.material.FabRenderer.CSS_CLASS;
  },


  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.material.template.Fab(model);
  },


  statics: {
    /**
     * @type {string}
     * @final
     */
    CSS_CLASS: goog.getCssName('material-fab')
  }
});
goog.addSingletonGetter(pstj.material.FabRenderer);


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Fab,
    pstj.material.FabRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.FabRenderer.CSS_CLASS, function() {
      return new pstj.material.Fab(null);
    });

});  // goog.scope
