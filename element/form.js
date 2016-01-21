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

goog.require('goog.array');
goog.require('goog.functions');
goog.require('pstj.ds.DtoBase');
goog.require('pstj.element.ErrorMsg');
goog.require('pstj.material.Button');
goog.require('pstj.material.Checkbox');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.InputBase');
goog.require('pstj.material.ToggleButton');


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
   * We do not use the ngbind, instead we handle model changes directly.
   * @override
   */
  handleModelChange: function(e) {
    goog.base(this, 'handleModelChange', e);
    this.updateFormElements();
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
    goog.array.forEach(this.querySelectorAll('select'), function(sel) {
      sel.value = sel.options.item(0).value;
    });
    this.getRenderer().clearNativeFormElements(this.getElement());
  },

  /**
   * Implements updating of form elements based on a model. The model is
   * assumed to be compatible with the form element names.
   * @protected
   */
  updateFormElements: function() {
    if (goog.isNull(this.getModel())) return;
    var model = goog.asserts.assertInstanceof(this.getModel(),
        pstj.ds.DtoBase).toJSON();
    this.forEachChild(function(child) {
      var name = child.name;
      if (goog.isDefAndNotNull(model[name])) {
        if (child instanceof pstj.material.InputBase) {
          child.setValue(goog.asserts.assertString(model[name]));
        } else if (child instanceof pstj.material.Checkbox) {
          child.setChecked(!!model[name]);
        } else if (child instanceof pstj.material.ToggleButton) {
          child.setChecked(!!model[name]);
        }
      }
    });
  },

  /**
   * Will try and map the form elements back to the data model.
   * If there is a model set the changed values will be written on it and the
   * CHNAGE event will fire on the model instance.
   *
   * @param {pstj.ds.DtoBase=} opt_model
   * @protected
   */
  updateModelFromElements: function(opt_model) {
    var omodel = null;
    if (goog.isDefAndNotNull(opt_model)) omodel = opt_model;
    else if (!goog.isNull(this.getModel())) omodel = this.getModel();

    if (goog.isNull(omodel)) return;

    var model = goog.asserts.assertInstanceof(omodel,
        pstj.ds.DtoBase).toJSON();
    this.forEachChild(function(child) {
      var name = child.name;
      if (goog.isDefAndNotNull(model[name])) {
        if (child instanceof pstj.material.InputBase) {
          model[name] = child.getValue();
        } else if (child instanceof pstj.material.Checkbox) {
          model[name] = child.isChecked();
        } else if (child instanceof pstj.material.ToggleButton) {
          model[name] = child.isChecked() ? 1 : 0;
        }
      }
    });
    goog.array.forEach(this.querySelectorAll('select'), function(sel) {
      var name = sel.name;
      if (goog.isDefAndNotNull(model[name])) {
        model[name] = sel.value;
      }
    });
    omodel.fromJSON(model);
  },

  /**
   * @override
   * @return {!pstj.element.FormRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        pstj.element.FormRenderer);
  },

  /**
   * Expose the form as a model.
   * @param {?pstj.ds.DtoBase=} opt_model
   */
  updateModel: function(opt_model) {
    this.updateModelFromElements(opt_model);
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
  },

  /**
   * Clears the native HTML form elements.
   * @param {Element} el The rot element to search in.
   */
  clearNativeFormElements: function(el) {
    if (!goog.isNull(el)) {
      goog.array.forEach(el.querySelectorAll('select'), function(s) {
        /** @type {HTMLSelectElement} */(s).value = (
            /** @type {HTMLOptionElement} */(s.options.item(0)).value);
      });
    }
  }
});
