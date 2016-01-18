
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.TrendingUp');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var icons = pstj.autogen.iconrenderer;
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'trending-up' icon */
icons.TrendingUp = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.TrendingUp(model);
  }
});
goog.addSingletonGetter(icons.TrendingUp);


// Register the renderer for icon name
registry.setRenderer('trending-up', icons.TrendingUp.getInstance());

});  // goog.scope

