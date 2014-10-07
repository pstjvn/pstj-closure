goog.provide('pstj.material.HeaderPanelRenderer');

goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.template');


goog.scope(function() {


/**
 * Implementation for the header panel renderer.
 */
pstj.material.HeaderPanelRenderer = goog.defineClass(
    pstj.material.ElementRenderer, {
      /**
       * Do not use the constructor, instead use the getInstance satic method.
       * @constructor
       * @extends {pstj.material.ElementRenderer}
       * @struct
       */
      constructor: function() {
        pstj.material.ElementRenderer.call(this);
      },


      /** @override */
      getTemplate: function(model) {
        return pstj.material.template.HeaderPanel(model);
      },


      /** @override */
      getCssClass: function() {
        return pstj.material.HeaderPanelRenderer.CSS_CLASS;
      }

    });


/**
 * The CSS name to recognize the control.
 * @type {string}
 * @final
 */
pstj.material.HeaderPanelRenderer.CSS_CLASS = goog.getCssName('header-panel');


goog.addSingletonGetter(pstj.material.HeaderPanelRenderer);

});  // goog.scope

