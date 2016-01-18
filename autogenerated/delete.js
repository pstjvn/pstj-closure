
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.Delete');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var icons = pstj.autogen.iconrenderer;
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'delete' icon */
icons.Delete = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.Delete(model);
  }
});
goog.addSingletonGetter(icons.Delete);


// Register the renderer for icon name
registry.setRenderer('delete', icons.Delete.getInstance());

});  // goog.scope

