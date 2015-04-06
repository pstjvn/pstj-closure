/**
 * @fileoverview Provides mobile friendly swipe-enabled gallery-like UI
 * component.
 *
 * This is port of the original swiper from longa.com.
 */

goog.provide('pstj.widget.Swipetile');

goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.templates');

goog.scope(function() {
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;


/** @extends {E} */
pstj.widget.Swipetile = goog.defineClass(E, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    E.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * The background image to use for the tile.
     * @type {string}
     */
    this.imageUrl = '';
    /**
     * Text if any to be used in the tile.
     * @type {string}
     */
    this.text = '';
  }
});


/** @extends {ER} */
pstj.widget.SwipetileRenderer = goog.defineClass(ER, {
  constructor: function() {
    ER.call(this);
  },

  /** @override */
  getCssClass: function() {
    return pstj.widget.SwipetileRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.templates.Swipetile(model);
  },

  /** @override */
  generateTemplateData: function(instance) {
    goog.asserts.assertInstanceof(instance, pstj.widget.Swipetile);
    return {
      src: instance.imageUrl,
      text: instance.text
    };
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('pstj-swipetile')
  }
});

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(pstj.widget.Swipetile,
    pstj.widget.SwipetileRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.widget.SwipetileRenderer.CSS_CLASS, function() {
      return new pstj.widget.Swipetile(null);
    });
});  // goog.scope
