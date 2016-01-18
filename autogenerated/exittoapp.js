
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.ExitToApp');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var icons = pstj.autogen.iconrenderer;
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'exit-to-app' icon */
icons.ExitToApp = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.ExitToApp(model);
  }
});
goog.addSingletonGetter(icons.ExitToApp);


// Register the renderer for icon name
registry.setRenderer('exit-to-app', icons.ExitToApp.getInstance());

});  // goog.scope

