
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.Facebook');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'facebook' icon */
pstj.autogen.iconrenderer.Facebook = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.Facebook(model);
  }
});
goog.addSingletonGetter(icons.Facebook);


// Register the renderer for icon name
registry.setRenderer('facebook', icons.Facebook.getInstance());

});  // goog.scope

