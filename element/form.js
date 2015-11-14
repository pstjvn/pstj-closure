/**
 * @fileoverview Common ancestor for interactive forms in
 * the context of SPA.
 *
 * If you use this element as a base for your form please consider also
 * including the relevant form.less (less/element/form) file in your project.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.element.Form');
goog.provide('pstj.element.FormRenderer');

goog.require('goog.functions');
goog.require('pstj.element.ErrorMsg');
goog.require('pstj.material.Button');
goog.require('pstj.material.Checkbox');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.InputBase');


/** @extends {pstj.material.Element} */
pstj.element.Form = goog.defineClass(pstj.material.Element, {
  /**
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

  /**
   * Shows an error in the form.
   * @param {?string} msg The error text.
   */
  setErrorMessage: function(msg) {
    if (goog.isNull(msg)) {
      this.getRenderer().getErrorMsgElement(this).hideMessage();
    } else {
      this.getRenderer().getErrorMsgElement(this).showMessage(msg);
    }
  },

  /**
   * This is an abstract method, you should override it and implement
   * the validity check of your own.
   * @return {boolean}
   */
  isValid: goog.functions.FALSE,

  /**
   * Completely ignore the state machine and simply enable/disable the
   * action button of the form.
   *
   * @override
   */
  setEnabled: function(enable) {
    this.getRenderer().getSubmitButtonElement(this).setEnabled(enable);
  },

  /**
   * Clears the value from the inputs.
   */
  clear: function() {
    this.forEachChild(function(child) {
      if (child instanceof pstj.material.InputBase) {
        child.setValue('');
      }
    }, this);
  },

  /**
   * @override
   * @return {!pstj.element.FormRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        pstj.element.FormRenderer);
  }
});


/** @extends {pstj.material.ElementRenderer} */
pstj.element.FormRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /**
   * Helper method to retrieve inputs based on child index.
   * @param {pstj.element.Form} ctrl
   * @param {number} index The index of the child to find.
   * @return {!pstj.material.InputBase}
   */
  getInputByIndex: function(ctrl, index) {
    return goog.asserts.assertInstanceof(ctrl.getChildAt(index),
        pstj.material.InputBase);
  },

  /**
   * Helper method to retrieve buttons based on child index.
   * @param {pstj.element.Form} ctrl
   * @param {number} index The index of the child to find.
   * @return {!pstj.material.Button}
   */
  getButtonByIndex: function(ctrl, index) {
    return goog.asserts.assertInstanceof(ctrl.getChildAt(index),
        pstj.material.Button);
  },

  /**
   * Helper method to retrieve buttons based on child index.
   * @param {pstj.element.Form} ctrl
   * @param {number} index The index of the child to find.
   * @return {!pstj.element.ErrorMsg}
   */
  getErrorMsgByIndex: function(ctrl, index) {
    return goog.asserts.assertInstanceof(ctrl.getChildAt(index),
        pstj.element.ErrorMsg);
  },

  /**
   * Helper method to retrieve checkbox based on child index.
   * @param {pstj.element.Form} ctrl
   * @param {number} index The index of the child to find.
   * @return {!pstj.material.Checkbox}
   */
  getCheckboxByIndex: function(ctrl, index) {
    return goog.asserts.assertInstanceof(ctrl.getChildAt(index),
        pstj.material.Checkbox);
  },

  /**
   * Retrieves the error message element.
   *
   * The specific form elements need to override this method.
   *
   * @param {pstj.element.Form} ctrl
   * @return {!pstj.element.ErrorMsg}
   */
  getErrorMsgElement: function(ctrl) {
    throw new Error('Not implemented');
  },

  /**
   * Retrieves the submit button.
   *
   * The specific form elements need to override this method.
   *
   * @param {pstj.element.Form} ctrl
   * @return {!pstj.material.Button}
   */
  getSubmitButtonElement: function(ctrl) {
    throw new Error('Not implemented');
  }
});
