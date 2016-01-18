
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.Menu');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var icons = pstj.autogen.iconrenderer;
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'menu' icon */
icons.Menu = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.Menu(model);
  }
});
goog.addSingletonGetter(icons.Menu);


// Register the renderer for icon name
registry.setRenderer('menu', icons.Menu.getInstance());
registry.setRenderer('close', icons.Menu.getInstance());
registry.setRenderer('plus', icons.Menu.getInstance());
registry.setRenderer('check', icons.Menu.getInstance());
registry.setRenderer('back-arrow', icons.Menu.getInstance());
registry.setRenderer('forward-arrow', icons.Menu.getInstance());

});  // goog.scope

