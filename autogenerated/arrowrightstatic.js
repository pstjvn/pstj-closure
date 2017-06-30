
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.ArrowRightStatic');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'arrow-right-static' icon */
pstj.autogen.iconrenderer.ArrowRightStatic = goog.defineClass(IR, {
  constructor: function() {
    IR.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.ArrowRightStatic(model);
  }
});
goog.addSingletonGetter(icons.ArrowRightStatic);


// Register the renderer for icon name
registry.setRenderer('arrow-right-static', icons.ArrowRightStatic.getInstance());

});  // goog.scope

