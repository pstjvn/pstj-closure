goog.provide('pstj.material.IconRenderer');

goog.require('pstj.material.ElementRenderer');

goog.scope(function() {
var ER = pstj.material.ElementRenderer;


/**
 * Implements the icon renderer. This renderer is the default one and does
 * not provide any icon support, instead you should extend this class
 * and implement the icon SVG command.
 */
pstj.material.IconRenderer = goog.defineClass(ER, {
  /**
   * @constructor
   * @extends {ER}
   * @struct
   */
  constructor: function() {
    goog.base(this);
  },


  /** @inheritDoc */
  getCssClass: function() {
    return pstj.material.IconRenderer.CSS_CLASS;
  },


  /** @inheritDoc */
  getTemplate: function() {
    throw new Error('You should not use this instance directly.' +
        'Instead use the render resolver for icons.');
  },


  /**
   * Sets the 'type' attribute on the Icon's element to a mutation
   * representing state so that the css animation can be applied on it.
   *
   * @param {pstj.material.Icon} control
   * @param {pstj.material.icon.Name} to
   */
  setType: function(control, to) {
    var from = control.type;
    control.getElement().setAttribute(
        'type', 'from-' + from + '-to-' + to);
  },


  /**
   * Set the type attribute to the current icon name.
   */
  resetType: function(control) {
    control.getElement().setAttribute('type', control.type);
  },


  statics: {
    /**
     * The css class name to recognize the item by for decoration and styling.
     * @type {string}
     * @final
     */
    CSS_CLASS: goog.getCssName('material-icon')
  }
});

});  // goog.scope
