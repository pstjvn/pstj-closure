
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.ArrowLeftStatic');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var icons = pstj.autogen.iconrenderer;
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'arrow-left-static' icon */
icons.ArrowLeftStatic = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.ArrowLeftStatic(model);
  }
});
goog.addSingletonGetter(icons.ArrowLeftStatic);


// Register the renderer for icon name
registry.setRenderer('arrow-left-static', icons.ArrowLeftStatic.getInstance());

});  // goog.scope

