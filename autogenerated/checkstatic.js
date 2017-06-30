
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.CheckStatic');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'check-static' icon */
pstj.autogen.iconrenderer.CheckStatic = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.CheckStatic(model);
  }
});
goog.addSingletonGetter(icons.CheckStatic);


// Register the renderer for icon name
registry.setRenderer('check-static', icons.CheckStatic.getInstance());

});  // goog.scope

