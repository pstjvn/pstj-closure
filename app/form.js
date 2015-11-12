/**
 * @fileoverview Provides common utilities for the forms in Longa.com.
 */

goog.provide('pstj.ui.Form');

goog.require('goog.functions');
goog.require('pstj.material.Element');
goog.require('pstj.material.InputBase');
goog.require('pstj.ui.ErrorMsg');

goog.scope(function() {
var E = pstj.material.Element;


/** @extends {E} */
pstj.ui.Form = goog.defineClass(E, {
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
  },

  /**
   * Shows an error in the form.
   * @param {string} msg The error text.
   */
  setError: function(msg) {
    this.getErrorMessageChild().showMessage(msg);
  },

  /**
   * Hides the current error message if any.
   */
  removeError: function() {
    this.getErrorMessageChild().hideMessage();
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
    this.getActionButton().setEnabled(enable);
  },

  /**
   * Accessor for the error message element. Override if the error message
   * component is not your first child in your template!
   * @protected
   * @return {!pstj.ui.ErrorMessage}
   */
  getErrorMessageChild: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(0),
        pstj.ui.ErrorMessage);
  },

  /**
   * Accessor for the actio button in the form.
   *
   * Override it to match your button if the button is not the last component
   * in your form template.
   *
   * @protected
   * @return {!pstj.material.Button}
   */
  getActionButton: function() {
    return goog.asserts.assertInstanceof(
        this.getChildAt(this.getChildCount() - 1), pstj.material.Button);
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
  }
});
});  // goog.scope

