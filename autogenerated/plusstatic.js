
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.PlusStatic');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'plus-static' icon */
pstj.autogen.iconrenderer.PlusStatic = goog.defineClass(IR, {
  constructor: function() { IR.call(this); },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.PlusStatic(model);
  }
});
goog.addSingletonGetter(icons.PlusStatic);


// Register the renderer for icon name
registry.setRenderer('plus-static', icons.PlusStatic.getInstance());

});  // goog.scope
