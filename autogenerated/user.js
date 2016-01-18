
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.User');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var icons = pstj.autogen.iconrenderer;
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'user' icon */
icons.User = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.User(model);
  }
});
goog.addSingletonGetter(icons.User);


// Register the renderer for icon name
registry.setRenderer('user', icons.User.getInstance());

});  // goog.scope

