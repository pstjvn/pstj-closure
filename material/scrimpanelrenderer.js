goog.provide('pstj.material.ScrimPanelRenderer');

goog.require('pstj.material.ElementRenderer');


goog.scope(function() {


/**
 * Implements the main panel renderer.
 */
pstj.material.ScrimPanelRenderer = goog.defineClass(
    pstj.material.ElementRenderer, {
      /**
       * Implementation of the main panel renderer. The main panel is assumed
       * to takes up all the available space and have an overlay that we call
       * scrim.
       * @constructor
       * @extends {pstj.material.ElementRenderer}
       * @struct
       */
      constructor: function() {
        pstj.material.ElementRenderer.call(this);
      },


      /** @override */
      getCssClass: function() {
        return pstj.material.ScrimPanelRenderer.CSS_CLASS;
      }

    });


/**
 * The class name to identify this renderer and its control in the decorator and
 * ui registry.
 * @type {string}
 * @final
 */
pstj.material.ScrimPanelRenderer.CSS_CLASS = goog.getCssName('scrim-panel');


/**
 * Provide the instance getter utility.
 */
goog.addSingletonGetter(pstj.material.ScrimPanelRenderer);

});  // goog.scope

