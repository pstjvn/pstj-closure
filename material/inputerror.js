/**
 * @fileoverview Provides the error message portion for the maretial input.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.InputError');
goog.provide('pstj.material.InputErrorRenderer');

goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.template');


/**
 * Implementation
 */
pstj.material.InputError = goog.defineClass(pstj.material.Element, {
  /**
   * @constructor
   * @extends {pstj.material.Element}
   * @struct
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
  },


  /** @override */
  getModel: function() {
    return this.getContent();
  }
});


/** implementation */
pstj.material.InputErrorRenderer = goog.defineClass(
    pstj.material.ElementRenderer, {
      /**
       * @constructor
       * @extends {pstj.material.ElementRenderer}
       * @struct
       */
      constructor: function() {
        pstj.material.ElementRenderer.call(this);
      },


      /** @override */
      generateTemplateData: function(control) {
        return {
          error: control.getModel()
        };
      },


      /** @override */
      getTemplate: function(model) {
        return pstj.material.template.InputError(model);
      }
    });
goog.addSingletonGetter(pstj.material.InputErrorRenderer);


/**
 * @type {string}
 * @final
 */
pstj.material.InputErrorRenderer.CSS_CLASS = goog.getCssName('input-error');


// Register the default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.InputError,
    pstj.material.InputErrorRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.InputErrorRenderer.CSS_CLASS, function() {
      return new pstj.material.InputError(null);
    });
