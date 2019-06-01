
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.Reload');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'reload' icon */
pstj.autogen.iconrenderer.Reload = goog.defineClass(IR, {
  constructor: function() { IR.call(this); },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.Reload(model);
  }
});
goog.addSingletonGetter(icons.Reload);


// Register the renderer for icon name
registry.setRenderer('reload', icons.Reload.getInstance());

});  // goog.scope
