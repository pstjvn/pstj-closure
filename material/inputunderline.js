/**
 * @fileoverview Provides the underline effect for the material design input.
 * This element is part of the larger input widget. In closure it is better to
 * separate the elements for easier manipulation instead of using one big blob
 * of HTML converted to DOM and trying to manipulate that. We instead rely on
 * the already constructed abstraction of material elements and separte those
 * into smaller pieces that are easier to test and control.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.InputUnderline');
goog.provide('pstj.material.InputUnderlineRenderer');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.State');
goog.require('pstj.material.template');


/**
 * Definition for the input underline element.
 */
pstj.material.InputUnderline = goog.defineClass(pstj.material.Element, {
  /**
   * Implements the underline for the material design input.
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
    // allow focused and disabled states as well as transitioning state.
    this.setSupportedState(goog.ui.Component.State.DISABLED, true);
    this.setSupportedState(goog.ui.Component.State.FOCUSED, true);
    this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
  }
});


/**
 * Implements the renderer for the input underline
 */
pstj.material.InputUnderlineRenderer = goog.defineClass(
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
      getCssClass: function() {
        return pstj.material.InputUnderlineRenderer.CSS_CLASS;
      },


      /** @override */
      getTemplate: function(model) {
        pstj.material.template.InputUnderline(model);
      },


      /** @override */
      generateTemplateData: function(control) {
        return {
          error: control.getContent()
        };
      },


      /**
       * We do not want to make this display none, instead we just want the
       * class name to be set there.
       * @override
       */
      setVisible: function(element, visible) {
        return;
      }

    });


/**
 * @type {string}
 * @final
 */
pstj.material.InputUnderlineRenderer.CSS_CLASS = goog.getCssName(
    'input-underline');


goog.addSingletonGetter(pstj.material.InputUnderlineRenderer);


// Register the default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.InputUnderline,
    pstj.material.InputUnderlineRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.InputUnderlineRenderer.CSS_CLASS, function() {
      return new pstj.material.InputUnderline(null);
    });
