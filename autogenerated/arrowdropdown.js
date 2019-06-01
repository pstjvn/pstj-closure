
// File auto-generated, please do not edit
goog.provide('pstj.autogen.iconrenderer.ArrowDropDown');

goog.require('pstj.autogen.template.icons');
goog.require('pstj.material.IconRenderer');
goog.require('pstj.material.icons.registry');

goog.scope(function() {
var IR = pstj.material.IconRenderer;
var registry = pstj.material.icons.registry;


/** Renderer for 'arrow-drop-down' icon */
pstj.autogen.iconrenderer.ArrowDropDown = goog.defineClass(IR, {
  constructor: function() { IR.call(this); },

  /** @inheritDoc */
  getTemplate: function(model) {
    return pstj.autogen.template.icons.ArrowDropDown(model);
  }
});
goog.addSingletonGetter(icons.ArrowDropDown);


// Register the renderer for icon name
registry.setRenderer('arrow-drop-down', icons.ArrowDropDown.getInstance());

});  // goog.scope
