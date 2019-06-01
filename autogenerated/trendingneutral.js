
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.TrendingNeutral');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'trending-neutral' icon */
pstj.autogen.iconrenderer.TrendingNeutral = goog.defineClass(IR, {
  constructor: function() { IR.call(this); },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.TrendingNeutral(model);
  }
});
goog.addSingletonGetter(icons.TrendingNeutral);


// Register the renderer for icon name
registry.setRenderer('trending-neutral', icons.TrendingNeutral.getInstance());

});  // goog.scope
