/**
 * @fileoverview Implementation for the material design input of type text
 * or password. Note that the implementation is inspured and influences by the
 * paper implementation of the design pattern.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('pstj.material.Input');
goog.provide('pstj.material.InputRenderer');

goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.FloatingLabel');
goog.require('pstj.material.InputBody');
goog.require('pstj.material.InputError');
goog.require('pstj.material.InputUnderline');
goog.require('pstj.material.template');


// LABEL
// Input label should be INVISIBLE if
// there is value inputed ||
// there is NO value inputed && type is number && its not valud

// UNDERLINE
// when this is disabled the underline should be set to disabled as
// well so we can match the class name for disabled.

// when this is focused we want the underline to be set to focused as well
// so we can make the animation.

// ERROR


/**
 * Implementation of the imput for materail design projects.
 */
pstj.material.Input = goog.defineClass(pstj.material.Element, {
  /**
   * Provides implementation for the material design inspred input.
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
    /**
     * Reference to the floating label if used.
     * @type {pstj.material.FloatingLabel}
     * @private
     */
    this.floatingLabel_ = null;
    /**
     * Reference to the material underline if used.
     * @type {pstj.material.InputUnderline}
     * @private
     */
    this.underline_ = null;
    /**
     * The error part of the input.
     * @type {pstj.material.InputError}
     * @private
     */
    this.error_ = null;
    /**
     * The actual input body.
     * @type {pstj.material.InputBody}
     * @private
     */
    this.inputBody_ = null;
    /**
     * @type {string}
     */
    this.name = '';
    /**
     * @type {string}
     */
    this.type = 'text';
    /**
     * @type {string}
     */
    this.label = '';
    this.setSupportedState(goog.ui.Component.State.DISABLED, true);
    this.setSupportedState(goog.ui.Component.State.FOCUSED, true);
    this.setAutoEventsInternal();
  },


  /**
   * Here we want to add all the blows and wistles to the base element,
   * which means the floating label, the body, the underline and the error
   * part.
   * @override
   */
  decorateInternal: function(element) {
    goog.base(this, 'decorateInternal', element);
    this.floatingLabel_ = new pstj.material.FloatingLabel(this.getLabel());
    this.inputBody_ = new pstj.material.InputBody();
    this.underline_ = new pstj.material.InputUnderline(null);
    this.error_ = new pstj.material.InputError(this.getErrorMessage());

    this.addChild(this.floatingLabel_, true);
    this.addChild(this.inputBody_, true);
    this.addChild(this.underline_, true);
    this.addChild(this.error_, true);
  },

  /**
   * Getter for the error message that we want to display to the user when
   * the input does not match our requirement.
   * @return {string}
   */
  getErrorMessage: function() {
    return this.getElement().getAttribute('error') || 'Invalid input';
  },


  /** @override */
  setEnable: function(enable) {
    goog.base(this, 'setEnable', enable);
    this.getUnderline().setEnable(enable);
  },


  /**
   * Getter for the underline of the input.
   * @return {pstj.material.InputUnderline}
   */
  getUnderline: function() {
    if (!this.underline_) {
      this.underline_ = new pstj.material.InputUnderline(null);
      // TODO: add inside the element host after the body.
    }
    return this.underline_;
  },

  /**
   * The event should be delegated from the inputbody child.
   * @override
   */
  onPress: function(e) {

  },


  /**
   * The event should be delegated from the input body child.
   * @override
   */
  onRelease: function(e) {
    if (!this.isEnabled() || this.isFocused()) {
      return;
    }
  },

  setLabel: function(label) {

  },

  getLabel: function() {

  }
});



/**
 * Provides the implementation for the renderer for the material input.
 * @constructor
 * @extends {pstj.material.ElementRenderer}
 * @struct
 */
pstj.material.InputRenderer = function() {
  goog.base(this);
};
goog.inherits(pstj.material.InputRenderer, pstj.material.ElementRenderer);
goog.addSingletonGetter(pstj.material.InputRenderer);


/**
 * Flag to signify if the placeholder attribute is supported in the browser.
 * @type {boolean}
 */
pstj.material.InputRenderer.PlaceholderSupported = (
    'placeholder' in document.createElement('input'));


/**
 * @type {string}
 * @final
 */
pstj.material.InputRenderer.CSS_CLASS = goog.getCssName('input');


/** @override */
pstj.material.InputRenderer.prototype.getCssClass = function() {
  return pstj.material.InputRenderer.CSS_CLASS;
};


/** @override */
pstj.material.InputRenderer.prototype.getTemplate = function(model) {
  return pstj.material.template.Input(model);
};


/**
 * @override
 * @param {!pstj.material.Input} input
 * @return {Object.<string, *>}
 */
pstj.material.InputRenderer.prototype.generateTemplateData = function(input) {
  return null;
};


// Register the default renderer.
goog.ui.registry.setDefaultRenderer(pstj.material.Input,
    pstj.material.InputRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    pstj.material.InputRenderer.CSS_CLASS, function() {
      return new pstj.material.Input(null);
    });
