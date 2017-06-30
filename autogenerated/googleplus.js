
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.GooglePlus');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'google-plus' icon */
pstj.autogen.iconrenderer.GooglePlus = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.GooglePlus(model);
  }
});
goog.addSingletonGetter(icons.GooglePlus);


// Register the renderer for icon name
registry.setRenderer('google-plus', icons.GooglePlus.getInstance());

});  // goog.scope

