
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.Download');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'download' icon */
pstj.autogen.iconrenderer.Download = goog.defineClass(IR, {
  constructor: function() { IR.call(this); },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.Download(model);
  }
});
goog.addSingletonGetter(icons.Download);


// Register the renderer for icon name
registry.setRenderer('download', icons.Download.getInstance());

});  // goog.scope
