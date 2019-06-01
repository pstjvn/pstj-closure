
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.CastReady');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'cast-ready' icon */
pstj.autogen.iconrenderer.CastReady = goog.defineClass(IR, {
  constructor: function() { IR.call(this); },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.CastReady(model);
  }
});
goog.addSingletonGetter(icons.CastReady);


// Register the renderer for icon name
registry.setRenderer('cast-ready', icons.CastReady.getInstance());
registry.setRenderer('cast-active', icons.CastReady.getInstance());

});  // goog.scope
