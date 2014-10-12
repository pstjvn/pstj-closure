/**
 * @fileoverview Provides the default ripple element's renderer.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.RippleRenderer');

goog.require('pstj.material.ElementRenderer');


goog.scope(function() {
var ER = pstj.material.ElementRenderer;


/**
 * Implements the default ripple renderer.
 */
pstj.material.RippleRenderer = goog.defineClass(ER, {
  /**
   * @constructor
   * @extends {ER}
   */
  constructor: function() {
    ER.call(this);
  },


  /** @override */
  getTemplate: function(model) {
    return pstj.material.template.Ripple(model);
  },


  /** @override */
  getCssClass: function() {
    return pstj.material.RippleRenderer.CSS_CLASS;
  },


  statics: {


    /**
     * The css class to recognize the element by.
     * @type {string}
     * @final
     */
    CSS_CLASS: goog.getCssName('ripple')
  }

});

});  // goog.scope
