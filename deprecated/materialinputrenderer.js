goog.provide('pstj.material.MaterialInputRenderer');

goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.InputInterface');
goog.require('pstj.material.template');

goog.scope(function() {
var Parent = pstj.material.ElementRenderer;


/**
 * @extends {Parent}
 */
pstj.material.MaterialInputRenderer = goog.defineClass(Parent, {

  constructor: function() {
    Parent.call(this);
  },

  /** @override */
  getCssClass: function() {
    return pstj.material.MaterialInputRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return pstj.material.template.MaterialInput(model);
  },

  /**
   * @override
   */
  generateTemplateData: function(mi) {
    goog.asserts.assertInstanceof(mi, pstj.material.MaterialInput);
    return {
      type: mi.type,
      name: mi.name,
      value: mi.value,
      label: mi.label,
      error: mi.errorText
    };
  },

  /**
   * Retrieves the input element used by the component's DOM structure.
   * @param {Element} root
   * @return {Element}
   */
  getInputElement: function(root) {
    return root.querySelector('input');
  },



  statics: {
    /**
     * @const
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('material-input')
  }
});

});  // goog.scope
