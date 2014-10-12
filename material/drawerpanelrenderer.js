/**
 * @fileoverview Provdes the renderer for the drawer panel element. Because the
 * element is taken 1 to 1 from the polymer implementation, the renderer is
 * doing some extra work. This should change with the native implementation
 * coming.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.DrawerPanelRenderer');

goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.template');


goog.scope(function() {


/**
 * Implements the custom renderer logic for drawer panel.
 */
pstj.material.DrawerPanelRenderer = goog.defineClass(
    pstj.material.ElementRenderer, {
      /**
       * @constructor
       * @struct
       * @extends {pstj.material.ElementRenderer}
       */
      constructor: function() {
        pstj.material.ElementRenderer.call(this);
      },


      /** @override */
      getTemplate: function(model) {
        return pstj.material.template.DrawerPanel(model);
      },


      /** @override */
      getCssClass: function() {
        return pstj.material.DrawerPanelRenderer.CSS_CLASS;
      },


      setDrawerWidth: function(control, width) {
        var el = this.querySelector(control.getElement(), '.' + goog.getCssName(
            this.getCssClass(), 'drawer'));
        el.style.width = width + 'px';
      },


      statics: {


        /**
         * The identifying CSS class for the component.
         * @type {string}
         * @final
         */
        CSS_CLASS: goog.getCssName('drawer-panel')
      }
    });


goog.addSingletonGetter(pstj.material.DrawerPanelRenderer);

});  // goog.scope

