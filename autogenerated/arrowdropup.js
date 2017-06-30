
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.ArrowDropUp');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'arrow-drop-up' icon */
pstj.autogen.iconrenderer.ArrowDropUp = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.ArrowDropUp(model);
  }
});
goog.addSingletonGetter(icons.ArrowDropUp);


// Register the renderer for icon name
registry.setRenderer('arrow-drop-up', icons.ArrowDropUp.getInstance());

});  // goog.scope

