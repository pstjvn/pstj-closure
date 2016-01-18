
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.Google');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var icons = pstj.autogen.iconrenderer;
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'google' icon */
icons.Google = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.Google(model);
  }
});
goog.addSingletonGetter(icons.Google);


// Register the renderer for icon name
registry.setRenderer('google', icons.Google.getInstance());

});  // goog.scope

