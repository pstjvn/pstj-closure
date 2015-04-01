/**
 * @fileoverview Provides implementation for material design input element.
 *
 * The implementation tries to stay as close to the Android view as possible.
 */

goog.provide('pstj.material.MaterialInput');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
// we should suppres this additional requirement but we need it for the
// warning icon
goog.require('pstj.material.IconContainer');
goog.require('pstj.material.MaterialInputRenderer');
goog.require('pstj.material.State');


goog.scope(function() {
var Parent = pstj.material.Element;
var registry = goog.ui.registry;


/**
 * @extends {Parent}
 */
pstj.material.MaterialInput = goog.defineClass(Parent, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    Parent.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * The name of the input to use: used for form submission.
     * @type {string}
     */
    this.name = '';
    /**
     * The type of the native input element to use.
     * @type {string}
     */
    this.type = '';
    /**
     * The current value of the input as presented to the user and used in
     * forms.
     * @type {string}
     */
    this.value = '';
    /**
     * The label to be used for the input. It should be a descriptive
     * string for the UX.
     * @type {string}
     */
    this.label = '';
    /**
     * Holds reference to the current error text displayed to the UI.
     * @type {string}
     */
    this.errorText = '';

    // this.floatingLabel_ = false;
    // /**
    // * The regular expression to match the input value for validation.
    // * @type {RegExp}
    // */
    // this.pattern_ = null;

    // Configure the states the element supports
    this.setSupportedState(goog.ui.Component.State.DISABLED, true);
    this.setSupportedState(goog.ui.Component.State.FOCUSED, true);
    this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
    this.setSupportedState(goog.ui.Component.State.INVALID, true);
    this.setSupportedState(goog.ui.Component.State.INVISIBLE, true);
    this.setSupportedState(goog.ui.Component.State.EMPTY, true);
  }
});

registry.setDefaultRenderer(pstj.material.MaterialInput,
    pstj.material.MaterialInputRenderer);

// Register decorator factory function.
registry.setDecoratorByClassName(pstj.material.MaterialInputRenderer.CSS_CLASS,
    function() {
      return new pstj.material.MaterialInput(null);
    });


});  // goog.scope
