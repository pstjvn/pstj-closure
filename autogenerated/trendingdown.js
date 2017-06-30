
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.TrendingDown');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'trending-down' icon */
pstj.autogen.iconrenderer.TrendingDown = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.TrendingDown(model);
  }
});
goog.addSingletonGetter(icons.TrendingDown);


// Register the renderer for icon name
registry.setRenderer('trending-down', icons.TrendingDown.getInstance());

});  // goog.scope

